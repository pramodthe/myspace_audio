export interface ThemeConfig {
  name: 'retro' | 'modern';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    border: string;
    buttonGradientStart: string;
    buttonGradientEnd: string;
    contentGradientStart: string;
    contentGradientEnd: string;
  };
  styles: {
    borderRadius: string;
    shadows: string;
    gradients: string[];
  };
}

export const retroTheme: ThemeConfig = {
  name: 'retro',
  colors: {
    primary: '#323232',
    secondary: '#fff',
    background: '#000',
    text: '#fff',
    accent: '#ff0c09',
    border: '#000',
    buttonGradientStart: '#fefefe',
    buttonGradientEnd: '#afafaf',
    contentGradientStart: '#fefefe',
    contentGradientEnd: '#afafaf',
  },
  styles: {
    borderRadius: '3px',
    shadows: 'none',
    gradients: [
      'linear-gradient(#fefefe,#afafaf)',
      'linear-gradient(#ff0c09,#ff0c09 9.09%,#323232 9.09%,#323232 13.63%,#fc3401 13.63%,#fc3401 18.18%,#323232 18.18%,#323232 22.72%,#ff5f11 22.72%,#ff5f11 31.81%,#323232 31.81%,#323232 36.36%,#bd7100 36.36%,#bd7100 40.90%,#323232 40.90%,#323232 45.45%,#d7b901 45.45%,#d7b901 54.54%,#323232 54.54%,#323232 59.09%,#dbdf1a 59.09%,#dbdf1a 63.63%,#323232 63.63%,#323232 68.18%,#d1d07e 68.18%,#d1d07e 77.27%,#323232 77.27%,#323232 81.81%,#92df66 81.81%,#92df66 86.36%,#323232 86.36%,#323232 90.90%,#0a8507 90.90%,#0a8507)',
      'linear-gradient(to right,#323232,#323232 20%,#fff 20%,#fff 80%,#323232 80%,#323232)'
    ]
  }
};

export const modernTheme: ThemeConfig = {
  name: 'modern',
  colors: {
    primary: '#2563eb',
    secondary: '#f8fafc',
    background: '#1e293b',
    text: '#f1f5f9',
    accent: '#3b82f6',
    border: '#475569',
    buttonGradientStart: '#f8fafc',
    buttonGradientEnd: '#e2e8f0',
    contentGradientStart: '#f8fafc',
    contentGradientEnd: '#e2e8f0',
  },
  styles: {
    borderRadius: '8px',
    shadows: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    gradients: [
      'linear-gradient(135deg, #f8fafc, #e2e8f0)',
      'linear-gradient(to top, #3b82f6 0%, #60a5fa 20%, #93c5fd 40%, #dbeafe 60%, #f0f9ff 80%, #f8fafc 100%)',
      'linear-gradient(to right, #475569, #475569 20%, #f1f5f9 20%, #f1f5f9 80%, #475569 80%, #475569)'
    ]
  }
};

export const themes = {
  retro: retroTheme,
  modern: modernTheme,
} as const;

export type ThemeName = keyof typeof themes;