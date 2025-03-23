import { useEffect } from "react";
import { Button } from "../ui/button";
import { Sun } from "lucide-react";

const ThemeToggle = () => {
  useEffect(() => {
    document.documentElement.classList.remove("dark"); // Ensure dark mode is disabled
    document.documentElement.classList.add("light");  // Force light mode
  }, []);

  return (
    <Button variant="outline" size="icon" disabled>
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Light Theme</span>
    </Button>
  );
};

export default ThemeToggle;
