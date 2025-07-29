// Theme configuration for the chat application
// For use with Tailwind CSS

export const themeConfig = {
    colors: {
      primary: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
      },
      secondary: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
      },
      success: {
        light: '#D1FAE5',
        main: '#10B981',
        dark: '#065F46',
      },
      warning: {
        light: '#FEF3C7',
        main: '#F59E0B',
        dark: '#92400E',
      },
      error: {
        light: '#FEE2E2',
        main: '#EF4444',
        dark: '#991B1B',
      },
      info: {
        light: '#DBEAFE',
        main: '#3B82F6',
        dark: '#1E40AF',
      },
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    animations: {
      fadeIn: 'fadeIn 0.3s ease-in-out',
      slideIn: 'slideIn 0.3s ease-in-out',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    transitions: {
      fast: '150ms',
      default: '300ms',
      slow: '500ms',
    },
  };
  
  // Animation keyframes (for reference when adding to global CSS)
  export const animationKeyframes = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
  `;
  
  // Helper function to get color from theme
  export const getColor = (colorPath: string): string => {
    const parts = colorPath.split('.');
    let result: any = themeConfig;
    
    for (const part of parts) {
      if (result[part] === undefined) {
        return '';
      }
      result = result[part];
    }
    
    return typeof result === 'string' ? result : '';
  };