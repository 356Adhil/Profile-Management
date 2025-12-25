export type Profile = {
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
  updatedAt: string;
  version: number;
};

export type ProfileFormValues = {
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
  avatarFile?: File | null;
};