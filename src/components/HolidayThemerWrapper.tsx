"use client"

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Lazy load the heavy animations library so it doesn't block the rest of the site or slow down other pages
const HolidayThemer = dynamic(() => import('./HolidayThemer'), { ssr: false });

export default function HolidayThemerWrapper({ themeOverride }: { themeOverride?: string | null }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render and load the script on the root homepage
  if (!mounted || pathname !== '/') {
    return null;
  }

  return <HolidayThemer themeOverride={themeOverride} />;
}
