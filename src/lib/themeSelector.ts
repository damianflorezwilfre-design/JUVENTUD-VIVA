export type ThemeName = 'navidad' | 'halloween' | 'amor-amistad' | 'colombia' | 'default';

export interface ThemeConfig {
  id: ThemeName;
  icon?: string; // Emoji to display over logo
  color?: string; // Primary accent color or glow
}

const THEMES: Record<ThemeName, ThemeConfig> = {
  'navidad': {
    id: 'navidad',
    icon: '🎅',
    color: 'rgba(239, 68, 68, 0.4)' // Red glow
  },
  'halloween': {
    id: 'halloween',
    icon: '🎃',
    color: 'rgba(249, 115, 22, 0.4)' // Orange glow
  },
  'amor-amistad': {
    id: 'amor-amistad',
    icon: '💘',
    color: 'rgba(236, 72, 153, 0.4)' // Pink glow
  },
  'colombia': {
    id: 'colombia',
    icon: '⚽',
    color: 'rgba(234, 179, 8, 0.4)' // Yellow glow
  },
  'default': {
    id: 'default'
  }
};

export function getCurrentTheme(): ThemeConfig {
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
