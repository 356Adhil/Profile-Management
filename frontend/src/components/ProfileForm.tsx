import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { ProfileFormValues } from "../types/profile";
import SkillTags from "./SkillTags";
import AvatarPicker from "./AvatarPicker";
import { debounce } from "../utils/debounce";
import { useProfile } from "../hooks/useProfile";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").max(200),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().max(500).optional(),
  skills: z.array(z.string()).max(30),
  version: z.number().min(0),
  avatarFile: z.any().optional().nullable(),
});

export default function ProfileForm() {
  const { profileQuery, updateMutation } = useProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange", // realtime validation ✅
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      avatarUrl: "",
      skills: [],
      version: 0,
      avatarFile: null,
    },
  });

  // When profile loads, populate form
  React.useEffect(() => {
    const p = profileQuery.data;
    if (!p) return;

    form.reset({
      name: p.name || "",
      email: p.email || "",
      bio: p.bio || "",
      avatarUrl: p.avatarUrl || "",
      skills: p.skills || [],
      version: p.version ?? 0,
      avatarFile: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQuery.data]);

  const saving = updateMutation.isPending;

  const submitNow = form.handleSubmit((values) => {
    // Build multipart form to support avatar file upload (multer)
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("email", values.email);
    fd.append("bio", values.bio || "");
    fd.append("avatarUrl", values.avatarUrl || "");
    fd.append("skills", JSON.stringify(values.skills || []));
    fd.append("version", String(values.version ?? 0));

    if (values.avatarFile) {
      // Backend enforces 2MB too, but we can pre-check for nicer UX
      if (values.avatarFile.size > 2 * 1024 * 1024) {
        toast.error("Avatar too large (max 2MB)");
        return;
      }
      fd.append("avatar", values.avatarFile);
    }

    updateMutation.mutate(fd);
  });

  // Debounced submit (300ms)
  const submitDebounced = React.useMemo(() => debounce(submitNow, 300), [submitNow]);

  if (profileQuery.isLoading) {
    return <div style={{ padding: 16 }}>Loading profile…</div>;
  }

  if (profileQuery.isError) {
    return (
      <div style={{ padding: 16 }}>
        Failed to load profile.
        <button type="button" onClick={() => profileQuery.refetch()} style={{ marginLeft: 8 }}>
          Retry
        </button>
      </div>
    );
  }

  const errors = form.formState.errors;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitDebounced();
      }}
      style={{
        maxWidth: 640,
        margin: "40px auto",
        padding: 16,
        border: "1px solid #eee",
        borderRadius: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Profile</h2>
        <button
          type="submit"
          disabled={saving || !form.formState.isValid}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: saving ? "#f3f3f3" : "white",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Name</span>
          <input
            {...form.register("name")}
            disabled={saving}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
          {errors.name && <small style={{ color: "crimson" }}>{errors.name.message}</small>}
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            {...form.register("email")}
            disabled={saving}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
          {errors.email && <small style={{ color: "crimson" }}>{errors.email.message}</small>}
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Bio</span>
          <textarea
            {...form.register("bio")}
            disabled={saving}
            rows={4}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
          {errors.bio && <small style={{ color: "crimson" }}>{errors.bio.message}</small>}
        </label>

        <div style={{ display: "grid", gap: 6 }}>
          <span>Avatar</span>
          <AvatarPicker
            avatarUrl={form.watch("avatarUrl") || ""}
            onAvatarUrlChange={(v) => form.setValue("avatarUrl", v, { shouldValidate: true })}
            onFileChange={(f) => form.setValue("avatarFile", f, { shouldValidate: true })}
            disabled={saving}
          />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <span>Skills</span>
          <SkillTags
            value={form.watch("skills")}
            onChange={(next) => form.setValue("skills", next, { shouldValidate: true })}
          />
        </div>

        {/* version is hidden but essential for conflict handling */}
        <input type="hidden" value={form.watch("version")} {...form.register("version", { valueAsNumber: true })} />

        <div style={{ fontSize: 12, color: "#777" }}>
          Last updated: {profileQuery.data?.updatedAt ? new Date(profileQuery.data.updatedAt).toLocaleString() : "-"}
          {" · "}
          Version: {profileQuery.data?.version ?? 0}
        </div>
      </div>
    </form>
  );
}