import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import SkillTags from "./SkillTags";
import AvatarPicker from "./AvatarPicker";
import { useProfile } from "../hooks/useProfile";
import { profileSchema, type ProfileFormValues } from "../schemas/profile.schema";

// Add global styles for hiding scrollbars
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  *::-webkit-scrollbar {
    display: none;
  }
  body::-webkit-scrollbar {
    display: none;
  }
  body {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
if (!document.head.querySelector('style[data-scrollbar-hide]')) {
  styleSheet.setAttribute('data-scrollbar-hide', 'true');
  document.head.appendChild(styleSheet);
}

// Helper to calculate profile completion
function calculateCompletion(data: any): number {
  let score = 0;
  if (data.name) score += 15;
  if (data.email) score += 15;
  if (data.bio && data.bio.length > 20) score += 15;
  if (data.avatarUrl) score += 15;
  if (data.skills && data.skills.length >= 3) score += 20;
  if (data.socialLinks && Object.values(data.socialLinks).filter(Boolean).length > 0) score += 20;
  return score;
}

// Social link icons
const SocialIcons = {
  github: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  website: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
};

// ProfileView Component - Modern glassmorphism design with mobile responsive
function ProfileView({ data, onEdit }: { data: any; onEdit: () => void }) {
  const completion = calculateCompletion(data);
  const API_BASE = import.meta.env.VITE_API_BASE_URL as string;
  
  const avatarSrc = React.useMemo(() => {
    if (!data.avatarUrl) return null;
    if (data.avatarUrl.startsWith("http://") || data.avatarUrl.startsWith("https://")) {
      return data.avatarUrl;
    }
    if (data.avatarUrl.startsWith("/")) {
      return `${API_BASE}${data.avatarUrl}`;
    }
    return data.avatarUrl;
  }, [data.avatarUrl, API_BASE]);
  
  return (
    <div className="hide-scrollbar" style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(180deg, #f5f1ea 0%, #e8dfd6 100%)",
      position: "relative",
      overflow: "auto",
      overflowX: "hidden"
    }}>
      {/* Subtle background shapes */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "40%",
        height: "40%",
        background: "radial-gradient(circle, rgba(228, 201, 192, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 20s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        left: "-5%",
        width: "35%",
        height: "35%",
        background: "radial-gradient(circle, rgba(228, 201, 192, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 15s ease-in-out infinite reverse",
      }} />

      <div style={{ 
        position: "relative",
        maxWidth: 1400,
        margin: "0 auto",
        padding: "clamp(20px, 5vw, 80px) clamp(16px, 4vw, 40px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(20px, 3vw, 40px)",
        animation: "fadeIn 0.8s ease",
        width: "100%"
      }}>
        {/* Main profile card with glassmorphism - Mobile responsive */}
        <div style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(228, 201, 192, 0.3)",
          borderRadius: "clamp(20px, 4vw, 32px)",
          padding: "clamp(24px, 5vw, 60px)",
          boxShadow: "0 16px 64px rgba(74, 50, 52, 0.08)",
          animation: "scaleIn 0.6s ease"
        }}>
          {/* Header with progress and edit button inside card */}
          <div style={{ 
            display: "flex", 
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            justifyContent: "space-between", 
            alignItems: window.innerWidth < 768 ? "flex-start" : "center",
            gap: 16,
            marginBottom: "clamp(30px, 5vw, 40px)",
            paddingBottom: "clamp(20px, 4vw, 30px)",
            borderBottom: "1px solid rgba(228, 201, 192, 0.3)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <div style={{
                fontSize: 13,
                color: "#6b6b6b",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span style={{ color: "#4a3234", fontWeight: 600 }}>{completion}%</span>
              </div>
              <div style={{
                width: 80,
                height: 3,
                background: "#e8dfd6",
                borderRadius: 2,
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${completion}%`,
                  height: "100%",
                  background: completion === 100 ? "#4a3234" : "#6b6b6b",
                  transition: "width 0.5s ease, background 0.3s ease"
                }} />
              </div>
            </div>

            <button
              onClick={onEdit}
              style={{
                padding: "12px 28px",
                borderRadius: 50,
                border: "none",
                background: "#4a3234",
                color: "#f5f1ea",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.02em",
                boxShadow: "0 4px 16px rgba(74, 50, 52, 0.2)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                width: window.innerWidth < 768 ? "100%" : "auto"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "#5f4446";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(74, 50, 52, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#4a3234";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(74, 50, 52, 0.2)";
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>

          {/* Avatar and basic info - Mobile responsive */}
          <div style={{ 
            display: "flex", 
            flexDirection: window.innerWidth < 640 ? "column" : "row",
            alignItems: window.innerWidth < 640 ? "center" : "center", 
            gap: "clamp(20px, 4vw, 40px)", 
            marginBottom: "clamp(30px, 5vw, 50px)",
            textAlign: window.innerWidth < 640 ? "center" : "left"
          }}>
            <div style={{
              position: "relative",
              width: "clamp(120px, 20vw, 180px)",
              height: "clamp(120px, 20vw, 180px)",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4a3234 0%, #6b6b6b 100%)",
              padding: 6,
              boxShadow: "0 16px 48px rgba(74, 50, 52, 0.2)",
              flexShrink: 0
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                margin: 0,
                fontSize: "clamp(28px, 5vw, 42px)",
                fontWeight: 600,
                color: "#4a3234",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                marginBottom: 12,
                wordBreak: "break-word"
              }}>
                {data.name || "Unnamed"}
              </h1>
              <div style={{
                fontSize: "clamp(14px, 2vw, 16px)",
                color: "#6b6b6b",
                fontWeight: 400,
                letterSpacing: "0",
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: window.innerWidth < 640 ? "center" : "flex-start",
                flexWrap: "wrap"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span style={{ wordBreak: "break-word" }}>{data.email}</span>
              </div>

              {/* Social Links */}
              {data.socialLinks && Object.entries(data.socialLinks).filter(([_, url]) => url).length > 0 && (
                <div style={{
                  marginTop: 20,
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: window.innerWidth < 640 ? "center" : "flex-start"
                }}>
                  {Object.entries(data.socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: "#4a3234",
                          color: "#f5f1ea",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          boxShadow: "0 2px 8px rgba(74, 50, 52, 0.2)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#5f4446";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(74, 50, 52, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#4a3234";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(74, 50, 52, 0.2)";
                        }}
                      >
                        {SocialIcons[platform as keyof typeof SocialIcons]}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bio section */}
          {data.bio && (
            <div style={{
              background: "rgba(228, 201, 192, 0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(228, 201, 192, 0.3)",
              borderRadius: 20,
              padding: "clamp(20px, 4vw, 32px)",
              marginBottom: 32
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#6b6b6b",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span style={{ 
                  width: 4, 
                  height: 16, 
                  background: "linear-gradient(180deg, #4a3234 0%, #6b6b6b 100%)",
                  borderRadius: 2
                }} />
                About
              </div>
              <p style={{
                margin: 0,
                color: "#4a3234",
                fontSize: "clamp(14px, 2vw, 15px)",
                lineHeight: 1.7,
                letterSpacing: "0",
                wordBreak: "break-word"
              }}>
                {data.bio}
              </p>
            </div>
          )}

          {/* Skills section */}
          {data.skills?.length > 0 && (
            <div>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#6b6b6b",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span style={{ 
                  width: 4, 
                  height: 16, 
                  background: "linear-gradient(180deg, #4a3234 0%, #6b6b6b 100%)",
                  borderRadius: 2
                }} />
                Skills · {data.skills.length}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {data.skills.map((s: string, i: number) => (
                  <span
                    key={s}
                    style={{
                      padding: "clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)",
                      borderRadius: 50,
                      background: "#4a3234",
                      border: "1px solid #4a3234",
                      color: "#f5f1ea",
                      fontSize: "clamp(12px, 2vw, 14px)",
                      fontWeight: 500,
                      letterSpacing: "0",
                      animation: `slideIn 0.4s ease ${i * 0.05}s backwards`,
                      transition: "all 0.3s ease",
                      cursor: "default",
                      boxShadow: "0 2px 8px rgba(74, 50, 52, 0.2)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#5f4446";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(74, 50, 52, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#4a3234";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(74, 50, 52, 0.2)";
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          color: "#6b6b6b",
          fontSize: "clamp(12px, 2vw, 14px)",
          fontWeight: 500
        }}>
          Last updated {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "-"}
        </div>
      </div>
    </div>
  );
}

// ProfileEdit Component - Split-screen with live preview (Mobile responsive)
function ProfileEdit({ data, onSave, onCancel, saving }: { data: any; onSave: (data: any) => void; onCancel: () => void; saving: boolean }) {
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);
  const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

  // Check if this is a new profile (empty)
  const isNewProfile = !data.name && !data.email && !data.bio && !data.avatarUrl && (!data.skills || data.skills.length === 0);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data.name || "",
      email: data.email || "",
      bio: data.bio || "",
      avatarUrl: data.avatarUrl || "",
      skills: data.skills || [],
      socialLinks: {
        github: data.socialLinks?.github || "",
        linkedin: data.socialLinks?.linkedin || "",
        twitter: data.socialLinks?.twitter || "",
        website: data.socialLinks?.website || "",
      },
    },
    mode: "onChange",
  });

  const formData = watch();
  const bioLength = formData.bio?.length || 0;
  const completion = calculateCompletion({ ...formData, avatarUrl: formData.avatarUrl });

  // Track if skills have changed
  const skillsChanged = JSON.stringify(formData.skills || []) !== JSON.stringify(data.skills || []);
  const hasChanges = isDirty || avatarFile || skillsChanged;

  const avatarSrc = React.useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    if (!formData.avatarUrl) return null;
    if (formData.avatarUrl.startsWith("http://") || formData.avatarUrl.startsWith("https://")) {
      return formData.avatarUrl;
    }
    if (formData.avatarUrl.startsWith("/")) {
      return `${API_BASE}${formData.avatarUrl}`;
    }
    return formData.avatarUrl;
  }, [formData.avatarUrl, avatarFile, API_BASE]);

  const onSubmit = (validatedData: ProfileFormValues) => {
    onSave({ ...validatedData, avatarFile, version: data.version });
  };

  return (
    <div className="hide-scrollbar" style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f5f1ea 0%, #e8dfd6 100%)",
      position: "relative",
      overflow: "auto",
      overflowX: "hidden"
    }}>
      {/* Subtle background shapes */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "40%",
        height: "40%",
        background: "radial-gradient(circle, rgba(228, 201, 192, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 20s ease-in-out infinite",
      }} />

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: "clamp(20px, 4vw, 40px)",
        maxWidth: 1600,
        margin: "0 auto",
        padding: "clamp(20px, 5vw, 60px) clamp(16px, 4vw, 40px)",
        minHeight: "100vh",
        alignItems: "start",
        width: "100%",
        boxSizing: "border-box"
      }}>
        {/* Left: Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(30px)",
          borderRadius: "clamp(20px, 4vw, 32px)",
          padding: "clamp(24px, 5vw, 48px)",
          boxShadow: "0 16px 64px rgba(0,0,0,0.15)",
          animation: "slideIn 0.6s ease",
          position: isMobile ? "relative" : "sticky",
          top: isMobile ? 0 : 60
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{
              margin: 0,
              fontSize: "clamp(20px, 4vw, 24px)",
              fontWeight: 600,
              color: "#4a3234"
            }}>
              {isNewProfile ? "Create Profile" : "Edit Profile"}
            </h2>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <div style={{
                fontSize: 13,
                color: "#6b6b6b",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span style={{ color: "#4a3234", fontWeight: 600 }}>{completion}%</span>
              </div>
              <div style={{
                width: 80,
                height: 3,
                background: "#e8dfd6",
                borderRadius: 2,
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${completion}%`,
                  height: "100%",
                  background: completion === 100 ? "#4a3234" : "#6b6b6b",
                  transition: "width 0.5s ease, background 0.3s ease"
                }} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            {/* Avatar and Name in same row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
              <AvatarPicker
                avatarUrl={formData.avatarUrl || ""}
                onAvatarUrlChange={(v) => setValue("avatarUrl", v)}
                onFileChange={setAvatarFile}
                disabled={saving}
              />
              
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#6b6b6b",
                  marginBottom: 8,
                  display: "block",
                  letterSpacing: "0"
                }}>
                  Name *
                </label>
                <input
                  {...register("name")}
                  disabled={saving}
                  placeholder="Your full name"
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: errors.name ? "2px solid #ef4444" : "2px solid #e5e7eb",
                    fontSize: 15,
                    transition: "all 0.2s ease",
                    outline: "none",
                    background: "#fff",
                    fontWeight: 400
                  }}
                  onFocus={(e) => {
                    if (!errors.name) e.currentTarget.style.borderColor = "#4a3234";
                  }}
                  onBlur={(e) => {
                    if (!errors.name) e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                />
                {errors.name && (
                  <div style={{
                    fontSize: 13,
                    color: "#ef4444",
                    marginTop: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    <span>⚠️</span> {errors.name.message}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#6b6b6b",
                marginBottom: 8,
                display: "block",
                letterSpacing: "0"
              }}>
                Email *
              </label>
              <input
                {...register("email")}
                disabled={saving}
                type="email"
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: errors.email ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 15,
                  transition: "all 0.2s ease",
                  outline: "none",
                  background: "#fff",
                  fontWeight: 400
                }}
                onFocus={(e) => {
                  if (!errors.email) e.currentTarget.style.borderColor = "#4a3234";
                }}
                onBlur={(e) => {
                  if (!errors.email) e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              />
              {errors.email && (
                <div style={{
                  fontSize: 13,
                  color: "#ef4444",
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span>⚠️</span> {errors.email.message}
                </div>
              )}
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#6b6b6b",
                  letterSpacing: "0"
                }}>
                  Bio
                </label>
                <span style={{
                  fontSize: 12,
                  color: bioLength > 500 ? "#ef4444" : "#9ca3af",
                  fontWeight: 600
                }}>
                  {bioLength}/500
                </span>
              </div>
              <textarea
                {...register("bio")}
                disabled={saving}
                rows={4}
                placeholder="Tell us about yourself..."
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: errors.bio ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 15,
                  transition: "all 0.2s ease",
                  outline: "none",
                  fontFamily: "inherit",
                  resize: "vertical",
                  background: "#fff",
                  lineHeight: 1.6,
                  fontWeight: 400,
                  scrollbarWidth: "none",
                  msOverflowStyle: "none"
                }}
                className="hide-scrollbar"
                onFocus={(e) => {
                  if (!errors.bio) e.currentTarget.style.borderColor = "#4a3234";
                }}
                onBlur={(e) => {
                  if (!errors.bio) e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              />
              {errors.bio && (
                <div style={{
                  fontSize: 13,
                  color: "#ef4444",
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span>⚠️</span> {errors.bio.message}
                </div>
              )}
            </div>

            {/* Social Links Section */}
            <div>
              <label style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#6b6b6b",
                marginBottom: 16,
                display: "block",
                letterSpacing: "0"
              }}>
                🔗 Social Links
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { name: "github", icon: "GitHub", placeholder: "https://github.com/username" },
                  { name: "linkedin", icon: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
                  { name: "twitter", icon: "Twitter/X", placeholder: "https://twitter.com/username" },
                  { name: "website", icon: "Website", placeholder: "https://yourwebsite.com" },
                ].map(({ name, icon, placeholder }) => (
                  <div key={name}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 8,
                      marginBottom: 6
                    }}>
                      <div style={{ 
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6b6b6b"
                      }}>
                        {SocialIcons[name as keyof typeof SocialIcons]}
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#6b6b6b",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}>
                        {icon}
                      </span>
                    </div>
                    <input
                      {...register(`socialLinks.${name}` as any)}
                      disabled={saving}
                      placeholder={placeholder}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "2px solid #e5e7eb",
                        fontSize: 14,
                        transition: "all 0.2s ease",
                        outline: "none",
                        background: "#fff",
                        fontWeight: 400
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#4a3234";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#6b6b6b",
                marginBottom: 12,
                display: "block",
                letterSpacing: "0"
              }}>
                Skills
              </label>
              <SkillTags value={formData.skills || []} onChange={(next) => setValue("skills", next)} />
              {errors.skills && (
                <div style={{
                  fontSize: 13,
                  color: "#ef4444",
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span>⚠️</span> {errors.skills.message}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, paddingTop: 16, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                style={{
                  flex: isMobile ? "1 1 100%" : 1,
                  padding: "16px 24px",
                  borderRadius: 12,
                  border: "2px solid #e5e7eb",
                  background: "#fff",
                  color: "#6b7280",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: 15,
                  fontWeight: 700,
                  transition: "all 0.2s ease",
                  letterSpacing: "0.02em"
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.borderColor = "#9ca3af";
                    e.currentTarget.style.color = "#374151";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.color = "#6b7280";
                  }
                }}
              >
                Cancel
              </button>
              {hasChanges && (
                <button
                  type="submit"
                  disabled={saving || Object.keys(errors).length > 0}
                  style={{
                    flex: isMobile ? "1 1 100%" : 2,
                    padding: "16px 24px",
                    borderRadius: 12,
                    border: "none",
                    background: saving || Object.keys(errors).length > 0 ? "#e5e7eb" : "#4a3234",
                    color: saving || Object.keys(errors).length > 0 ? "#9ca3af" : "#f5f1ea",
                    cursor: saving || Object.keys(errors).length > 0 ? "not-allowed" : "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    letterSpacing: "0",
                    boxShadow: saving || Object.keys(errors).length > 0 ? "none" : "0 4px 16px rgba(74, 50, 52, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (!saving && Object.keys(errors).length === 0) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(74, 50, 52, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!saving && Object.keys(errors).length === 0) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(74, 50, 52, 0.3)";
                    }
                  }}
                >
                  {saving ? "💾 Saving..." : "💾 Save Changes"}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Right: Live Preview - Hide on mobile */}
        {!isMobile && (
          <div style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(228, 201, 192, 0.3)",
            borderRadius: 32,
            padding: 48,
            boxShadow: "0 16px 64px rgba(74, 50, 52, 0.08)",
            animation: "slideIn 0.6s ease 0.1s backwards",
            position: "sticky",
            top: 60
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#6b6b6b",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span style={{ fontSize: 20 }}>👁️</span> Live Preview
            </div>

            {/* Preview avatar and name */}
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
              <div style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4a3234 0%, #6b6b6b 100%)",
                padding: 4,
                boxShadow: "0 8px 24px rgba(74, 50, 52, 0.2)"
              }}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#4a3234",
                  letterSpacing: "0",
                  marginBottom: 6,
                  wordBreak: "break-word"
                }}>
                  {formData.name || "Your Name"}
                </h3>
                <div style={{
                  fontSize: 13,
                  color: "#6b6b6b",
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  wordBreak: "break-word"
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {formData.email || "your@email.com"}
                </div>

                {/* Preview Social Links */}
                {formData.socialLinks && Object.values(formData.socialLinks).filter(Boolean).length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Object.entries(formData.socialLinks).map(([platform, url]) => {
                      if (!url) return null;
                      return (
                        <div
                          key={platform}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "#4a3234",
                            color: "#f5f1ea",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14
                          }}
                        >
                          {SocialIcons[platform as keyof typeof SocialIcons]}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Preview bio */}
            {formData.bio && (
              <div style={{
                background: "rgba(228, 201, 192, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(228, 201, 192, 0.3)",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24
              }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b6b6b",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: 12
                }}>
                  About
                </div>
                <p style={{
                  margin: 0,
                  color: "#4a3234",
                  fontSize: 14,
                  lineHeight: 1.6,
                  letterSpacing: "0",
                  wordBreak: "break-word"
                }}>
                  {formData.bio}
                </p>
              </div>
            )}

            {/* Preview skills */}
            {formData.skills && formData.skills.length > 0 && (
              <div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b6b6b",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: 16
                }}>
                  Skills · {formData.skills.length}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {formData.skills.map((s: string) => (
                    <span
                      key={s}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 50,
                        background: "#4a3234",
                        border: "1px solid #4a3234",
                        color: "#f5f1ea",
                        fontSize: 13,
                        fontWeight: 500,
                        letterSpacing: "0",
                        boxShadow: "0 2px 6px rgba(74, 50, 52, 0.2)"
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to check if profile is empty
function isProfileEmpty(data: any): boolean {
  return !data.name && !data.email && !data.bio && !data.avatarUrl && (!data.skills || data.skills.length === 0);
}

// Main ProfileForm Component
export default function ProfileForm() {
  const { profileQuery, updateMutation } = useProfile();
  
  // Check if profile is empty - if so, start in edit mode
  const profileEmpty = profileQuery.data ? isProfileEmpty(profileQuery.data) : false;
  const [isEditing, setIsEditing] = React.useState(profileEmpty);

  // Update isEditing when profile data changes (if it becomes empty or filled)
  React.useEffect(() => {
    if (profileQuery.data) {
      const empty = isProfileEmpty(profileQuery.data);
      if (empty) {
        setIsEditing(true);
      }
    }
  }, [profileQuery.data]);

  const saving = updateMutation.isPending;

  const handleSave = (formData: any) => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append("bio", formData.bio || "");
    fd.append("avatarUrl", formData.avatarUrl || "");
    fd.append("skills", JSON.stringify(formData.skills || []));
    fd.append("socialLinks", JSON.stringify(formData.socialLinks || {}));
    fd.append("version", String(formData.version ?? 0));

    if (formData.avatarFile) {
      if (formData.avatarFile.size > 2 * 1024 * 1024) {
        toast.error("Avatar too large (max 2MB)");
        return;
      }
      fd.append("avatar", formData.avatarFile);
    }

    updateMutation.mutate(fd);
    setIsEditing(false);
  };

  if (profileQuery.isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        <div style={{ color: "#666", fontSize: 14 }}>Loading profile...</div>
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 14, marginBottom: 16, color: "#666" }}>Failed to load profile</p>
          <button
            type="button"
            onClick={() => profileQuery.refetch()}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "1px solid #e0e0e0",
              background: "white",
              color: "#1a1a1a",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isEditing ? (
        <ProfileView data={profileQuery.data} onEdit={() => setIsEditing(true)} />
      ) : (
        <ProfileEdit
          data={{
            ...profileQuery.data,
            avatarFile: null,
          }}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          saving={saving}
        />
      )}
    </>
  );
}
