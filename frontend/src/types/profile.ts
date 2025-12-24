export type Profile = {
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  skills: string[];
  updatedAt: string;
  version: number;
};

export type ProfileFormValues = {
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  skills: string[];
  version: number;
  avatarFile?: File | null;
};