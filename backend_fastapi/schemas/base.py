from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


class TrimmedModel(BaseModel):
    """Base for request bodies: strips surrounding whitespace before validating,
    so a field containing only spaces fails `min_length` instead of passing."""

    model_config = ConfigDict(str_strip_whitespace=True)
