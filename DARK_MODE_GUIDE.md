# Dark Mode Implementation Guide

## Overview
Dark mode has been successfully implemented across the entire project with smooth transitions and theme persistence.

## Features
- ✅ Automatic theme detection based on system preferences
- ✅ Manual theme toggle with persistent storage (localStorage)
- ✅ Smooth transitions between themes
- ✅ Theme toggle button in navbar (desktop & mobile)
- ✅ Optimized color palette for both light and dark modes

## Usage

### Toggle Theme
Users can toggle between light and dark mode by:
1. Clicking the sun/moon icon in the navbar (desktop)
2. Using the theme toggle in the mobile menu

### Theme Persistence
The selected theme is automatically saved to localStorage and will persist across sessions.

## Color Palette

### Light Mode
- Background: `hsl(0 0% 98%)` - Very light gray
- Foreground: `hsl(0 0% 17%)` - Dark gray text
- Card: `hsl(0 0% 100%)` - Pure white
- Primary: `hsl(28 95% 55%)` - Orange
- Border: `hsl(210 20% 90%)` - Light gray border

### Dark Mode
- Background: `hsl(222 47% 11%)` - Very dark blue-gray
- Foreground: `hsl(210 40% 98%)` - Almost white text
- Card: `hsl(222 47% 15%)` - Dark blue-gray
- Primary: `hsl(28 95% 55%)` - Orange (same as light)
- Border: `hsl(217 33% 20%)` - Dark border

## Components

### ThemeProvider (`src/hooks/useTheme.tsx`)
Manages theme state and provides context to the entire app.

### ThemeToggle (`src/components/ui/theme-toggle.tsx`)
Button component that toggles between light and dark themes.

### Usage in Components
```tsx
import { useTheme } from "@/hooks/useTheme";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      Current theme: {theme}
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## CSS Variables
All colors are defined as CSS variables in `src/index.css` and automatically switch based on the `.dark` class on the root element.

## Smooth Transitions
All theme-related properties (background-color, border-color, color) have smooth 200ms transitions for a polished user experience.
