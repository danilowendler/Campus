"use client";

interface ScrollLinkProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollLink({ targetId, children, className, style }: ScrollLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <a href={`#${targetId}`} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
