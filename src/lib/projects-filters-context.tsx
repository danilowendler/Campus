"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  DEFAULT_FILTERS,
  activeFilterCount,
  filtersEqual,
  parseFiltersFromSearchParams,
  serializeFilters,
  type ProjectFilters,
} from "@/lib/projects-filters";

const STORAGE_KEY = "campus:projects-filters";

interface ProjectsFiltersContextValue {
  filters: ProjectFilters;
  setSkills: (skills: string[]) => void;
  toggleSkill: (skill: string) => void;
  setCategory: (category: ProjectFilters["category"]) => void;
  setOpenOnly: (value: boolean) => void;
  setMatchOnly: (value: boolean) => void;
  reset: () => void;
  activeCount: number;
}

const ProjectsFiltersContext = createContext<ProjectsFiltersContextValue | null>(null);

export function ProjectsFiltersProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inicializa a partir da URL (fonte da verdade no SSR/deep-link).
  // Se URL vazia mas localStorage tem algo, hidrata via efeito (precisa estar no client).
  const [filters, setFilters] = useState<ProjectFilters>(() =>
    parseFiltersFromSearchParams(searchParams)
  );

  const hydratedFromStorage = useRef(false);

  // Hidratação inicial: se URL vazia mas localStorage tem filtros salvos,
  // aplica e replica para a URL via replace (sem poluir history).
  useEffect(() => {
    if (hydratedFromStorage.current) return;
    hydratedFromStorage.current = true;

    const fromUrl = parseFiltersFromSearchParams(searchParams);
    if (activeFilterCount(fromUrl) > 0) return; // URL ganha sempre

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ProjectFilters>;
      const restored: ProjectFilters = {
        ...DEFAULT_FILTERS,
        ...parsed,
        skills: Array.isArray(parsed.skills) ? parsed.skills.filter((s) => typeof s === "string") : [],
      };
      if (activeFilterCount(restored) === 0) return;
      setFilters(restored);
      const qs = serializeFilters(restored);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    } catch {
      // localStorage indisponível ou JSON inválido — silencioso
    }
  }, [searchParams, pathname, router]);

  // Sincroniza state -> URL + localStorage (debounced para evitar spam).
  // Não depende de searchParams: lemos window.location no callback para
  // evitar re-criar o timer cada vez que a URL muda (loop de auto-trigger).
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const qs = serializeFilters(filters);
      const nextUrl = qs ? `${pathname}?${qs}` : pathname;
      const currentUrl =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : pathname;
      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
      try {
        if (activeFilterCount(filters) === 0) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
        }
      } catch {
        // ignore
      }
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, pathname, router]);

  // Sincroniza URL -> state quando o usuário navega (back/forward).
  useEffect(() => {
    const fromUrl = parseFiltersFromSearchParams(searchParams);
    setFilters((prev) => (filtersEqual(prev, fromUrl) ? prev : fromUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setSkills = useCallback((skills: string[]) => {
    setFilters((prev) => ({ ...prev, skills }));
  }, []);

  const toggleSkill = useCallback((skill: string) => {
    const normalized = skill.trim();
    if (!normalized) return;
    setFilters((prev) => {
      const lower = normalized.toLowerCase();
      const has = prev.skills.some((s) => s.toLowerCase() === lower);
      return {
        ...prev,
        skills: has
          ? prev.skills.filter((s) => s.toLowerCase() !== lower)
          : [...prev.skills, normalized],
      };
    });
  }, []);

  const setCategory = useCallback((category: ProjectFilters["category"]) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setOpenOnly = useCallback((value: boolean) => {
    setFilters((prev) => ({ ...prev, openOnly: value }));
  }, []);

  const setMatchOnly = useCallback((value: boolean) => {
    setFilters((prev) => ({ ...prev, matchOnly: value }));
  }, []);

  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const value = useMemo<ProjectsFiltersContextValue>(
    () => ({
      filters,
      setSkills,
      toggleSkill,
      setCategory,
      setOpenOnly,
      setMatchOnly,
      reset,
      activeCount: activeFilterCount(filters),
    }),
    [filters, setSkills, toggleSkill, setCategory, setOpenOnly, setMatchOnly, reset]
  );

  return (
    <ProjectsFiltersContext.Provider value={value}>
      {children}
    </ProjectsFiltersContext.Provider>
  );
}

export function useProjectsFilters(): ProjectsFiltersContextValue {
  const ctx = useContext(ProjectsFiltersContext);
  if (!ctx) throw new Error("useProjectsFilters must be used inside <ProjectsFiltersProvider>");
  return ctx;
}
