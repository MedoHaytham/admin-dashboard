"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const initial = saved === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initial);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  if (!mounted) return null; // يمنع mismatch

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="
        hidden group relative md:inline-flex items-center justify-between
        w-20 h-10 rounded-full border border-border-primary
        bg-secondary px-2 shadow-md
        transition active:scale-[0.98]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-text-secondary/40
      "
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="relative z-10 grid justify-center items-center pr-1 w-7 h-7">
        <Moon
          size={16}
          className={`transition ${isLight ? "opacity-40" : "opacity-100"} text-text-secondary`}
        />
      </span>

      <span className="relative z-10 grid justify-center items-center pl-2 w-7 h-7">
        <Sun
          size={16}
          className={`transition ${isLight ? "opacity-100" : "opacity-40"} text-text-secondary`}
        />
      </span>

      <span
        className={`
          absolute top-1 left-1 h-8 w-8 rounded-full
          bg-primary border border-border-primary
          shadow-lg transition-transform duration-300 ease-out
          ${isLight ? "translate-x-10" : "translate-x-0"}
        `}
      />

      <span
        className="
          absolute inset-0 rounded-full opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
          ring-1 ring-text-secondary/15
        "
      />
    </button>
  );
}
