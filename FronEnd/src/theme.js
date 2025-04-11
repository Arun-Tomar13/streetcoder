/**
 * Theme configuration for the application
 * Simplified color palette inspired by the store landing page design
 */

const theme = {
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

export default theme; 