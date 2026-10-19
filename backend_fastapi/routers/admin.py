import json
import os
import uuid
from datetime import datetime
from html import escape

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import (
    Admin, Invoice, Order, OrderItem, Product, Contact, 
    CompanyInfo, Quote, Service, Technology, 
    Gallery, ProcessStep, StockMovement
)
from schemas.admin import (
    DashboardStats, StatusUpdate,
    ProductCreate, ServiceCreate, GalleryCreate,
    TechnologyCreate, ProcessStepCreate,
)
from schemas.company_info import CompanyInfoUpdate
from schemas.products import AdminProductResponse
from core.security import get_current_admin
from core.invoicing import InsufficientStock, move_stock
from core.email import send_email_safely

router = APIRouter(prefix="/api/admin", tags=["Admin"])

ORDER_STATUSES = ("processing", "quoted", "confirmed", "shipped", "delivered", "cancelled")

# Uploads are restricted to a short allow-list of raster image types, and the
# stored extension comes from the *detected* type rather than the client's
# filename. Serving a user-named .html or .svg from /uploads would be a stored
# XSS vector.
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "uploads")

# ============================================
# DASHBOARD STATISTICS
# ============================================
@router.get("/stats", response_model=DashboardStats)
def get_stats(
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Everything here is computed by the database. The previous version loaded
    # every order into memory just to add up two totals.
    def count(column, *criteria) -> int:
        return db.query(func.count(column)).filter(*criteria).scalar() or 0

    def revenue(*criteria) -> float:
        total = db.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(*criteria).scalar()
        return float(total or 0)

    now = datetime.now()

    # Top five products by units ordered, summed by the database. (The
    # dashboard used to derive this from the orders list, which never includes
    # line items, so the panel was always empty.)
    popular = (
        db.query(Product.name, func.sum(OrderItem.quantity))
        .join(OrderItem, OrderItem.product_id == Product.id)
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )

    return {
        "totalOrders": count(Order.id),
        "pendingOrders": count(Order.id, Order.order_status == "processing"),
        "completedOrders": count(Order.id, Order.order_status == "delivered"),
        "totalInquiries": count(Contact.id),
        "unreadInquiries": count(Contact.id, Contact.is_read.is_(False)),
        "totalProducts": count(Product.id),
        "totalRevenue": revenue(),
        "monthlyRevenue": revenue(
            func.extract("year", Order.created_at) == now.year,
            func.extract("month", Order.created_at) == now.month,
        ),
        "popularProducts": [{"name": name, "quantity": int(qty or 0)} for name, qty in popular],
    }

# ============================================
# ORDER MANAGEMENT
# ============================================
@router.get("/orders")
def get_orders(
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        result.append({
            "id": o.id,
            "orderNumber": o.order_number,
            "customerName": o.customer_name,
            "customerEmail": o.customer_email,
            "customerPhone": o.customer_phone,
            "county": o.county,
            "estate": o.estate,
            "streetAddress": o.street_address,
            "deliveryMethod": o.delivery_method,
            "paymentMethod": o.payment_method,
            "subtotal": float(o.subtotal),
            "deliveryFee": float(o.delivery_fee),
            "vatAmount": float(o.vat_amount),
            "totalAmount": float(o.total_amount),
            "orderStatus": o.order_status,
            "notes": o.notes,
            "createdAt": o.created_at.isoformat() if o.created_at else None
        })
    return result

@router.get("/orders/{order_id}")
def get_order_detail(
    order_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # One joined query. The old loop looked the product up separately for
    # every line item (N+1 queries per order).
    rows = (
        db.query(OrderItem, Product)
        .outerjoin(Product, Product.id == OrderItem.product_id)
        .filter(OrderItem.order_id == order.id)
        .all()
    )
    items_list = [
        {
            "id": item.id,
            "orderId": item.order_id,
            "productId": item.product_id,
            "quantity": item.quantity,
            "price": float(item.price),
            "Product": {
                "name": product.name if product else "Unknown",
                "image": product.image if product else None,
                "category": product.category if product else None,
            },
        }
        for item, product in rows
    ]

    order_dict = {
        "id": order.id,
        "orderNumber": order.order_number,
        "customerName": order.customer_name,
        "customerEmail": order.customer_email,
        "customerPhone": order.customer_phone,
        "county": order.county,
        "estate": order.estate,
        "streetAddress": order.street_address,
        "paymentMethod": order.payment_method,
        "totalAmount": float(order.total_amount),
        "orderStatus": order.order_status,
        "notes": order.notes,
        "createdAt": order.created_at.isoformat() if order.created_at else None
    }

    return {"order": order_dict, "items": items_list}

def _restock(db: Session, order: Order, direction: int, reason: str, admin: Admin) -> None:
    """Puts an order's goods back in stock (cancel) or takes them out again (reopen)."""
    for item in db.query(OrderItem).filter(OrderItem.order_id == order.id).all():
        product = db.get(Product, item.product_id)
        if product is None:
            continue
        quantity = item.quantity
        if direction > 0:
            # Give back only what this order actually took. If stock ran short when it
            # was placed, the order took less than it asked for.
            taken = -(db.query(func.coalesce(func.sum(StockMovement.change), 0))
                      .filter(StockMovement.product_id == product.id,
                              StockMovement.reference == order.order_number).scalar() or 0)
            quantity = max(0, min(quantity, taken))
        if quantity:
            move_stock(db, product, direction * quantity, reason, reference=order.order_number,
                       note="Order cancelled" if direction > 0 else "Order reopened", by=admin.display_name)


@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status_data: StatusUpdate,
    background_tasks: BackgroundTasks,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if status_data.status not in ORDER_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")

    was_cancelled = order.order_status == "cancelled"
    will_cancel = status_data.status == "cancelled"
    if will_cancel and not was_cancelled:
        if db.query(Invoice).filter(Invoice.order_id == order.id, Invoice.status != "void").first():
            raise HTTPException(status_code=409, detail="This order has an invoice. Void the invoice before cancelling it.")
        _restock(db, order, +1, "return", admin)
    elif was_cancelled and not will_cancel:
        try:
            _restock(db, order, -1, "sale", admin)
        except InsufficientStock as error:
            raise HTTPException(status_code=409, detail=f"Not enough stock to reopen this order: {error}")

    order.order_status = status_data.status
    db.commit()

    # The notification goes out after the response is sent: SMTP can take
    # seconds, and the admin should not wait on a mail server to see "updated".
    background_tasks.add_task(
        notify_status_change,
        order.order_number, order.customer_name, order.customer_email, status_data.status,
    )

    return {"message": f"Order status updated to {status_data.status}"}

@router.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.query(OrderItem).filter(OrderItem.order_id == order.id).delete()
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}

# ============================================
# CONTACT / INQUIRY MANAGEMENT
# ============================================
@router.get("/contacts")
def get_contacts(
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    contacts = db.query(Contact).order_by(Contact.created_at.desc()).all()
    result = []
    for c in contacts:
        result.append({
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "service": c.service,
            "message": c.message,
            "isRead": c.is_read,
            "createdAt": c.created_at.isoformat() if c.created_at else None
        })
    return result

@router.put("/contacts/{contact_id}/read")
def mark_contact_read(
    contact_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    contact.is_read = True
    db.commit()
    return {"message": "Inquiry marked as read"}

@router.delete("/contacts/{contact_id}")
def delete_contact(
    contact_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    db.delete(contact)
    db.commit()
    return {"message": "Inquiry deleted successfully"}

# ============================================
# PRODUCT CRUD
# ============================================
@router.get("/products")
def list_products(
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """The catalogue including each product's internal price. The public
    /api/products leaves the price out."""
    products = db.query(Product).order_by(Product.id).all()
    return [AdminProductResponse.model_validate(p).model_dump(by_alias=True) for p in products]

@router.post("/products")
def create_product(
    product: ProductCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        category=product.category,
        image=product.image,
        stock=product.stock
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"message": "Product created", "id": new_product.id}

@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Product).filter(Product.id == product_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")

    existing.name = product.name
    existing.description = product.description
    existing.price = product.price
    existing.category = product.category
    if product.image:
        existing.image = product.image
    existing.stock = product.stock
    db.commit()
    return {"message": "Product updated"}

@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}

# ============================================
# SERVICE CRUD
# ============================================
@router.post("/services")
def create_service(
    service: ServiceCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_service = Service(
        title=service.title,
        short_desc=service.shortDesc,
        description=service.description,
        icon=service.icon,
        image=service.image,
        features=json.dumps(service.features) if service.features else None,
        applications=json.dumps(service.applications) if service.applications else None,
        benefits=service.benefits
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return {"message": "Service created", "id": new_service.id}

@router.put("/services/{service_id}")
def update_service(
    service_id: int,
    service: ServiceCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Service).filter(Service.id == service_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")

    existing.title = service.title
    existing.short_desc = service.shortDesc
    existing.description = service.description
    existing.icon = service.icon
    if service.image:
        existing.image = service.image
    existing.features = json.dumps(service.features) if service.features else None
    existing.applications = json.dumps(service.applications) if service.applications else None
    existing.benefits = service.benefits
    db.commit()
    return {"message": "Service updated"}

@router.delete("/services/{service_id}")
def delete_service(
    service_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    db.delete(service)
    db.commit()
    return {"message": "Service deleted"}

# ============================================
# GALLERY CRUD
# ============================================
@router.post("/gallery")
def create_gallery(
    gallery: GalleryCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_gallery = Gallery(
        title=gallery.title,
        category=gallery.category,
        image=gallery.image,
        location=gallery.location or None,
        year=gallery.year,
        description=gallery.description or None,
    )
    db.add(new_gallery)
    db.commit()
    db.refresh(new_gallery)
    return {"message": "Gallery image added", "id": new_gallery.id}

@router.put("/gallery/{gallery_id}")
def update_gallery(
    gallery_id: int,
    gallery: GalleryCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Gallery).filter(Gallery.id == gallery_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Gallery item not found")

    existing.title = gallery.title
    existing.category = gallery.category
    if gallery.image:
        existing.image = gallery.image
    existing.location = gallery.location or None
    existing.year = gallery.year
    existing.description = gallery.description or None
    db.commit()
    return {"message": "Gallery updated"}

@router.delete("/gallery/{gallery_id}")
def delete_gallery(
    gallery_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    gallery = db.query(Gallery).filter(Gallery.id == gallery_id).first()
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery item not found")

    db.delete(gallery)
    db.commit()
    return {"message": "Gallery item deleted"}

# ============================================
# TECHNOLOGY CRUD
# ============================================
@router.post("/technologies")
def create_technology(
    tech: TechnologyCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_tech = Technology(
        name=tech.name,
        description=tech.description,
        icon=tech.icon,
        image=tech.image
    )
    db.add(new_tech)
    db.commit()
    db.refresh(new_tech)
    return {"message": "Technology created", "id": new_tech.id}

@router.put("/technologies/{tech_id}")
def update_technology(
    tech_id: int,
    tech: TechnologyCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Technology).filter(Technology.id == tech_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Technology not found")

    existing.name = tech.name
    existing.description = tech.description
    existing.icon = tech.icon
    if tech.image:
        existing.image = tech.image
    db.commit()
    return {"message": "Technology updated"}

@router.delete("/technologies/{tech_id}")
def delete_technology(
    tech_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    tech = db.query(Technology).filter(Technology.id == tech_id).first()
    if not tech:
        raise HTTPException(status_code=404, detail="Technology not found")

    db.delete(tech)
    db.commit()
    return {"message": "Technology deleted"}

# ============================================
# PROCESS STEP CRUD
# ============================================
@router.post("/process-steps")
def create_process_step(
    step: ProcessStepCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_step = ProcessStep(
        step_number=step.stepNumber,
        title=step.title,
        description=step.description
    )
    db.add(new_step)
    db.commit()
    db.refresh(new_step)
    return {"message": "Process step created", "id": new_step.id}

@router.put("/process-steps/{step_id}")
def update_process_step(
    step_id: int,
    step: ProcessStepCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(ProcessStep).filter(ProcessStep.id == step_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Process step not found")

    existing.step_number = step.stepNumber
    existing.title = step.title
    existing.description = step.description
    db.commit()
    return {"message": "Process step updated"}

@router.delete("/process-steps/{step_id}")
def delete_process_step(
    step_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    step = db.query(ProcessStep).filter(ProcessStep.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Process step not found")

    db.delete(step)
    db.commit()
    return {"message": "Process step deleted"}

# ============================================
# COMPANY INFO UPDATE
# ============================================
@router.put("/company-info")
def update_company_info(
    info: CompanyInfoUpdate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # `info` arrived as a validated CompanyInfoUpdate (camelCase in, snake_case
    # fields out), not a raw dict — see the schema's docstring for why the old
    # `dict` version never actually saved anything.
    updates = info.model_dump(exclude_unset=True)
    existing = db.query(CompanyInfo).first()
    if existing:
        for key, value in updates.items():
            setattr(existing, key, value)
    else:
        new_info = CompanyInfo(**updates)
        db.add(new_info)
    db.commit()
    return {"message": "Company information updated successfully"}

# ============================================
# QUOTE MANAGEMENT
# ============================================
@router.get("/quotes")
def get_quotes(
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    quotes = db.query(Quote).order_by(Quote.created_at.desc()).all()
    result = []
    for q in quotes:
        result.append({
            "id": q.id,
            "name": q.name,
            "email": q.email,
            "phone": q.phone,
            "companyName": q.company_name,
            "serviceType": q.service_type,
            "projectDetails": q.project_details,
            "status": q.status,
            "createdAt": q.created_at.isoformat() if q.created_at else None
        })
    return result

# ============================================
# IMAGE UPLOAD
# ============================================
@router.post("/upload")
async def upload_image(
    # The field is named `image` because that is what the frontend has always
    # sent. The endpoint used to declare `file`, so every upload was rejected
    # with a 422 before reaching this function.
    image: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    extension = ALLOWED_IMAGE_TYPES.get(image.content_type)
    if extension is None:
        raise HTTPException(status_code=415, detail="Upload a JPEG, PNG, WebP or GIF image.")

    # Read one byte past the limit so an oversized file is detected without
    # buffering all of it.
    contents = await image.read(MAX_UPLOAD_BYTES + 1)
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Images must be smaller than 5 MB.")
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{extension}"
    with open(os.path.join(UPLOAD_DIR, filename), "wb") as buffer:
        buffer.write(contents)

    # Served under /uploads/ rather than /images/ because the frontend's own
    # bundled assets already use /images/, and sharing the prefix made the two
    # impossible to tell apart (see assetUrl() in the frontend API client).
    return {"imagePath": f"/uploads/{filename}"}

# ============================================
# EMAIL HELPER
# ============================================
def notify_status_change(order_number: str, customer_name: str, customer_email: str, new_status: str) -> None:
    """Emails a customer that their order status changed.

    Takes plain values rather than the ORM object because it runs after the
    request's database session has closed.
    """
    status_messages = {
        "processing": "Your order is being processed.",
        "quoted": "We have sent you a quotation with the payment details. Please check your email.",
        "confirmed": "Your order has been confirmed and is being prepared.",
        "shipped": "Your order has been shipped and is on its way!",
        "delivered": "Your order has been delivered. Thank you for choosing Bluewell Horizon!",
        "cancelled": "Your order has been cancelled. Please contact us for more information.",
    }

    send_email_safely(
        subject=f"Order update — {order_number}",
        to=customer_email,
        body=f"""
        <h2>Order status update</h2>
        <p>Dear {escape(customer_name)},</p>
        <p>Your order <strong>{escape(order_number)}</strong> status has been updated to:
        <strong style="color: #2fa5b6; text-transform: uppercase;">{escape(new_status)}</strong></p>
        <p>{status_messages.get(new_status, '')}</p>
        <p>For any inquiries, contact us at 0721 633 223 or bluewellsynergy@gmail.com</p>
        <br/>
        <p>Best regards,<br/>Bluewell Horizon Team</p>
        """,
    )
