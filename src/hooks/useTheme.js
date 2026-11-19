import { useLayoutEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const systemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export default function useTheme() {
  const [theme, setTheme] = useLocalStorage("sneakers-theme", systemTheme());

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}