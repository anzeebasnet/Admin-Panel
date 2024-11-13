// import { useTheme } from "../../../utils/hooks/useTheme";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Set the initial state based on the current theme
  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex items-center justify-center">
      <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
    </div>
  );
};

export default ThemeToggle;
