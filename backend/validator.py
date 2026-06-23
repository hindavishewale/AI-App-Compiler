REQUIRED_TOP_LEVEL_FIELDS = [
    "app_name",
    "pages",
    "entities",
    "roles",
    "ui_schema",
    "api_schema",
    "database_schema",
]

REQUIRED_UI_FIELDS = ["layout", "theme", "components"]
REQUIRED_DB_FIELDS = ["tables"]


def validate_config(config: dict) -> dict:
    errors = []

    # Check top-level fields
    for field in REQUIRED_TOP_LEVEL_FIELDS:
        if field not in config:
            errors.append(f"Missing required field: '{field}'")
        elif config[field] is None:
            errors.append(f"Field '{field}' must not be null")
        elif isinstance(config[field], (list, dict, str)) and not config[field]:
            errors.append(f"Field '{field}' must not be empty")

    # Check ui_schema sub-fields
    if "ui_schema" in config and isinstance(config["ui_schema"], dict):
        for field in REQUIRED_UI_FIELDS:
            if field not in config["ui_schema"]:
                errors.append(f"Missing ui_schema field: '{field}'")

    # Check database_schema sub-fields
    if "database_schema" in config and isinstance(config["database_schema"], dict):
        for field in REQUIRED_DB_FIELDS:
            if field not in config["database_schema"]:
                errors.append(f"Missing database_schema field: '{field}'")

    # Check api_schema is a list of objects with required keys
    if "api_schema" in config and isinstance(config["api_schema"], list):
        for i, api in enumerate(config["api_schema"]):
            for key in ["endpoint", "method", "description"]:
                if key not in api:
                    errors.append(f"api_schema[{i}] missing key: '{key}'")

    if errors:
        return {"status": "failed", "errors": errors}
    return {"status": "success", "errors": []}
