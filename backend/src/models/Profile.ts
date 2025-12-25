import { Schema, model } from "mongoose";

export type ProfileDoc = {
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  skills: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  version: number;
  updatedAt: Date;
};

const ProfileSchema = new Schema<ProfileDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 200 },
    bio: { type: String, trim: true, maxlength: 500 },
    avatarUrl: { type: String, trim: true, maxlength: 500 },
    skills: { type: [String], default: [] },
    socialLinks: {
      type: {
        github: { type: String, trim: true },
        linkedin: { type: String, trim: true },
        twitter: { type: String, trim: true },
        website: { type: String, trim: true },
      },
      default: {},
      _id: false
    },
    version: { type: Number, required: true, default: 1 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Profile = model<ProfileDoc>("Profile", ProfileSchema);