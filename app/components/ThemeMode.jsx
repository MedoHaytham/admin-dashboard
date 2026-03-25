/* eslint-disable react-hooks/set-state-in-effect */
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

    const handleThemeSync = (e) => {
      setTheme(e.detail);
    };
    window.addEventListener("theme-change", handleThemeSync);
    return () => window.removeEventListener("theme-change", handleThemeSync);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  if (!mounted) return null;

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
      }}
      className="
        group relative inline-flex items-center justify-between
        w-16 h-8 lg:w-20 lg:h-10 rounded-full border border-border-primary
        bg-secondary px-2 shadow-md
        transition active:scale-[0.98]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-text-secondary/40
      "
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="relative z-10 grid justify-center items-center pr-1 w-6 h-6 lg:w-7 lg:h-7">
        <Moon
          size={16}
          className={`transition ${isLight ? "opacity-40" : "opacity-100"} text-text-secondary`}
        />
      </span>

      <span className="relative z-10 grid justify-center items-center pl-2 w-6 h-6 lg:w-7 lg:h-7">
        <Sun
          size={16}
          className={`transition ${isLight ? "opacity-100" : "opacity-40"} text-text-secondary`}
        />
      </span>

      <span
        className={`
          absolute top-1.1 ${isLight ? "left-0.5" : "left-1"} lg:left-1 h-6 w-6 lg:h-8 lg:w-8 rounded-full
          bg-primary border border-border-primary
          shadow-lg transition-transform duration-300 ease-out
          ${isLight ? "translate-x-8 lg:translate-x-10" : "translate-x-0"}
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
