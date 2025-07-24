import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Luminance calculation utilities
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrastRatio = (color1, color2) => {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

const isLightColor = (color) => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  if (!rgb) return false;
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.18;
};

const themes = {
  light: {
    name: 'Daylight Mode',
    value: 'light',
    icon: 'Sun',
    description: 'Clean and bright interface',
    textColors: {
      primary: '#1f2937',      // gray-800
      secondary: '#4b5563',    // gray-600
      muted: '#6b7280',        // gray-500
      inverse: '#ffffff',      // white
      accent: '#03A6A1',       // primary-500
      danger: '#dc2626',       // red-600
      success: '#059669',      // emerald-600
      warning: '#d97706'       // amber-600
    }
  },
  dark: {
    name: 'Dark Mode', 
    value: 'dark',
    icon: 'Moon',
    description: 'Easy on the eyes',
    textColors: {
      primary: '#f9fafb',      // gray-50
      secondary: '#d1d5db',    // gray-300
      muted: '#9ca3af',        // gray-400
      inverse: '#111827',      // gray-900
      accent: '#60a5fa',       // blue-400
      danger: '#f87171',       // red-400
      success: '#34d399',      // emerald-400
      warning: '#fbbf24'       // amber-400
    }
  },
  dive: {
    name: 'Dive Mode',
    value: 'dive', 
    icon: 'Waves',
    description: 'Ocean-inspired depths',
    textColors: {
      primary: '#e0f2fe',      // sky-100
      secondary: '#bae6fd',    // sky-200
      muted: '#7dd3fc',        // sky-300
      inverse: '#0c4a6e',      // sky-900
      accent: '#38bdf8',       // sky-400
      danger: '#fca5a5',       // red-300
      success: '#6ee7b7',      // emerald-300
      warning: '#fcd34d'       // amber-300
    }
  },
  sunset: {
    name: 'Sunset Mode',
    value: 'sunset',
    icon: 'Sunset',
    description: 'Warm sunset colors',
    textColors: {
      primary: '#92400e',      // amber-800
      secondary: '#b45309',    // amber-700
      muted: '#d97706',        // amber-600
      inverse: '#fef3c7',      // amber-100
      accent: '#799EFF',       // sunset-500
      danger: '#dc2626',       // red-600
      success: '#059669',      // emerald-600
      warning: '#b45309'       // amber-700
    }
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

// Text color selection functions
  const getTextColor = (backgroundHex, colorType = 'primary') => {
    const theme = themes[currentTheme];
    if (!theme) return theme.textColors.primary;
    
    if (!backgroundHex) {
      return theme.textColors[colorType] || theme.textColors.primary;
    }
    
    const bgRgb = hexToRgb(backgroundHex);
    if (!bgRgb) return theme.textColors[colorType] || theme.textColors.primary;
    
    const isLight = isLightColor(bgRgb);
    
    // For light backgrounds, use dark text colors
    // For dark backgrounds, use light text colors
    if (isLight) {
      return currentTheme === 'light' || currentTheme === 'sunset' 
        ? theme.textColors[colorType] || theme.textColors.primary
        : themes.light.textColors[colorType] || themes.light.textColors.primary;
    } else {
      return currentTheme === 'dark' || currentTheme === 'dive'
        ? theme.textColors[colorType] || theme.textColors.primary
        : themes.dark.textColors[colorType] || themes.dark.textColors.primary;
    }
  };
  
  const getContrastingTextColor = (backgroundHex) => {
    if (!backgroundHex) return themes[currentTheme].textColors.primary;
    
    const bgRgb = hexToRgb(backgroundHex);
    if (!bgRgb) return themes[currentTheme].textColors.primary;
    
    const lightText = hexToRgb('#ffffff');
    const darkText = hexToRgb('#1f2937');
    
    const lightContrast = getContrastRatio(bgRgb, lightText);
    const darkContrast = getContrastRatio(bgRgb, darkText);
    
    // Return the color with better contrast, ensuring minimum 4.5:1 ratio
    if (lightContrast >= 4.5 && lightContrast > darkContrast) {
      return '#ffffff';
    } else if (darkContrast >= 4.5) {
      return '#1f2937';
    } else {
      // Fallback to theme-appropriate color
      return isLightColor(bgRgb) ? '#1f2937' : '#ffffff';
    }
  };

  const value = {
    currentTheme,
    themes,
    switchTheme,
    isLoading,
    isDark: currentTheme === 'dark',
    isDive: currentTheme === 'dive',
    isLight: currentTheme === 'light',
    isSunset: currentTheme === 'sunset',
    getTextColor,
    getContrastingTextColor,
    textColors: themes[currentTheme]?.textColors || themes.light.textColors
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