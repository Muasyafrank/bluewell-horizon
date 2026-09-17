from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Order, OrderItem, Product, Customer
from schemas.orders import CheckoutRequest, CheckoutResponse, OrderResponse
from core.security import get_current_customer
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api", tags=["Orders"])

@router.post("/orders/checkout", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
def checkout(checkout_data: CheckoutRequest, db: Session = Depends(get_db)):
    try:
        # Generate order number
        import time
        order_number = f"BW-{int(time.time())}"

        # Create order
        new_order = Order(
            order_number=order_number,
            customer_name=checkout_data.customerName,
            customer_email=checkout_data.customerEmail,
            customer_phone=checkout_data.customerPhone,
            company_name=checkout_data.companyName,
            kra_pin=checkout_data.kraPin,
            county=checkout_data.county,
            constituency=checkout_data.constituency,
            estate=checkout_data.estate,
            street_address=checkout_data.streetAddress,
            building_name=checkout_data.buildingName,
            apartment_number=checkout_data.apartmentNumber,
            po_box=checkout_data.poBox,
            postal_code=checkout_data.postalCode,
            delivery_method=checkout_data.deliveryMethod,
            delivery_fee=checkout_data.deliveryFee,
            payment_method=checkout_data.paymentMethod,
            mpesa_phone=checkout_data.mpesaPhone,
            mpesa_reference=checkout_data.mpesaReference,
            subtotal=checkout_data.subtotal,
            vat_amount=checkout_data.vatAmount,
            total_amount=checkout_data.totalAmount,
            notes=checkout_data.notes,
            order_status="processing"
        )
        db.add(new_order)
        db.flush()  # Get the order ID

        # Create order items and update stock
        for item in checkout_data.items:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item.id,
                quantity=item.quantity,
                price=item.price
            )
            db.add(order_item)

            # Decrement product stock
            product = db.query(Product).filter(Product.id == item.id).first()
            if product:
                product.stock = max(0, product.stock - item.quantity)

        db.commit()

        # Send confirmation email (optional, wrapped in try-catch)
        try:
            send_order_confirmation_email(new_order, checkout_data.items)
        except Exception as e:
            print(f"Email sending failed: {e}")

        return {
            "message": "Order placed successfully",
            "orderNumber": order_number
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error placing order: {str(e)}"
        )

@router.get("/customers/orders", response_model=List[OrderResponse])
def get_customer_orders(
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(
        Order.customer_id == current_customer.id
    ).order_by(Order.created_at.desc()).all()
    return orders

def send_order_confirmation_email(order: Order, items: list):
    """Send order confirmation email to customer"""
    try:
        email_user = os.getenv("EMAIL_USER")
        email_pass = os.getenv("EMAIL_PASS")

        if not email_user or not email_pass:
            print("Email credentials not configured")
            return

        msg = MIMEMultipart()
        msg['From'] = email_user
        msg['To'] = order.customer_email
        msg['Subject'] = f"Order Confirmation - {order.order_number}"

        body = f"""
        <h2>Thank you for your order!</h2>
        <p>Dear {order.customer_name},</p>
        <p>Your order <strong>{order.order_number}</strong> has been received and is being processed.</p>
        <p><strong>Total Amount:</strong> KES {order.total_amount:,.2f}</p>
        <p><strong>Payment Method:</strong> {order.payment_method}</p>
        <p>We will contact you shortly with delivery details.</p>
        <br/>
        <p>Best regards,<br/>Bluewell Horizon Team</p>
        """

        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(email_user, email_pass)
        server.send_message(msg)
        server.quit()

    except Exception as e:
        print(f"Error sending email: {e}")
        raise