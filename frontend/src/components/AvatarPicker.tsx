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
  const [showPopup, setShowPopup] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

  const toAbsolute = React.useCallback(
    (url: string) => {
      if (!url) return "";
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      if (url.startsWith("/")) return `${API_BASE}${url}`;
      return url;
    },
    [API_BASE]
  );

  React.useEffect(() => {
    setPreview(toAbsolute(avatarUrl || ""));
  }, [avatarUrl, toAbsolute]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    onFileChange(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onAvatarUrlChange("");
      setShowPopup(false);
    } else {
      setPreview(toAbsolute(avatarUrl || ""));
    }
  }

  function handleUrlSubmit() {
    if (urlInput.trim()) {
      onAvatarUrlChange(urlInput.trim());
      setPreview(urlInput.trim());
      onFileChange(null);
      setUrlInput("");
      setShowPopup(false);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              position: "relative",
              width: 112,
              height: 112,
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid #e5e5e5",
              background: "#fafafa",
              display: "grid",
              placeItems: "center",
              transition: "all 0.2s ease",
            }}
          >
            {preview ? (
              <img src={preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center", color: "#ccc" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" />
                </svg>
              </div>
            )}
          </div>

          {/* Camera icon button */}
          <button
            type="button"
            onClick={() => setShowPopup(!showPopup)}
            disabled={disabled}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "2px solid #fff",
              background: "#4a3234",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#6b6b6b";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#4a3234";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={disabled}
          style={{ display: "none" }}
        />
      </div>

      {/* Popup */}
      {showPopup && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          marginTop: 8,
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          width: 280,
          animation: "fadeIn 0.2s ease"
        }}>
          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => {
                fileInputRef.current?.click();
              }}
              disabled={disabled}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #e5e5e5",
                background: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                color: "#4a3234",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f5f1ea";
                e.currentTarget.style.borderColor = "#4a3234";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = "#e5e5e5";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Choose from system
            </button>
          </div>

          <div style={{ 
            fontSize: 11, 
            color: "#6b6b6b", 
            textAlign: "center", 
            margin: "8px 0",
            fontWeight: 500
          }}>
            OR
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste image URL"
              disabled={disabled}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #e5e5e5",
                fontSize: 13,
                outline: "none",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#4a3234";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e5e5";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUrlSubmit();
                }
              }}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled || !urlInput.trim()}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: urlInput.trim() ? "#4a3234" : "#e5e5e5",
                color: urlInput.trim() ? "#fff" : "#999",
                cursor: urlInput.trim() ? "pointer" : "not-allowed",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.2s ease"
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}