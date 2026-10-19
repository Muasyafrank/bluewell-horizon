"""Who can open which part of the business system.

Staff are `Admin` rows with a `role`. Each role is a set of modules; a route
declares the module it belongs to with `require("invoices")`. Keeping the table
here (not scattered across routers) makes "what can sales do?" a one-glance answer.
"""
from fastapi import Depends, HTTPException, status

from core.security import get_current_staff
from models import Admin

ROLE_LABELS = {
    "admin": "Administrator",
    "sales": "Sales",
    "accounts": "Accounts",
    "stores": "Stores",
}

MODULES = ("dashboard", "customers", "invoices", "payments", "stock", "suppliers", "purchasing", "reports", "staff")

ROLE_MODULES = {
    "admin": set(MODULES),
    "sales": {"dashboard", "customers", "invoices"},
    "accounts": {"dashboard", "customers", "invoices", "payments", "reports"},
    "stores": {"dashboard", "stock", "suppliers", "purchasing"},
}


def modules_for(role: str) -> list[str]:
    return [module for module in MODULES if module in ROLE_MODULES.get(role, set())]


def require(module: str):
    """Dependency: the signed-in staff member, if their role includes `module`."""
    def dependency(admin: Admin = Depends(get_current_staff)) -> Admin:
        if module not in ROLE_MODULES.get(admin.effective_role, set()):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Your role ({ROLE_LABELS.get(admin.effective_role, admin.effective_role)}) cannot access {module}.",
            )
        return admin
    return dependency
