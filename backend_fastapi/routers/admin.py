from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import os
import shutil
import json

from database import get_db
from models import (
    Admin, Order, OrderItem, Product, Contact, 
    CompanyInfo, Quote, Service, Technology, 
    Gallery, ProcessStep
)
from schemas.admin import (
    DashboardStats, StatusUpdate, ContactResponse,
    ProductCreate, ServiceCreate, GalleryCreate,
    TechnologyCreate, ProcessStepCreate, QuoteResponse
)
from core.security import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ============================================
# DASHBOARD STATISTICS
# ============================================
@router.get("/stats", response_model=DashboardStats)
def get_stats(
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.order_status == "processing").count()
    completed_orders = db.query(Order).filter(Order.order_status == "delivered").count()
    total_inquiries = db.query(Contact).count()
    unread_inquiries = db.query(Contact).filter(Contact.is_read == False).count()
    total_products = db.query(Product).count()

    orders = db.query(Order).all()
    total_revenue = sum(float(o.total_amount) for o in orders)

    now = datetime.now()
    monthly_revenue = sum(
        float(o.total_amount) for o in orders
        if o.created_at and o.created_at.month == now.month and o.created_at.year == now.year
    )

    return {
        "totalOrders": total_orders,
        "pendingOrders": pending_orders,
        "completedOrders": completed_orders,
        "totalInquiries": total_inquiries,
        "unreadInquiries": unread_inquiries,
        "totalProducts": total_products,
        "totalRevenue": total_revenue,
        "monthlyRevenue": monthly_revenue
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

    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    items_list = []
    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        items_list.append({
            "id": item.id,
            "orderId": item.order_id,
            "productId": item.product_id,
            "quantity": item.quantity,
            "price": float(item.price),
            "Product": {
                "name": product.name if product else "Unknown",
                "image": product.image if product else None,
                "category": product.category if product else None
            }
        })

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

@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status_data: StatusUpdate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    valid_statuses = ["processing", "confirmed", "shipped", "delivered", "cancelled"]
    if status_data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    order.order_status = status_data.status
    db.commit()

    # Send email notification (optional)
    try:
        send_status_email(order, status_data.status)
    except Exception as e:
        print(f"Email notification failed: {e}")

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
        image=gallery.image
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
    info: dict,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(CompanyInfo).first()
    if existing:
        for key, value in info.items():
            if hasattr(existing, key):
                setattr(existing, key, value)
    else:
        new_info = CompanyInfo(**info)
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
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin)
):
    # Create uploads directory if it doesn't exist
    upload_dir = "static/uploads"
    os.makedirs(upload_dir, exist_ok=True)

    # Generate unique filename
    import time
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{int(time.time())}_{file.filename}"
    file_path = os.path.join(upload_dir, unique_filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Return the path that matches what the frontend expects
    image_path = f"/images/{unique_filename}"
    return {"imagePath": image_path}

# ============================================
# EMAIL HELPER
# ============================================
def send_status_email(order, new_status: str):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from dotenv import load_dotenv
    load_dotenv()

    email_user = os.getenv("EMAIL_USER")
    email_pass = os.getenv("EMAIL_PASS")
    if not email_user or not email_pass:
        return

    status_messages = {
        "processing": "Your order is being processed.",
        "confirmed": "Your order has been confirmed and is being prepared.",
        "shipped": "Your order has been shipped and is on its way!",
        "delivered": "Your order has been delivered. Thank you for choosing Bluewell Horizon!",
        "cancelled": "Your order has been cancelled. Please contact us for more information."
    }

    msg = MIMEMultipart()
    msg['From'] = email_user
    msg['To'] = order.customer_email
    msg['Subject'] = f"Order Update - {order.order_number}"

    body = f"""
    <h2>Order Status Update</h2>
    <p>Dear {order.customer_name},</p>
    <p>Your order <strong>{order.order_number}</strong> status has been updated to: 
    <strong style="color: #2fa5b6; text-transform: uppercase;">{new_status}</strong></p>
    <p>{status_messages.get(new_status, '')}</p>
    <p>For any inquiries, contact us at 0721-633-223 or bluewellsynergy@gmail.com</p>
    <br/>
    <p>Best regards,<br/>Bluewell Horizon Team</p>
    """

    msg.attach(MIMEText(body, 'html'))
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(email_user, email_pass)
    server.send_message(msg)
    server.quit()