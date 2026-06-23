from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import CompileRequest, CompileResponse, ValidationResult
from generator import generate_app_config
from validator import validate_config
from repair import repair_config
from runtime import runtime_validate

app = FastAPI(title="AI App Compiler", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "AI App Compiler API is running"}


@app.post("/compile", response_model=CompileResponse)
def compile_app(request: CompileRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt must not be empty")

    # Stage 1: Generate config from Gemini
    try:
        config = generate_app_config(request.prompt)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Generation failed: {str(e)}")

    # Stage 2: Validate
    validation = validate_config(config)

    # Stage 3: Repair if validation failed
    if validation["status"] == "failed":
        config = repair_config(config)
        validation = validate_config(config)

    # Stage 4: Runtime validation
    runtime = runtime_validate(config)
    if runtime["status"] == "failed":
        validation = runtime

    assumptions = config.pop("assumptions", [])

    return CompileResponse(
        app_config=config,
        validation=ValidationResult(**validation),
        assumptions=assumptions,
    )
