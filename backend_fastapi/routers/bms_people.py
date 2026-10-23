"""Business system: who is signed in, the customer directory, and staff accounts."""
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from core.invoicing import balance, payment_status
from core.pagination import PageParams, page_params, paginate_list
from core.permissions import ROLE_LABELS, modules_for, require
from core.quotation import money
from core.security import get_current_staff, get_password_hash
from database import get_db
from models import Admin, Customer, CustomerNote, Invoice, Order
from schemas.bms import NoteRequest, StaffCreate, StaffUpdate

router = APIRouter(prefix="/api/bms", tags=["Business system"])


def serialise_staff(admin: Admin) -> dict:
    return {
        "id": admin.id,
        "name": admin.display_name,
        "email": admin.email,
        "role": admin.effective_role,
        "roleLabel": ROLE_LABELS.get(admin.effective_role, admin.effective_role),
        "isActive": admin.active,
    }


@router.get("/me")
def me(admin: Admin = Depends(get_current_staff)):
    return {**serialise_staff(admin), "modules": modules_for(admin.effective_role)}


# ---------------------------------------------------------------- customers

def _key(email: str | None) -> str:
    return (email or "").strip().lower()


@router.get("/customers")
def list_customers(
    params: PageParams = Depends(page_params),
    q: str | None = Query(None, max_length=100),
    admin: Admin = Depends(require("customers")),
    db: Session = Depends(get_db),
):
    """One row per email address, combining website accounts, orders and invoices."""
    people: dict[str, dict] = {}

    def entry(email: str, name: str) -> dict:
        return people.setdefault(email, {
            "email": email, "name": name, "phone": None, "company": None, "hasAccount": False,
            "orders": 0, "lastOrderAt": None, "invoices": 0, "billed": Decimal("0"), "outstanding": Decimal("0"),
        })

    for customer in db.query(Customer).all():
        row = entry(_key(customer.email), customer.name)
        row.update(phone=customer.phone, hasAccount=True)

    for order in db.query(Order).order_by(Order.created_at).all():
        row = entry(_key(order.customer_email), order.customer_name)
        row.update(name=order.customer_name, phone=order.customer_phone or row["phone"],
                   company=order.company_name or row["company"])
        row["orders"] += 1
        row["lastOrderAt"] = order.created_at.isoformat() if order.created_at else row["lastOrderAt"]

    for invoice in db.query(Invoice).filter(Invoice.status != "void").all():
        if not invoice.customer_email:
            continue
        row = entry(_key(invoice.customer_email), invoice.customer_name)
        row["invoices"] += 1
        row["billed"] += money(invoice.total_amount)
        row["outstanding"] += balance(invoice)
        row["company"] = row["company"] or invoice.company_name

    rows = sorted(people.values(), key=lambda r: (r["lastOrderAt"] or "", r["name"]), reverse=True)
    needle = (q or "").strip().lower()
    if needle:
        rows = [r for r in rows if any(needle in (r[k] or "").lower() for k in ("name", "email", "company", "phone"))]
    page = paginate_list(rows, params)
    page["items"] = [{**r, "billed": float(r["billed"]), "outstanding": float(r["outstanding"])} for r in page["items"]]
    return page


@router.get("/customers/detail")
def customer_detail(email: str, admin: Admin = Depends(require("customers")), db: Session = Depends(get_db)):
    key = _key(email)
    orders = db.query(Order).filter(func.lower(Order.customer_email) == key).order_by(Order.created_at.desc()).all()
    invoices = db.query(Invoice).filter(func.lower(Invoice.customer_email) == key).order_by(Invoice.created_at.desc()).all()
    account = db.query(Customer).filter(func.lower(Customer.email) == key).first()
    if not orders and not invoices and not account:
        raise HTTPException(status_code=404, detail="No customer with that email.")
    notes = db.query(CustomerNote).filter(CustomerNote.email == key).order_by(CustomerNote.created_at.desc()).all()
    first = orders[0] if orders else None
    return {
        "email": key,
        "name": (first.customer_name if first else None) or (account.name if account else None)
                or (invoices[0].customer_name if invoices else key),
        "phone": (first.customer_phone if first else None) or (account.phone if account else None),
        "company": (first.company_name if first else None) or (invoices[0].company_name if invoices else None),
        "kraPin": (first.kra_pin if first else None) or (invoices[0].kra_pin if invoices else None),
        "hasAccount": account is not None,
        "orders": [{"id": o.id, "orderNumber": o.order_number, "status": o.order_status,
                    "createdAt": o.created_at.isoformat() if o.created_at else None} for o in orders],
        "invoices": [{"id": i.id, "number": i.number, "total": float(i.total_amount),
                      "balance": float(balance(i)), "paymentStatus": payment_status(i),
                      "issuedOn": i.issued_on.isoformat()} for i in invoices],
        "notes": [{"id": n.id, "body": n.body, "author": n.author,
                   "createdAt": n.created_at.isoformat() if n.created_at else None} for n in notes],
    }


@router.post("/customers/notes", status_code=status.HTTP_201_CREATED)
def add_note(email: str, request: NoteRequest, admin: Admin = Depends(require("customers")),
             db: Session = Depends(get_db)):
    note = CustomerNote(email=_key(email), body=request.body, author=admin.display_name)
    db.add(note)
    db.commit()
    return {"id": note.id}


@router.delete("/customers/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, admin: Admin = Depends(require("customers")), db: Session = Depends(get_db)):
    note = db.get(CustomerNote, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()


# -------------------------------------------------------------------- staff

@router.get("/staff")
def list_staff(admin: Admin = Depends(require("staff")), db: Session = Depends(get_db)):
    return [serialise_staff(a) for a in db.query(Admin).order_by(Admin.id).all()]


@router.post("/staff", status_code=status.HTTP_201_CREATED)
def create_staff(request: StaffCreate, admin: Admin = Depends(require("staff")), db: Session = Depends(get_db)):
    email = request.email.lower()
    if db.query(Admin).filter(Admin.email == email).first():
        raise HTTPException(status_code=409, detail="A staff account with that email already exists.")
    member = Admin(email=email, name=request.name, role=request.role, is_active=True,
                   password=get_password_hash(request.password))
    db.add(member)
    db.commit()
    db.refresh(member)
    return serialise_staff(member)


@router.patch("/staff/{staff_id}")
def update_staff(staff_id: int, request: StaffUpdate, admin: Admin = Depends(require("staff")),
                 db: Session = Depends(get_db)):
    member = db.get(Admin, staff_id)
    if not member:
        raise HTTPException(status_code=404, detail="Staff member not found")

    losing_admin = (
        member.effective_role == "admin" and member.active
        and ((request.role and request.role != "admin") or request.isActive is False)
    )
    if losing_admin:
        others = [a for a in db.query(Admin).all() if a.id != member.id and a.active and a.effective_role == "admin"]
        if not others:
            raise HTTPException(status_code=409, detail="There must always be at least one active administrator.")

    if request.name is not None:
        member.name = request.name
    if request.role is not None:
        member.role = request.role
    if request.isActive is not None:
        member.is_active = request.isActive
    if request.password:
        member.password = get_password_hash(request.password)
    db.commit()
    db.refresh(member)
    return serialise_staff(member)
