// src/frontend/src/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define theme types
type ThemeName = 'green' | 'amber';

// Define theme interface
interface Theme {
  name: ThemeName;
  colors: {
    background: string;
    text: string;
    glow: string;
    scanline: string;
    staticNoise: string;
  };
  effects: {
    flicker: boolean;
    scanlines: boolean;
    staticNoise: boolean;
    glitches: boolean;
  };
}

// Define props for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

// Create context with default theme
const defaultTheme: Theme = {
  name: 'green',
  colors: {
    background: '#000',
    text: '#0f0',
    glow: '#0f0',
    scanline: 'rgba(0, 255, 0, 0.4)',
    staticNoise: 'rgba(0, 255, 0, 0.05)'
  },
  effects: {
    flicker: true,
    scanlines: true,
    staticNoise: true,
    glitches: false
  }
};

// Create the context
const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  toggleEffect: (effectName: keyof Theme['effects']) => void;
}>({
  theme: defaultTheme,
  toggleTheme: () => {},
  toggleEffect: (effectName: keyof Theme['effects']) => {}
});

// Provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Toggle between green and amber themes
  const toggleTheme = () => {
    const newThemeName: ThemeName = theme.name === 'green' ? 'amber' : 'green';
    
    const newTheme = {
      ...theme,
      name: newThemeName,
      colors: {
        ...theme.colors,
        background: newThemeName === 'green' ? '#000' : '#111',
        text: newThemeName === 'green' ? '#0f0' : '#ffbf00',
        glow: newThemeName === 'green' ? '#0f0' : '#ffbf00',
        scanline: newThemeName === 'green' ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 191, 0, 0.3)',
        staticNoise: newThemeName === 'green' ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 191, 0, 0.03)'
      }
    };
    
    setTheme(newTheme);
  };

  // Toggle specific effects
  const toggleEffect = (effectName: keyof Theme['effects']) => {
    setTheme({
      ...theme,
      effects: {
        ...theme.effects,
        [effectName]: !theme.effects[effectName]
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, toggleEffect }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);