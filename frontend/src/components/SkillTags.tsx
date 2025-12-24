import React from "react";

export default function SkillTags({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
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
    <div style={{ display: "grid", gap: 8 }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Add skills (Enter or comma)"
        style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {value.map((s) => (
          <span
            key={s}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #eee",
              background: "#fafafa",
              fontSize: 13,
            }}
          >
            {s}
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== s))}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 14,
              }}
              aria-label={`Remove ${s}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}