"""Business system: stock levels, suppliers and purchase orders.

Stock only changes through `move_stock`, so every unit in or out has a reason,
a reference and a name against it.
"""
from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.invoicing import InsufficientStock, move_stock
from core.permissions import require
from core.quotation import money
from database import get_db
from models import Admin, Product, PurchaseOrder, StockMovement, Supplier
from schemas.bms import PurchaseOrderRequest, ReorderLevel, StockAdjustment, SupplierRequest

router = APIRouter(prefix="/api/bms", tags=["Stock and purchasing"])


# -------------------------------------------------------------------- stock

def stock_state(product: Product) -> str:
    stock = product.stock or 0
    if stock <= 0:
        return "out"
    if product.reorder_level is not None and stock <= product.reorder_level:
        return "low"
    return "ok"


def serialise_product(product: Product) -> dict:
    return {
        "id": product.id, "name": product.name, "category": product.category,
        "stock": product.stock or 0, "reorderLevel": product.reorder_level, "state": stock_state(product),
    }


def _product(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/stock")
def list_stock(admin: Admin = Depends(require("stock")), db: Session = Depends(get_db)):
    return [serialise_product(p) for p in db.query(Product).order_by(Product.name).all()]


@router.get("/stock/{product_id}/movements")
def stock_movements(product_id: int, admin: Admin = Depends(require("stock")), db: Session = Depends(get_db)):
    _product(db, product_id)
    rows = (db.query(StockMovement).filter(StockMovement.product_id == product_id)
            .order_by(StockMovement.id.desc()).limit(200).all())
    return [{
        "id": m.id, "change": m.change, "balanceAfter": m.balance_after, "reason": m.reason,
        "reference": m.reference, "note": m.note, "by": m.created_by,
        "at": m.created_at.isoformat() if m.created_at else None,
    } for m in rows]


@router.post("/stock/{product_id}/adjust")
def adjust_stock(product_id: int, request: StockAdjustment, admin: Admin = Depends(require("stock")),
                 db: Session = Depends(get_db)):
    product = _product(db, product_id)
    if request.change == 0:
        raise HTTPException(status_code=422, detail="Enter how many units to add or remove.")
    if request.reason == "damage" and request.change > 0:
        raise HTTPException(status_code=422, detail="Damaged stock is removed: enter a negative number.")
    if request.reason == "adjustment" and not request.note:
        raise HTTPException(status_code=422, detail="Say why the count is being adjusted.")
    try:
        move_stock(db, product, request.change, request.reason, note=request.note, by=admin.display_name)
    except InsufficientStock as error:
        raise HTTPException(status_code=409, detail=str(error))
    db.commit()
    db.refresh(product)
    return serialise_product(product)


@router.put("/stock/{product_id}/reorder-level")
def set_reorder_level(product_id: int, request: ReorderLevel, admin: Admin = Depends(require("stock")),
                      db: Session = Depends(get_db)):
    product = _product(db, product_id)
    product.reorder_level = request.reorderLevel
    db.commit()
    return serialise_product(product)


# ---------------------------------------------------------------- suppliers

def serialise_supplier(s: Supplier) -> dict:
    return {
        "id": s.id, "name": s.name, "contactPerson": s.contact_person, "email": s.email, "phone": s.phone,
        "address": s.address, "kraPin": s.kra_pin, "notes": s.notes, "isActive": s.is_active,
    }


def _apply_supplier(s: Supplier, r: SupplierRequest) -> None:
    s.name, s.contact_person, s.email, s.phone = r.name, r.contactPerson, r.email, r.phone
    s.address, s.kra_pin, s.notes, s.is_active = r.address, r.kraPin, r.notes, r.isActive


@router.get("/suppliers")
def list_suppliers(admin: Admin = Depends(require("suppliers")), db: Session = Depends(get_db)):
    return [serialise_supplier(s) for s in db.query(Supplier).order_by(Supplier.name).all()]


@router.post("/suppliers", status_code=status.HTTP_201_CREATED)
def create_supplier(request: SupplierRequest, admin: Admin = Depends(require("suppliers")),
                    db: Session = Depends(get_db)):
    supplier = Supplier()
    _apply_supplier(supplier, request)
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return serialise_supplier(supplier)


@router.put("/suppliers/{supplier_id}")
def update_supplier(supplier_id: int, request: SupplierRequest, admin: Admin = Depends(require("suppliers")),
                    db: Session = Depends(get_db)):
    supplier = db.get(Supplier, supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    _apply_supplier(supplier, request)
    db.commit()
    return serialise_supplier(supplier)


# ---------------------------------------------------------- purchase orders

def serialise_po(po: PurchaseOrder) -> dict:
    return {
        "id": po.id, "number": po.number, "supplierId": po.supplier_id,
        "supplierName": po.supplier.name if po.supplier else None, "status": po.status,
        "lines": po.lines, "totalCost": float(po.total_cost),
        "expectedOn": po.expected_on.isoformat() if po.expected_on else None, "notes": po.notes,
        "orderedAt": po.ordered_at.isoformat() if po.ordered_at else None,
        "receivedAt": po.received_at.isoformat() if po.received_at else None,
        "createdAt": po.created_at.isoformat() if po.created_at else None,
    }


def _po(db: Session, po_id: int) -> PurchaseOrder:
    po = db.get(PurchaseOrder, po_id)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return po


def _fill_po(db: Session, po: PurchaseOrder, request: PurchaseOrderRequest) -> None:
    supplier = db.get(Supplier, request.supplierId)
    if not supplier or not supplier.is_active:
        raise HTTPException(status_code=422, detail="Choose an active supplier.")
    lines, total = [], 0
    for line in request.lines:
        product = db.get(Product, line.productId)
        if not product:
            raise HTTPException(status_code=422, detail=f"Product {line.productId} does not exist.")
        lines.append({"productId": product.id, "description": product.name, "quantity": line.quantity,
                      "unitCost": float(money(line.unitCost))})
        total += money(line.unitCost) * line.quantity
    if request.expectedOn and request.expectedOn < date.today():
        raise HTTPException(status_code=422, detail="The expected date is in the past.")
    po.supplier_id, po.lines, po.total_cost = supplier.id, lines, money(total)
    po.expected_on, po.notes = request.expectedOn, request.notes or None


@router.get("/purchase-orders")
def list_purchase_orders(admin: Admin = Depends(require("purchasing")), db: Session = Depends(get_db)):
    return [serialise_po(p) for p in db.query(PurchaseOrder).order_by(PurchaseOrder.id.desc()).all()]


@router.post("/purchase-orders", status_code=status.HTTP_201_CREATED)
def create_purchase_order(request: PurchaseOrderRequest, admin: Admin = Depends(require("purchasing")),
                          db: Session = Depends(get_db)):
    po = PurchaseOrder(number="PENDING", supplier_id=request.supplierId, lines=[], status="draft",
                       created_by=admin.display_name)
    _fill_po(db, po, request)
    db.add(po)
    db.flush()
    po.number = f"PO-{date.today():%Y}-{po.id:05d}"
    db.commit()
    db.refresh(po)
    return serialise_po(po)


@router.put("/purchase-orders/{po_id}")
def update_purchase_order(po_id: int, request: PurchaseOrderRequest, admin: Admin = Depends(require("purchasing")),
                          db: Session = Depends(get_db)):
    po = _po(db, po_id)
    if po.status != "draft":
        raise HTTPException(status_code=409, detail="Only a draft purchase order can be edited.")
    _fill_po(db, po, request)
    db.commit()
    return serialise_po(po)


@router.post("/purchase-orders/{po_id}/place")
def place_purchase_order(po_id: int, admin: Admin = Depends(require("purchasing")), db: Session = Depends(get_db)):
    po = _po(db, po_id)
    if po.status != "draft":
        raise HTTPException(status_code=409, detail="Only a draft can be placed with the supplier.")
    po.status, po.ordered_at = "ordered", datetime.now(timezone.utc)
    db.commit()
    return serialise_po(po)


@router.post("/purchase-orders/{po_id}/receive")
def receive_purchase_order(po_id: int, admin: Admin = Depends(require("purchasing")), db: Session = Depends(get_db)):
    """Books the whole order into stock. (Partial deliveries: receive, then adjust.)"""
    po = _po(db, po_id)
    if po.status != "ordered":
        raise HTTPException(status_code=409, detail="Only an order placed with the supplier can be received.")
    for line in po.lines:
        product = db.get(Product, line["productId"])
        if product is not None:
            move_stock(db, product, int(line["quantity"]), "purchase", reference=po.number, by=admin.display_name)
    po.status, po.received_at = "received", datetime.now(timezone.utc)
    db.commit()
    return serialise_po(po)


@router.post("/purchase-orders/{po_id}/cancel")
def cancel_purchase_order(po_id: int, admin: Admin = Depends(require("purchasing")), db: Session = Depends(get_db)):
    po = _po(db, po_id)
    if po.status in ("received", "cancelled"):
        raise HTTPException(status_code=409, detail=f"A {po.status} purchase order cannot be cancelled.")
    po.status = "cancelled"
    db.commit()
    return serialise_po(po)
