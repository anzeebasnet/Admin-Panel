"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full dark:bg-blue bg-vl_blue sm:w-10 sm:h-10 w-8 h-8"
        >
          <Sun
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            color="black"
          />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {theme === "light" ? (
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className="dark:bg-blue bg-vl_blue "
          >
            Light
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
        )}

        {theme === "dark" ? (
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className="dark:bg-blue bg-vl_blue "
          >
            Dark
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
        )}

        {theme === "system" ? (
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className="dark:bg-blue bg-vl_blue "
          >
            System
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
