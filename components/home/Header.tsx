"use client";

import { Binary, Moon, Sun, TextAlignJustify, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { NavItems } from "../constant/main-constant.js";
export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="fixed left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b shadow-sm transition-colors duration-300">
      <header className="container flex items-center justify-between mx-auto px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Binary className="w-8 h-8  " />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NavItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400 text-sm font-medium transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full p-2"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          <Link to="/login">
            <Button
              variant="outline"
              className="font-medium dark:border-gray-700"
            >
              Sign in
            </Button>
          </Link>
          <Link to="/Auth">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 dark:text-gray-200"
        >
          {menuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <TextAlignJustify className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-inner transition-all duration-300">
          <nav className="flex flex-col px-4 py-4 space-y-5">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400 text-sm font-medium transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-8">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="font-medium dark:border-gray-700"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/Auth">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
                  Get Started
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-center gap-2"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4" /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" /> Dark Mode
                  </>
                )}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
