"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { MOCK_USER_ID, MOCK_USER_NAME } from "./mock-data";

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
  updateProfile: (patch: Partial<Omit<UserProfile, "id" | "email">>) => void;
}

const INITIAL_PROFILE: UserProfile = {
  id: MOCK_USER_ID,
  name: MOCK_USER_NAME,
  email: "danilo.wendler@fiap.com.br",
  course: "Tecnologia",
  bio: "Estudante de Engenharia de Software apaixonado por produtos digitais. Experiência em desenvolvimento fullstack, design systems e automação de processos.",
  skills: ["React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS"],
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);

  const updateProfile = useCallback(
    (patch: Partial<Omit<UserProfile, "id" | "email">>) => {
      setProfile((prev) => ({ ...prev, ...patch }));
    },
    []
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
