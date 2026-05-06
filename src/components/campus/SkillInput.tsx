"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { SkillTag } from "./SkillTag";

interface SkillInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function SkillInput({
  value,
  onChange,
  placeholder = "Digite uma skill e pressione Enter…",
  maxTags = 10,
}: SkillInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag || value.includes(tag) || value.length >= maxTags) return;
    onChange([...value, tag]);
    setInputValue("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div
      className="flex flex-wrap gap-2 p-3 rounded-[10px] cursor-text min-h-[46px]"
      style={{
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.03)",
        transition: "border-color .15s, box-shadow .15s",
      }}
      onClick={() => inputRef.current?.focus()}
      onFocusCapture={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px var(--accent-soft)";
      }}
      onBlurCapture={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {value.map((tag) => (
        <SkillTag key={tag} label={tag} onRemove={() => removeTag(tag)} />
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(inputValue)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-sm"
        style={{
          color: "var(--text)",
          fontFamily: "var(--font)",
        }}
        aria-label="Adicionar skill"
      />
    </div>
  );
}
