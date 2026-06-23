import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """
You are an AI App Compiler. Convert the user's app idea into a structured JSON configuration.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "app_name": "string",
  "pages": ["string"],
  "entities": ["string"],
  "roles": ["string"],
  "ui_schema": {
    "layout": "string",
    "theme": "string",
    "components": ["string"]
  },
  "api_schema": [
    {
      "endpoint": "string",
      "method": "string",
      "description": "string"
    }
  ],
  "database_schema": {
    "tables": [
      {
        "name": "string",
        "fields": ["string"]
      }
    ]
  },
  "assumptions": ["string"]
}

Rules:
- Extract app name from the prompt. If vague, infer a reasonable name.
- Extract all pages mentioned. If none, infer sensible defaults.
- Extract database entities (e.g., User, Product). If none, infer from context.
- Extract roles (e.g., Admin, User). If none, default to ["User"].
- Generate a minimal but complete UI schema, API schema, and database schema.
- If information is missing, make reasonable assumptions and list them in "assumptions".
- Never return empty arrays. Always provide at least one item.
- Return ONLY the JSON object. No markdown fences, no extra text.
"""


def generate_app_config(prompt: str) -> dict:
    model = genai.GenerativeModel("gemini-2.5-flash")

    full_prompt = f"{SYSTEM_PROMPT}\n\nApp Idea: {prompt}"

    response = model.generate_content(full_prompt)
    raw_text = response.text.strip()

    # Strip markdown fences if present
    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        raw_text = "\n".join(lines[1:-1]).strip()

    config = json.loads(raw_text)
    return config
