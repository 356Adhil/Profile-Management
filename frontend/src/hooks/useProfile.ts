import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Profile } from "../types/profile";
import { getProfile, updateProfile } from "../api/profileApi";

export function useProfile() {
  const qc = useQueryClient();

  const profileQuery = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,

    onMutate: async (formData: FormData) => {
      await qc.cancelQueries({ queryKey: ["profile"] });
      const prev = qc.getQueryData<Profile>(["profile"]);

      // Minimal optimistic UI: update cache from submitted FormData
      const optimistic: Profile = {
        name: String(formData.get("name") || prev?.name || ""),
        email: String(formData.get("email") || prev?.email || ""),
        bio: String(formData.get("bio") || prev?.bio || ""),
        avatarUrl: String(formData.get("avatarUrl") || prev?.avatarUrl || ""),
        skills: (() => {
          try {
            const raw = String(formData.get("skills") || "[]");
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : prev?.skills || [];
          } catch {
            return prev?.skills || [];
          }
        })(),
        updatedAt: new Date().toISOString(),
        version: Number(formData.get("version") || prev?.version || 0),
      };

      qc.setQueryData(["profile"], optimistic);
      return { prev };
    },

    onSuccess: (data) => {
      qc.setQueryData(["profile"], data);
      toast.success("Profile saved");
    },

    onError: (err: any, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["profile"], ctx.prev);

      if (err?.status === 409) {
        toast.error("Version conflict. Refreshing latest profile...");
        qc.invalidateQueries({ queryKey: ["profile"] });
        return;
      }

      toast.error(err?.message || "Save failed");
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return { profileQuery, updateMutation };
}