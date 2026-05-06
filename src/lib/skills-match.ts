function normalize(skill: string): string {
  return skill.trim().toLowerCase();
}

export interface MatchResult {
  score: number;
  matched: string[];
}

export function calculateMatchScore(
  userSkills: readonly string[],
  projectSkills: readonly string[]
): MatchResult {
  if (projectSkills.length === 0 || userSkills.length === 0) {
    return { score: 0, matched: [] };
  }

  const userSet = new Set(userSkills.map(normalize));
  const matched = projectSkills.filter((s) => userSet.has(normalize(s)));

  return {
    score: matched.length / projectSkills.length,
    matched,
  };
}
