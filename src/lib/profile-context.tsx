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
      // Atualização otimista: UI reflete imediatamente
      setProfile((prev) => ({ ...prev, ...patch }));
      // Persiste no banco
      await updateProfileAction({
        name: patch.name ?? profile.name,
        course: patch.course ?? profile.course,
        bio: patch.bio ?? profile.bio,
        skills: patch.skills ?? profile.skills,
      });
    },
    [profile]
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
