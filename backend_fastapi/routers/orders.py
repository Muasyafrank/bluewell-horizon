import logging
from collections import Counter
from datetime import datetime, timezone
from html import escape
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.email import send_email_safely
from core.security import get_current_customer, get_current_customer_optional
from database import get_db
from models import Customer, Order, OrderItem, Product
from schemas.orders import CheckoutRequest, CheckoutResponse, OrderResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Orders"])


@router.post("/orders/checkout", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
def checkout(
    checkout_data: CheckoutRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    # Checkout works for guests, but if the visitor is signed in the order is
    # linked to their account so it shows up in their order history.
    customer: Optional[Customer] = Depends(get_current_customer_optional),
):
    # Resolve every product up front, in one query. An order that references a
    # product that does not exist is a client error, not a database crash.
    requested = Counter()
    for item in checkout_data.items:
        requested[item.id] += item.quantity
    products = {
        p.id: p for p in db.query(Product).filter(Product.id.in_(list(requested))).all()
    }
    missing = sorted(set(requested) - set(products))
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Some items in your cart are no longer available. Please refresh the shop and try again.",
        )

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

        # Built from the database-assigned id, which is unique by construction.
        # (A timestamp-derived number collided when two orders landed in the
        # same second.)
        new_order.order_number = f"BW-{datetime.now(timezone.utc):%Y%m%d}-{new_order.id:05d}"

        for item in checkout_data.items:
            db.add(OrderItem(
                order_id=new_order.id,
                product_id=item.id,
                quantity=item.quantity,
                price=item.price,
            ))

        for product_id, quantity in requested.items():
            product = products[product_id]
            product.stock = max(0, (product.stock or 0) - quantity)

        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Checkout failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We couldn't place your order. Please try again.",
        )

    background_tasks.add_task(
        send_email_safely,
        subject=f"Order confirmation — {new_order.order_number}",
        to=checkout_data.customerEmail,
        body=f"""
        <h2>Thank you for your order!</h2>
        <p>Dear {escape(checkout_data.customerName)},</p>
        <p>Your order <strong>{escape(new_order.order_number)}</strong> has been received and is being processed.</p>
        <p>We will contact you shortly to confirm delivery and arrange payment.</p>
        <br/>
        <p>Best regards,<br/>Bluewell Horizon Team</p>
        """,
    )
    return {"message": "Order placed successfully", "orderNumber": new_order.order_number}


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
