const BASE_URL = "http://localhost:8000";

export async function compileApp(prompt) {
  const response = await fetch(`${BASE_URL}/compile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Compilation failed");
  }

  return response.json();
}
