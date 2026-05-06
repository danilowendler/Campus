import type { ProjectCategory } from "@/lib/supabase/types";

export interface ProjectFilters {
  skills: string[];
  category: ProjectCategory | "all";
  openOnly: boolean;
  matchOnly: boolean;
}

export const DEFAULT_FILTERS: ProjectFilters = {
  skills: [],
  category: "all",
  openOnly: false,
  matchOnly: false,
};

const VALID_CATEGORIES: ReadonlyArray<ProjectFilters["category"]> = [
  "all",
  "partner",
  "academic",
  "open",
];

export function parseFiltersFromSearchParams(
  params: URLSearchParams | ReadonlyURLSearchParams
): ProjectFilters {
  const skillsRaw = params.get("skills") ?? "";
  const categoryRaw = params.get("category") ?? "all";

  const skills = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const category = (VALID_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as ProjectFilters["category"])
    : "all";

  return {
    skills,
    category,
    openOnly: params.get("openOnly") === "1",
    matchOnly: params.get("matchOnly") === "1",
  };
}

export function serializeFilters(filters: ProjectFilters): string {
  const params = new URLSearchParams();
  if (filters.skills.length > 0) params.set("skills", filters.skills.join(","));
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.openOnly) params.set("openOnly", "1");
  if (filters.matchOnly) params.set("matchOnly", "1");
  return params.toString();
}

export function activeFilterCount(filters: ProjectFilters): number {
  let n = 0;
  if (filters.skills.length > 0) n += filters.skills.length;
  if (filters.category !== "all") n += 1;
  if (filters.openOnly) n += 1;
  if (filters.matchOnly) n += 1;
  return n;
}

export function filtersEqual(a: ProjectFilters, b: ProjectFilters): boolean {
  return (
    a.category === b.category &&
    a.openOnly === b.openOnly &&
    a.matchOnly === b.matchOnly &&
    a.skills.length === b.skills.length &&
    a.skills.every((s, i) => s === b.skills[i])
  );
}

type ReadonlyURLSearchParams = {
  get(name: string): string | null;
};
