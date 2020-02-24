import { createContext } from 'react';

export const ThemeContext = createContext({
  isDarkTheme: true,
  toggleTheme: () => {},
});

// this is really ugly
export const DataContext = createContext({
  maxCategories: 0,
  setMaxCategories: () => {},
});
