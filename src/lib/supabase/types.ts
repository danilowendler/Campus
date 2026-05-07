export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type ProjectCategory = "partner" | "academic" | "open";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          course: string;
          bio: string | null;
          skills: string[];
          avatar_url: string | null;
          resume_path: string | null;
          resume_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          course?: string;
          bio?: string | null;
          skills?: string[];
          avatar_url?: string | null;
          resume_path?: string | null;
          resume_name?: string | null;
        };
        Update: {
          name?: string;
          course?: string;
          bio?: string | null;
          skills?: string[];
          avatar_url?: string | null;
          resume_path?: string | null;
          resume_name?: string | null;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          scope: string;
          reward: string;
          company: string;
          slots: number;
          skills: string[];
          status: "active" | "full" | "closed";
          category: ProjectCategory;
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          scope: string;
          reward: string;
          company: string;
          slots: number;
          skills?: string[];
          status?: "active" | "full" | "closed";
          category?: ProjectCategory;
          author_id: string;
        };
        Update: {
          title?: string;
          description?: string;
          scope?: string;
          reward?: string;
          company?: string;
          slots?: number;
          skills?: string[];
          status?: "active" | "full" | "closed";
          category?: ProjectCategory;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          user_id: string;
          project_id: string;
          joined_at: string;
        };
        Insert: {
          user_id: string;
          project_id: string;
        };
        Update: never;
      };
    };
    Views: {
      projects_with_members: {
        Row: {
          id: string;
          title: string;
          description: string;
          scope: string;
          reward: string;
          company: string;
          slots: number;
          skills: string[];
          status: "active" | "full" | "closed";
          category: ProjectCategory;
          author_id: string;
          created_at: string;
          member_count: number;
          members: Json;
        };
      };
      open_projects_with_vacancies: {
        Row: {
          id: string;
          title: string;
          description: string;
          scope: string;
          reward: string;
          company: string;
          slots: number;
          skills: string[];
          status: "active" | "full" | "closed";
          category: ProjectCategory;
          author_id: string;
          created_at: string;
          member_count: number;
          members: Json;
          available_slots: number;
        };
      };
    };
  };
}

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type MembershipRow = Database["public"]["Tables"]["memberships"]["Row"];
export type ProjectWithMembers = Database["public"]["Views"]["projects_with_members"]["Row"];
export type OpenProjectWithVacancies = Database["public"]["Views"]["open_projects_with_vacancies"]["Row"];
