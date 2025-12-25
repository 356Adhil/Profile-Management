import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(200, "Email too long"),
  bio: z.string().trim().max(500, "Bio too long (max 500)").optional().or(z.literal("")),
  avatarUrl: z.string().trim().max(500).optional().or(z.literal("")),
  skills: z.array(z.string().trim().min(1)).max(30, "Too many skills (max 30)"),
  socialLinks: z.object({
    github: z.string().trim().max(200).optional().or(z.literal("")),
    linkedin: z.string().trim().max(200).optional().or(z.literal("")),
    twitter: z.string().trim().max(200).optional().or(z.literal("")),
    website: z.string().trim().max(200).optional().or(z.literal("")),
  }).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
