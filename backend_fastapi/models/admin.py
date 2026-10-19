from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func
from database import Base

class Admin(Base):
    """A staff login. Despite the name it also holds sales, accounts and stores
    staff: `role` decides what they can reach in the business system.

    `name`, `role` and `is_active` were added later, so they are nullable and
    rows created before them read as an active admin (see the properties).
    """
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    role = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    @property
    def effective_role(self) -> str:
        return self.role or "admin"

    @property
    def active(self) -> bool:
        return self.is_active is not False

    @property
    def display_name(self) -> str:
        return self.name or self.email.split("@")[0]
