import { useTheme } from "../../../utils/hooks/useTheme";
import { Switch } from "@/components/ui/switch"


const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  return (
    <div className="flex items-center justify-center">
      {/* <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full bg-gray-200 dark:bg-white">
        {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button> */}
      <Switch color="white" onCheckedChange={()=> {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }}/>
    </div>
  );
};

export default ThemeToggle;
