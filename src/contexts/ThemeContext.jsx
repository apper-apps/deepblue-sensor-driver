import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  light: {
    name: 'White Mode',
    value: 'light',
    icon: 'Sun',
    description: 'Clean and bright interface'
  },
  dark: {
    name: 'Dark Mode', 
    value: 'dark',
    icon: 'Moon',
    description: 'Easy on the eyes'
  },
  dive: {
    name: 'Dive Mode',
    value: 'dive', 
    icon: 'Waves',
    description: 'Ocean-inspired depths'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('deepblue-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Update body class and localStorage when theme changes
      document.body.className = document.body.className
        .replace(/theme-\w+/g, '')
        .trim();
      document.body.classList.add(`theme-${currentTheme}`);
      localStorage.setItem('deepblue-theme', currentTheme);
    }
  }, [currentTheme, isLoading]);

  const switchTheme = (themeValue) => {
    if (themes[themeValue]) {
      setCurrentTheme(themeValue);
    }
  };

  const value = {
    currentTheme,
    themes,
    switchTheme,
    isLoading,
    isDark: currentTheme === 'dark',
    isDive: currentTheme === 'dive',
    isLight: currentTheme === 'light'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;