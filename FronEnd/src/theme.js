/**
 * Theme configuration for the application
 * Simplified color palette inspired by the store landing page design
 */

// Base theme structure with default colors
const baseTheme = {
  colors: {
    // Main colors
    teal: {
      500: '#41A6B2', // Main teal/mint color for branding (from LANDING PAGE text)
      600: '#2D8894', // Darker teal for hover states
      700: '#1E6A76', // Even darker teal for active states
    },
    // Text colors
    text: {
      primary: '#333333', // Dark text for headings
      secondary: '#666666', // Medium gray for body text
      light: '#FFFFFF', // White text
    },
    // Background colors
    background: {
      light: '#FFFFFF', // White background
      card: '#F8F9FA', // Light gray for cards
    },
    // Accent colors
    accent: {
      mint: '#8FD3C9', // Light mint accent (jacket color)
      black: '#000000', // Black
      white: '#FFFFFF', // White
      pink: '#F5C0CF', // Pink accent from the gradient
      blue: '#C3D9F1', // Blue accent from the gradient
    }
  },
  
  // Gradients
  gradients: {
    // Exact match to the screenshot gradient - more vibrant
    pageBackground: 'linear-gradient(135deg, #C3D9F1 0%, #F5C0CF 100%)',
    // Slightly lighter version for card backgrounds
    cardBackground: 'linear-gradient(135deg, #E3F0F7 0%, #F7E3ED 100%)',
    // Additional gradients for UI elements
    buttonGradient: 'linear-gradient(to right, #41A6B2, #8FD3C9)',
    borderGradient: 'linear-gradient(to right, #41A6B2, #8FD3C9)',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.05)',
    card: '0 10px 30px rgba(0, 0, 0, 0.05)',
    button: '0 10px 25px -5px rgba(65, 166, 178, 0.3)',
    input: '0 4px 20px rgba(65, 166, 178, 0.2)',
  },
  
  // Typography
  typography: {
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Borders
  borders: {
    radius: {
      none: '0',
      sm: '0.25rem',     // 4px
      md: '0.5rem',      // 8px
      lg: '0.75rem',     // 12px
      xl: '1rem',        // 16px
      '2xl': '1.5rem',   // 24px
      full: '9999px',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px
  },
};

// Theme Presets
const themePresets = {
  'Blue-Pink': {
    name: 'Blue-Pink',
    primary: '#6366f1', // Indigo
    secondary: '#F5C0CF', // Pink
    accent: '#C3D9F1', // Light blue
    background: 'slate-900',
    text: 'white',
    gradient: 'from-blue-200 via-indigo-100 to-pink-200',
    cssVars: {
      '--primary-color': '#6366f1',
      '--secondary-color': '#F5C0CF',
      '--accent-color': '#C3D9F1',
      '--background-color': '#0f172a', // slate-900
      '--text-color': '#ffffff',
      '--nav-background': 'rgba(15, 23, 42, 0.8)', // slate-900/80
      '--card-background': 'rgba(30, 41, 59, 0.6)', // slate-800/60
      '--card-border': '#334155', // slate-700
    }
  },
  'Green-Teal': {
    name: 'Green-Teal',
    primary: '#10b981', // Emerald
    secondary: '#8FD3C9', // Teal
    accent: '#d1fae5', // Light green
    background: 'gray-900',
    text: 'white',
    gradient: 'from-teal-200 via-emerald-100 to-green-200',
    cssVars: {
      '--primary-color': '#10b981',
      '--secondary-color': '#8FD3C9',
      '--accent-color': '#d1fae5',
      '--background-color': '#111827', // gray-900
      '--text-color': '#ffffff',
      '--nav-background': 'rgba(17, 24, 39, 0.8)', // gray-900/80
      '--card-background': 'rgba(31, 41, 55, 0.6)', // gray-800/60
      '--card-border': '#374151', // gray-700
    }
  },
  'Purple-Pink': {
    name: 'Purple-Pink',
    primary: '#8b5cf6', // Violet
    secondary: '#F9A8D4', // Pink
    accent: '#D8B4FE', // Light purple
    background: 'gray-900',
    text: 'white',
    gradient: 'from-purple-200 via-fuchsia-100 to-pink-200',
    cssVars: {
      '--primary-color': '#8b5cf6',
      '--secondary-color': '#F9A8D4',
      '--accent-color': '#D8B4FE',
      '--background-color': '#111827', // gray-900
      '--text-color': '#ffffff',
      '--nav-background': 'rgba(17, 24, 39, 0.8)', // gray-900/80
      '--card-background': 'rgba(31, 41, 55, 0.6)', // gray-800/60
      '--card-border': '#374151', // gray-700
    }
  },
  'Orange-Yellow': {
    name: 'Orange-Yellow',
    primary: '#f97316', // Orange
    secondary: '#fcd34d', // Yellow
    accent: '#fdba74', // Light orange
    background: 'stone-900',
    text: 'white',
    gradient: 'from-orange-200 via-amber-100 to-yellow-200',
    cssVars: {
      '--primary-color': '#f97316',
      '--secondary-color': '#fcd34d',
      '--accent-color': '#fdba74',
      '--background-color': '#1c1917', // stone-900
      '--text-color': '#ffffff',
      '--nav-background': 'rgba(28, 25, 23, 0.8)', // stone-900/80
      '--card-background': 'rgba(41, 37, 36, 0.6)', // stone-800/60
      '--card-border': '#57534e', // stone-700
    }
  },
  'Blue-Purple': {
    name: 'Blue-Purple',
    primary: '#3b82f6', // Blue
    secondary: '#c4b5fd', // Lavender
    accent: '#93c5fd', // Light blue
    background: 'slate-900',
    text: 'white',
    gradient: 'from-blue-200 via-sky-100 to-purple-200',
    cssVars: {
      '--primary-color': '#3b82f6',
      '--secondary-color': '#c4b5fd',
      '--accent-color': '#93c5fd',
      '--background-color': '#0f172a', // slate-900
      '--text-color': '#ffffff',
      '--nav-background': 'rgba(15, 23, 42, 0.8)', // slate-900/80
      '--card-background': 'rgba(30, 41, 59, 0.6)', // slate-800/60
      '--card-border': '#334155', // slate-700
    }
  },
  'Dark': {
    name: 'Dark',
    primary: '#cbd5e1', // Slate-300
    secondary: '#94a3b8', // Slate-400
    accent: '#64748b', // Slate-500
    background: 'black',
    text: 'white',
    gradient: 'from-slate-800 via-slate-900 to-black',
    cssVars: {
      '--primary-color': '#cbd5e1',
      '--secondary-color': '#94a3b8',
      '--accent-color': '#64748b',
      '--background-color': '#000000',
      '--text-color': '#ffffff',
      '--nav-background': 'rgba(0, 0, 0, 0.8)',
      '--card-background': 'rgba(15, 23, 42, 0.6)', // slate-900/60
      '--card-border': '#1e293b', // slate-800
    }
  }
};

// Get CSS variables for a theme
const getThemeVariables = (themeName) => {
  const theme = themePresets[themeName] || themePresets['Blue-Pink']; // Default to Blue-Pink
  return theme.cssVars;
};

// Apply theme to document
const applyTheme = (themeName) => {
  const variables = getThemeVariables(themeName);
  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

// Export default theme and theme utilities
export default baseTheme;
export { themePresets, getThemeVariables, applyTheme }; 