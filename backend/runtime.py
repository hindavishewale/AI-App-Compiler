import json


def runtime_validate(config: dict) -> dict:
    errors = []

    try:
        # Serialize and re-load to confirm it's a valid JSON-serializable structure
        serialized = json.dumps(config)
        reloaded = json.loads(serialized)

        # Confirm all top-level keys survived the round-trip
        for key in config:
            if key not in reloaded:
                errors.append(f"Key '{key}' lost during JSON round-trip")

    except (TypeError, ValueError) as e:
        errors.append(f"JSON serialization error: {str(e)}")

    if errors:
        return {"status": "failed", "errors": errors}
    return {"status": "success", "errors": []}
