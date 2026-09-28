from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Order, OrderItem, Product, Customer
from schemas.orders import CheckoutRequest, CheckoutResponse, OrderResponse
from core.security import get_current_customer, get_current_customer_optional
from core.email import send_email

router = APIRouter(prefix="/api", tags=["Orders"])


@router.post("/orders/checkout", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
def checkout(
    checkout_data: CheckoutRequest,
    db: Session = Depends(get_db),
    # Checkout works for guests, but if the visitor is signed in the order is
    # linked to their account so it shows up in their order history. Before
    # this fix, `Order.customer_id` was never set even though the frontend
    # sent the bearer token — every order was orphaned.
    customer: Optional[Customer] = Depends(get_current_customer_optional),
):
    try:
        new_order = Order(
            # order_number is set after the insert, once we have a real id to
            # build it from — see below.
            order_number="PENDING",
            customer_id=customer.id if customer else None,
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
            order_status="processing",
        )
        db.add(new_order)
        db.flush()  # assigns new_order.id

        # The order number used to be derived from time.time() truncated to
        # whole seconds, so two checkouts in the same second collided on the
        # UNIQUE constraint and the second one failed with a 500. The
        # database-assigned id is unique by construction, so build the
        # public-facing number from that instead.
        new_order.order_number = f"BW-{datetime.utcnow():%Y%m%d}-{new_order.id:05d}"

        for item in checkout_data.items:
            db.add(OrderItem(
                order_id=new_order.id,
                product_id=item.id,
                quantity=item.quantity,
                price=item.price,
            ))

            product = db.query(Product).filter(Product.id == item.id).first()
            if product:
                product.stock = max(0, product.stock - item.quantity)

        db.commit()

        try:
            send_order_confirmation_email(new_order, checkout_data.items)
        except Exception as exc:  # pragma: no cover — email is best-effort
            print(f"Order confirmation email failed: {exc}")

        return {"message": "Order placed successfully", "orderNumber": new_order.order_number}

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error placing order: {exc}",
        )


@router.get("/customers/orders", response_model=List[OrderResponse])
def get_customer_orders(
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(Order.customer_id == current_customer.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    # Built as a plain dict rather than OrderResponse.model_validate(order):
    # the ORM's `Order.items` relationship (a list of OrderItem rows) has the
    # same attribute name as the schema's `items` field (a list of
    # OrderItemDetail), so automatic attribute-based validation tried to
    # validate raw OrderItem objects against OrderItemDetail and failed every
    # time. Building the dict by hand avoids that name collision.
    result = []
    for order in orders:
        items = []
        for item in order.items:
            product = item.product
            items.append({
                "id": item.id,
                "productId": item.product_id,
                "quantity": item.quantity,
                "price": float(item.price),
                "name": product.name if product else "Product",
                "image": product.image if product else None,
                "category": product.category if product else None,
            })
        result.append({
            "id": order.id,
            "orderNumber": order.order_number,
            "customerName": order.customer_name,
            "customerEmail": order.customer_email,
            "customerPhone": order.customer_phone,
            "county": order.county,
            "estate": order.estate,
            "streetAddress": order.street_address,
            "deliveryMethod": order.delivery_method,
            "paymentMethod": order.payment_method,
            "subtotal": float(order.subtotal),
            "deliveryFee": float(order.delivery_fee),
            "vatAmount": float(order.vat_amount),
            "totalAmount": float(order.total_amount),
            "orderStatus": order.order_status,
            "createdAt": order.created_at,
            "items": items,
        })
    return result


def send_order_confirmation_email(order: Order, items: list) -> None:
    send_email(
        subject=f"Order confirmation — {order.order_number}",
        to=order.customer_email,
        body=f"""
        <h2>Thank you for your order!</h2>
        <p>Dear {order.customer_name},</p>
        <p>Your order <strong>{order.order_number}</strong> has been received and is being processed.</p>
        <p><strong>Total amount:</strong> KES {order.total_amount:,.2f}</p>
        <p><strong>Payment method:</strong> {order.payment_method}</p>
        <p>We will contact you shortly with delivery details.</p>
        <br/>
        <p>Best regards,<br/>Bluewell Horizon Team</p>
        """,
    )
