import React from "react";

export default function SkillTags({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [input, setInput] = React.useState("");

  function addSkill(raw: string) {
    const s = raw.trim();
    if (!s) return;
    if (value.includes(s)) return;
    onChange([...value, s].slice(0, 30));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
      setInput("");
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add skill (press Enter or comma)"
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: 12,
            border: "2px solid #e5e7eb",
            fontSize: 15,
            transition: "all 0.2s ease",
            outline: "none",
            fontFamily: "inherit",
            background: "#fff",
            fontWeight: 500
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#4a3234";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
        />
      </div>

      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {value.map((s) => (
            <span
              key={s}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                borderRadius: 50,
                background: "#4a3234",
                color: "#f5f1ea",
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(74, 50, 52, 0.25)"
              }}
            >
              {s}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== s))}
                style={{
                  border: "none",
                  background: "rgba(245, 241, 234, 0.2)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#f5f1ea",
                  padding: 0,
                  lineHeight: 1,
                  transition: "all 0.2s ease",
                  fontWeight: 700
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(245, 241, 234, 0.3)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(245, 241, 234, 0.2)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                aria-label={`Remove ${s}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            color: "#ccc",
            fontSize: 12,
            border: "1px dashed #e5e5e5",
            borderRadius: 4,
          }}
        >
          No skills added yet
        </div>
      )}
    </div>
  );
}