import { useState } from "react";
import { compileApp } from "./api";

const EXAMPLE_PROMPT =
  "Build a CRM with login, contacts, dashboard, and admin role.";

function StatusBadge({ status }) {
  const isSuccess = status === "success";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 600,
        background: isSuccess ? "#dcfce7" : "#fee2e2",
        color: isSuccess ? "#15803d" : "#b91c1c",
        border: `1px solid ${isSuccess ? "#bbf7d0" : "#fecaca"}`,
      }}
    >
      <span>{isSuccess ? "✓" : "✗"}</span>
      {isSuccess ? "Validation passed" : "Validation failed"}
    </span>
  );
}

function JsonBlock({ data }) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "4px 10px",
          fontSize: "12px",
          background: copied ? "#22c55e" : "#334155",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre
        style={{
          background: "#0f172a",
          color: "#e2e8f0",
          padding: "20px",
          borderRadius: "10px",
          overflowX: "auto",
          fontSize: "13px",
          lineHeight: "1.7",
          margin: 0,
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          maxHeight: "460px",
          overflowY: "auto",
        }}
      >
        {text}
      </pre>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px 24px",
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          margin: "0 0 14px 0",
          fontSize: "15px",
          fontWeight: 700,
          color: "#1e293b",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompile = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await compileApp(prompt);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCompile();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        color: "#1e293b",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          height: "60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: 800, fontSize: "17px", color: "#1e293b" }}>
            AI App Compiler
          </span>
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "12px",
            color: "#94a3b8",
            background: "#f1f5f9",
            padding: "4px 10px",
            borderRadius: "6px",
          }}
        >
          Powered by Gemini
        </span>
      </header>

      {/* Main */}
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 900,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 8px 0",
            }}
          >
            Describe your app. Get a blueprint.
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
            Type any app idea in plain English and get a structured JSON
            configuration instantly.
          </p>
        </div>

        {/* Input card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "#475569",
              marginBottom: "8px",
              letterSpacing: "0.03em",
            }}
          >
            APP IDEA
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`e.g. "${EXAMPLE_PROMPT}"`}
            rows={4}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "15px",
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
              color: "#1e293b",
              background: "#f8fafc",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
            }}
          >
            <button
              onClick={() => setPrompt(EXAMPLE_PROMPT)}
              style={{
                background: "none",
                border: "none",
                color: "#6366f1",
                fontSize: "13px",
                cursor: "pointer",
                padding: 0,
                fontWeight: 500,
              }}
            >
              Use example →
            </button>
            <button
              onClick={handleCompile}
              disabled={loading || !prompt.trim()}
              style={{
                padding: "10px 28px",
                background:
                  loading || !prompt.trim()
                    ? "#c7d2fe"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Compiling…
                </>
              ) : (
                <>⚡ Compile</>
              )}
            </button>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#94a3b8" }}>
            Tip: Press Ctrl+Enter to compile
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "14px 18px",
              color: "#b91c1c",
              fontSize: "14px",
              marginBottom: "24px",
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Validation strip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <StatusBadge status={result.validation.status} />
              {result.validation.errors.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    color: "#b91c1c",
                    fontSize: "13px",
                    width: "100%",
                  }}
                >
                  {result.validation.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Assumptions */}
            {result.assumptions && result.assumptions.length > 0 && (
              <SectionCard title="Assumptions Made" icon="💡">
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    color: "#475569",
                    fontSize: "14px",
                    lineHeight: "1.8",
                  }}
                >
                  {result.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {/* Full JSON output */}
            <SectionCard title="Generated App Configuration" icon="📦">
              <JsonBlock data={result.app_config} />
            </SectionCard>

            {/* Validation result */}
            <SectionCard title="Runtime Validation" icon="🔍">
              <JsonBlock data={result.validation} />
            </SectionCard>
          </>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        textarea { resize: vertical; }
      `}</style>
    </div>
  );
}
