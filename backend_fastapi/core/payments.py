"""Payment methods a quotation can offer, built from the business's own details
in the environment (see the PAYMENT_* settings in .env.example)."""
from config import settings

COD_KEY = "cash_on_delivery"


def available_payment_methods() -> list[dict]:
    """`[{key, label, details: [[label, value], ...]}]` for every method with
    its details filled in. Nothing is invented: an unset method is not offered."""
    methods = []

    if settings.mpesa_paybill_number:
        methods.append({
            "key": "mpesa_paybill",
            "label": "M-Pesa Paybill",
            "details": [
                ["Paybill number", settings.mpesa_paybill_number],
                ["Account number", settings.mpesa_paybill_account],
            ],
        })

    if settings.mpesa_till_number:
        details = [["Till number", settings.mpesa_till_number]]
        if settings.mpesa_till_name:
            details.append(["Till name", settings.mpesa_till_name])
        methods.append({"key": "mpesa_till", "label": "M-Pesa Buy Goods (Till)", "details": details})

    if settings.bank_name and settings.bank_account_number:
        details = [["Bank", settings.bank_name]]
        if settings.bank_account_name:
            details.append(["Account name", settings.bank_account_name])
        details.append(["Account number", settings.bank_account_number])
        if settings.bank_branch:
            details.append(["Branch", settings.bank_branch])
        methods.append({"key": "bank_transfer", "label": "Bank transfer", "details": details})

    if settings.cash_on_delivery_enabled:
        methods.append({
            "key": COD_KEY,
            "label": "Cash on delivery",
            "details": [["How it works", "Pay our delivery team when your order arrives."]],
        })

    return methods
