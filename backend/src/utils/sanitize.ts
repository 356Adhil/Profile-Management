export function sanitizeString(v: unknown) {
  if (typeof v !== "string") return "";
  return v.trim();
}

export function sanitizeEmail(v: unknown) {
  return sanitizeString(v).toLowerCase();
}

export function sanitizeSkills(v: unknown): string[] {
  let arr: string[] = [];

  if (Array.isArray(v)) {
    arr = v.map(String);
  } else if (typeof v === "string") {
    // supports "js,react,node" or JSON string
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) arr = parsed.map(String);
      else arr = v.split(",");
    } catch {
      arr = v.split(",");
    }
  }

  const cleaned = arr
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);

  // de-duplicate while preserving order
  return [...new Set(cleaned)];
}