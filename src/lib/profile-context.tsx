"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { UserRow } from "@/lib/supabase/types";
import { updateProfile as updateProfileAction } from "@/lib/actions/profile";

export type Course =
  | "Tecnologia"
  | "Design"
  | "Negócios"
  | "Saúde"
  | "Educação";

export const COURSES: Course[] = [
  "Tecnologia",
  "Design",
  "Negócios",
  "Saúde",
  "Educação",
];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  course: Course;
  bio: string;
  skills: string[];
}

interface ProfileContextValue {
  profile: UserProfile;
  updateProfile: (patch: Partial<Omit<UserProfile, "id" | "email">>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
  initialData?: UserRow | null;
}

export function ProfileProvider({ children, initialData }: ProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile>(() => ({
    id: initialData?.id ?? "",
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    course: (initialData?.course as Course) ?? "Tecnologia",
    bio: initialData?.bio ?? "",
    skills: initialData?.skills ?? [],
  }));

  const updateProfile = useCallback(
    async (patch: Partial<Omit<UserProfile, "id" | "email">>) => {
      // Usa o setter funcional para ler o estado mais recente (evita stale closure)
      let merged: UserProfile | null = null;
      setProfile((prev) => {
        merged = { ...prev, ...patch };
        return merged;
      });
      // Persiste no banco com os valores já mesclados
      await updateProfileAction({
        name: merged ? (merged as UserProfile).name : patch.name ?? "",
        course: merged ? (merged as UserProfile).course : patch.course ?? "Tecnologia",
        bio: merged ? (merged as UserProfile).bio : patch.bio ?? "",
        skills: merged ? (merged as UserProfile).skills : patch.skills ?? [],
      });
    },
    [] // sem dependência em `profile` — lê via setter funcional
  );

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}
