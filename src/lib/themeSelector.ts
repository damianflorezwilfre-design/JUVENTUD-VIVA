export type ThemeName = 'navidad' | 'halloween' | 'amor-amistad' | 'colombia' | 'cumpleanos' | 'aniversario' | 'dia-mujer' | 'dia-juventud' | 'dia-nino' | 'dia-padre' | 'default';

export interface ThemeConfig {
  id: ThemeName;
  icon?: string; // Emoji to display over logo
  color?: string; // Primary accent color or glow
}

const THEMES: Record<ThemeName, ThemeConfig> = {
  'navidad': { id: 'navidad', icon: '🎅', color: 'rgba(239, 68, 68, 0.4)' },
  'halloween': { id: 'halloween', icon: '🎃', color: 'rgba(249, 115, 22, 0.4)' },
  'amor-amistad': { id: 'amor-amistad', icon: '💘', color: 'rgba(236, 72, 153, 0.4)' },
  'colombia': { id: 'colombia', icon: '⚽', color: 'rgba(234, 179, 8, 0.4)' },
  'cumpleanos': { id: 'cumpleanos', icon: '🎂', color: 'rgba(56, 189, 248, 0.4)' },
  'aniversario': { id: 'aniversario', icon: '🥳', color: 'rgba(250, 204, 21, 0.4)' },
  'dia-mujer': { id: 'dia-mujer', icon: '👩', color: 'rgba(168, 85, 247, 0.4)' },
  'dia-juventud': { id: 'dia-juventud', icon: '🛹', color: 'rgba(16, 185, 129, 0.4)' },
  'dia-nino': { id: 'dia-nino', icon: '🪁', color: 'rgba(244, 63, 94, 0.4)' },
  'dia-padre': { id: 'dia-padre', icon: '👔', color: 'rgba(59, 130, 246, 0.4)' },
  'default': { id: 'default' }
};

export function getCurrentTheme(override?: string | null): ThemeConfig {
  if (override && override !== 'auto' && THEMES[override as ThemeName]) {
    return THEMES[override as ThemeName];
  }

  const now = new Date();
  const month = now.getMonth(); // 0-11
  const date = now.getDate();

  // Navidad: Dec 1 to Jan 6
  if (month === 11 || (month === 0 && date <= 6)) {
    return THEMES['navidad'];
  }
  
  // Halloween: Oct 20 to Oct 31
  if (month === 9 && date >= 20) {
    return THEMES['halloween'];
  }
  
  // Amor y Amistad: September (All month)
  if (month === 8) {
    return THEMES['amor-amistad'];
  }

  // Mundial / Copa America / Independencia: June 1 to July 25
  if (month === 5 || (month === 6 && date <= 25)) {
    return THEMES['colombia'];
  }

  return THEMES['default'];
}
