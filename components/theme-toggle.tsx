"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "./ui/button";

// These functions allow React to distinguish between
// server rendering and browser rendering.
const subscribe = () => () => {};

const getClientSnapshot = () => true;

const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Loading theme preference"
        disabled
      >
        <Sun size={18} />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      title={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
