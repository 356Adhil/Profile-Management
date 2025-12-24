import type { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { Profile } from "../models/Profile";
import { updateProfileSchema } from "../validators/profile.validator";
import { sanitizeEmail, sanitizeSkills, sanitizeString } from "../utils/sanitize";

function publicUploadUrl(filename: string) {
  // served from /uploads static
  return `/uploads/avatars/${filename}`;
}

export async function getProfile(_req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await Profile.findOne().lean();

    if (!doc) {
      // no profile yet; return empty draft with version 0
      return res.json({
        name: "",
        email: "",
        bio: "",
        avatarUrl: "",
        skills: [],
        updatedAt: new Date().toISOString(),
        version: 0,
      });
    }

    return res.json({
      name: doc.name,
      email: doc.email,
      bio: doc.bio ?? "",
      avatarUrl: doc.avatarUrl ?? "",
      skills: doc.skills ?? [],
      updatedAt: doc.updatedAt,
      version: doc.version,
    });
  } catch (e) {
    next(e);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const rawSkills = (req.body as any).skills;

    const payload = {
      name: sanitizeString((req.body as any).name),
      email: sanitizeEmail((req.body as any).email),
      bio: sanitizeString((req.body as any).bio) || undefined,
      avatarUrl: sanitizeString((req.body as any).avatarUrl) || undefined,
      skills: sanitizeSkills(rawSkills),
      version: Number((req.body as any).version ?? 0),
    };

    const parsed = updateProfileSchema.parse(payload);

    // If file uploaded, save it and override avatarUrl
    if ((req as any).file) {
      const file = (req as any).file as Express.Multer.File;
      const safeName =
        `${Date.now()}-${file.originalname}`.replace(/[^a-zA-Z0-9._-]/g, "_");

      const outPath = path.join(process.cwd(), "uploads", "avatars", safeName);
      fs.mkdirSync(path.join(process.cwd(), "uploads", "avatars"), { recursive: true });
      fs.writeFileSync(outPath, file.buffer);
      parsed.avatarUrl = publicUploadUrl(safeName);
    }

    const existing = await Profile.findOne();

    // Create if first time
    if (!existing) {
      const created = await Profile.create({
        ...parsed,
        version: 1, // start at 1
      });

      return res.json({
        name: created.name,
        email: created.email,
        bio: created.bio ?? "",
        avatarUrl: created.avatarUrl ?? "",
        skills: created.skills ?? [],
        updatedAt: created.updatedAt,
        version: created.version,
      });
    }

    // Optimistic concurrency check via version
    if (existing.version !== parsed.version) {
      return res.status(409).json({
        message: "Version conflict. Please refresh and try again.",
        currentVersion: existing.version,
      });
    }

    existing.name = parsed.name;
    existing.email = parsed.email;
    existing.bio = parsed.bio;
    existing.avatarUrl = parsed.avatarUrl;
    existing.skills = parsed.skills;
    existing.version = existing.version + 1;

    await existing.save();

    return res.json({
      name: existing.name,
      email: existing.email,
      bio: existing.bio ?? "",
      avatarUrl: existing.avatarUrl ?? "",
      skills: existing.skills ?? [],
      updatedAt: existing.updatedAt,
      version: existing.version,
    });
  } catch (e) {
    next(e);
  }
}