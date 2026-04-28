"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { INITIAL_PROJECTS, MOCK_USER_ID, MOCK_USER_NAME, Project, Member } from "./mock-data";

interface CreateProjectInput {
  title: string;
  company: string;
  description: string;
  scope: string;
  reward: string;
  skills: string[];
  slots: number;
}

interface ProjectsContextValue {
  projects: Project[];
  currentUserId: string;
  currentUserName: string;
  addProject: (input: CreateProjectInput) => void;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  isMember: (projectId: string) => boolean;
  isAuthor: (projectId: string) => boolean;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const addProject = useCallback((input: CreateProjectInput) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      ...input,
      members: [{ name: MOCK_USER_NAME, course: "Tecnologia" }],
      authorId: MOCK_USER_ID,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
  }, []);

  const joinProject = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        if (p.members.some((m) => m.name === MOCK_USER_NAME)) return p;
        const newMember: Member = { name: MOCK_USER_NAME, course: "Tecnologia" };
        const newMembers = [...p.members, newMember];
        return {
          ...p,
          members: newMembers,
          status: newMembers.length >= p.slots ? "full" : p.status,
        };
      })
    );
  }, []);

  const leaveProject = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newMembers = p.members.filter((m) => m.name !== MOCK_USER_NAME);
        return {
          ...p,
          members: newMembers,
          status: p.status === "full" ? "active" : p.status,
        };
      })
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const isMember = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      return project?.members.some((m) => m.name === MOCK_USER_NAME) ?? false;
    },
    [projects]
  );

  const isAuthor = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      return project?.authorId === MOCK_USER_ID;
    },
    [projects]
  );

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        currentUserId: MOCK_USER_ID,
        currentUserName: MOCK_USER_NAME,
        addProject,
        joinProject,
        leaveProject,
        deleteProject,
        isMember,
        isAuthor,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used inside ProjectsProvider");
  return ctx;
}
