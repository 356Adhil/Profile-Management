import React from "react";

export default function AvatarPicker({
  avatarUrl,
  onAvatarUrlChange,
  onFileChange,
  disabled,
}: {
  avatarUrl?: string;
  onAvatarUrlChange: (v: string) => void;
  onFileChange: (f: File | null) => void;
  disabled?: boolean;
}) {
  const [preview, setPreview] = React.useState<string>(avatarUrl || "");

  const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

  const toAbsolute = React.useCallback((url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `${API_BASE}${url}`;
    return url;
  }, [API_BASE]);

  React.useEffect(() => {
    setPreview(toAbsolute(avatarUrl || ""));
  }, [avatarUrl, toAbsolute]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    onFileChange(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      // If uploading file, you can still keep avatarUrl blank; backend will set it.
      onAvatarUrlChange("");
    } else {
      setPreview(toAbsolute(avatarUrl || ""));
    }
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            overflow: "hidden",
            border: "1px solid #eee",
            background: "#fafafa",
            display: "grid",
            placeItems: "center",
          }}
        >
          {preview ? (
            <img src={preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 12, color: "#888" }}>No Avatar</span>
          )}
        </div>

        <input type="file" accept="image/*" onChange={handleFile} disabled={disabled} />
      </div>

      <input
        value={avatarUrl}
        onChange={(e) => onAvatarUrlChange(e.target.value)}
        placeholder="Or paste avatar URL"
        disabled={disabled}
        style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
      />
    </div>
  );
}