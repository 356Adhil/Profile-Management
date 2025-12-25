import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(200),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
  avatarUrl: z.string().trim().max(500).optional().or(z.literal("")),
  skills: z.array(z.string().trim().min(1)).max(30),
  socialLinks: z.object({
    github: z.string().trim().max(200).optional().or(z.literal("")),
    linkedin: z.string().trim().max(200).optional().or(z.literal("")),
    twitter: z.string().trim().max(200).optional().or(z.literal("")),
    website: z.string().trim().max(200).optional().or(z.literal("")),
  }).optional(),
  version: z.number().int().min(0),
});