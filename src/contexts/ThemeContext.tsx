/**
 * Theme Context for managing app theming
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme } from '@/types';
import { UI_CONSTANTS } from '@/config/constants';

const lightTheme: Theme = {
  colors: {
    primary: UI_CONSTANTS.COLORS.PRIMARY,
    secondary: UI_CONSTANTS.COLORS.SECONDARY,
    background: UI_CONSTANTS.COLORS.BACKGROUND_LIGHT,
    surface: UI_CONSTANTS.COLORS.WHITE,
    text: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    textSecondary: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    border: UI_CONSTANTS.COLORS.BORDER,
    error: UI_CONSTANTS.COLORS.DANGER,
    success: UI_CONSTANTS.COLORS.SUCCESS,
    warning: UI_CONSTANTS.COLORS.WARNING,
  },
  spacing: UI_CONSTANTS.SPACING,
  typography: {
    hero: UI_CONSTANTS.FONT_SIZES.HERO,
    display: UI_CONSTANTS.FONT_SIZES.DISPLAY,
    header: UI_CONSTANTS.FONT_SIZES.HEADER,
    title: UI_CONSTANTS.FONT_SIZES.LG,
    body: UI_CONSTANTS.FONT_SIZES.BODY,
    bodyLarge: UI_CONSTANTS.FONT_SIZES.MD,
    button: UI_CONSTANTS.FONT_SIZES.BUTTON,
    caption: UI_CONSTANTS.FONT_SIZES.SM,
    small: UI_CONSTANTS.FONT_SIZES.XS,
  },
};

const darkTheme: Theme = {
  colors: {
    primary: UI_CONSTANTS.COLORS.PRIMARY, // Keep same blue for consistency
    secondary: UI_CONSTANTS.COLORS.SECONDARY, // Keep same pink/red
    background: UI_CONSTANTS.COLORS.BACKGROUND_DARK, // Deep navy background
    surface: '#1E293B', // Dark surface for cards/panels
    text: '#F7FAFC', // Very light text
    textSecondary: '#94A3B8', // Muted light text
    border: '#334155', // Dark border
    error: UI_CONSTANTS.COLORS.DANGER, // Same red for consistency
    success: UI_CONSTANTS.COLORS.SUCCESS, // Same green for consistency
    warning: UI_CONSTANTS.COLORS.WARNING, // Same yellow for consistency
  },
  spacing: UI_CONSTANTS.SPACING,
  typography: {
    hero: UI_CONSTANTS.FONT_SIZES.HERO,
    display: UI_CONSTANTS.FONT_SIZES.DISPLAY,
    header: UI_CONSTANTS.FONT_SIZES.HEADER,
    title: UI_CONSTANTS.FONT_SIZES.LG,
    body: UI_CONSTANTS.FONT_SIZES.BODY,
    bodyLarge: UI_CONSTANTS.FONT_SIZES.MD,
    button: UI_CONSTANTS.FONT_SIZES.BUTTON,
    caption: UI_CONSTANTS.FONT_SIZES.SM,
    small: UI_CONSTANTS.FONT_SIZES.XS,
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
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
