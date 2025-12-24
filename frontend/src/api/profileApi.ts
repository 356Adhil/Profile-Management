import type { Profile } from "../types/profile";

const BASE = import.meta.env.VITE_API_BASE_URL as string;

async function parseError(res: Response) {
  let data: any = null;
  try {
    data = await res.json();
  } catch {}
  const msg = data?.message || `Request failed (${res.status})`;
  const err: any = new Error(msg);
  err.status = res.status;
  err.data = data;
  throw err;
}

export async function getProfile(): Promise<Profile> {
  const res = await fetch(`${BASE}/profile`);
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function updateProfile(formData: FormData): Promise<Profile> {
  const res = await fetch(`${BASE}/profile`, { method: "PUT", body: formData });
  if (!res.ok) await parseError(res);
  return res.json();
}