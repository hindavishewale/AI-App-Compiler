from pydantic import BaseModel
from typing import Any


class CompileRequest(BaseModel):
    prompt: str


class ValidationResult(BaseModel):
    status: str
    errors: list[str] = []


class CompileResponse(BaseModel):
    app_config: dict[str, Any]
    validation: ValidationResult
    assumptions: list[str] = []
