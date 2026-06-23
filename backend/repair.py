DEFAULT_UI_SCHEMA = {
    "layout": "sidebar",
    "theme": "light",
    "components": ["Navbar", "Footer", "Card"],
}

DEFAULT_API_SCHEMA = [
    {"endpoint": "/api/items", "method": "GET", "description": "Fetch all items"},
    {"endpoint": "/api/items", "method": "POST", "description": "Create a new item"},
]

DEFAULT_DB_TABLE = {"name": "Item", "fields": ["id", "name", "created_at"]}


def repair_config(config: dict) -> dict:
    repaired = dict(config)

    # Repair top-level string fields
    if not repaired.get("app_name"):
        repaired["app_name"] = "MyApp"

    # Repair list fields
    if not repaired.get("pages"):
        repaired["pages"] = ["Home", "Dashboard"]

    if not repaired.get("entities"):
        repaired["entities"] = ["User"]

    if not repaired.get("roles"):
        repaired["roles"] = ["User"]

    if not isinstance(repaired.get("assumptions"), list):
        repaired["assumptions"] = []

    # Repair ui_schema
    if not isinstance(repaired.get("ui_schema"), dict):
        repaired["ui_schema"] = DEFAULT_UI_SCHEMA
    else:
        ui = repaired["ui_schema"]
        if not ui.get("layout"):
            ui["layout"] = "sidebar"
        if not ui.get("theme"):
            ui["theme"] = "light"
        if not ui.get("components"):
            ui["components"] = ["Navbar", "Footer"]

    # Repair api_schema
    if not isinstance(repaired.get("api_schema"), list) or not repaired["api_schema"]:
        repaired["api_schema"] = DEFAULT_API_SCHEMA
    else:
        for api in repaired["api_schema"]:
            if "endpoint" not in api:
                api["endpoint"] = "/api/unknown"
            if "method" not in api:
                api["method"] = "GET"
            if "description" not in api:
                api["description"] = "No description"

    # Repair database_schema
    if not isinstance(repaired.get("database_schema"), dict):
        repaired["database_schema"] = {"tables": [DEFAULT_DB_TABLE]}
    else:
        db = repaired["database_schema"]
        if not isinstance(db.get("tables"), list) or not db["tables"]:
            db["tables"] = [DEFAULT_DB_TABLE]

    return repaired
