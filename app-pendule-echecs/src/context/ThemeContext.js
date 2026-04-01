import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('theme').then(v => { if (v) setDark(v === 'dark'); });
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    AsyncStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const theme = {
    dark,
    bg:         dark ? '#111' : '#F5F5F5',
    card:       dark ? '#1E1E1E' : '#FFFFFF',
    text:       dark ? '#FFFFFF' : '#111111',
    subtext:    dark ? '#888' : '#666',
    active:     dark ? '#2A2A2A' : '#E8E8E8',
    activeText: dark ? '#FFFFFF' : '#111111',
    inactive:   dark ? '#161616' : '#D0D0D0',
    urgent:     '#E53935',
    accent:     '#1565C0',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);