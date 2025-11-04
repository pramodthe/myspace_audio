import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeConfig, ThemeName, themes } from './themes';

interface ThemeContextType {
  theme: ThemeConfig;
  themeName: ThemeName;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  theme?: ThemeName;
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  theme = 'retro', 
  children 
}) => {
  const themeConfig = themes[theme];
  
  const contextValue: ThemeContextType = {
    theme: themeConfig,
    themeName: theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for applying theme to a component
export const useThemeStyles = (themeName?: ThemeName) => {
  const currentTheme = themeName || 'retro';
  const themeConfig = themes[currentTheme];
  
  return {
    theme: themeConfig,
    themeName: currentTheme,
    getThemeDataAttribute: () => ({ 'data-theme': currentTheme }),
  };
};