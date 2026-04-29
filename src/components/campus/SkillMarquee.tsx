import { SkillTag } from "./SkillTag";

const SKILLS = [
  "React", "Node.js", "Python", "Figma", "TypeScript", "Machine Learning",
  "UI/UX Design", "React Native", "Java", "Product Management", "DevOps",
  "Data Science", "Docker", "Next.js", "PostgreSQL", "Flutter", "AWS",
  "Swift", "Kotlin", "GraphQL",
];

export function SkillMarquee() {
  const doubled = [...SKILLS, ...SKILLS];

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div
        style={{
          overflow: "hidden",
          maskImage:
            "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        <div
          className="marquee-track"
          style={{
            display: "flex",
            gap: 12,
            width: "max-content",
            animation: "marquee 40s linear infinite",
          }}
        >
          {doubled.map((skill, i) => (
            <SkillTag key={i} label={skill} variant="pink" />
          ))}
        </div>
      </div>
    </div>
  );
}
