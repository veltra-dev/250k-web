"use client";

import { useState, useEffect } from "react";

/**
 * Tailwind classes for floating elements that appear after hero half scroll.
 * Use with transition-all duration-300 for show/hide animation.
 */
export function getFloatingVisibilityClassName(visible: boolean): string {
  return visible
    ? "translate-y-0 opacity-100 pointer-events-auto"
    : "translate-y-4 opacity-0 pointer-events-none";
}

/**
 * Returns true when the user has scrolled past half of the hero section height.
 * If no hero (e.g. other pages), returns true so floating elements show by default.
 */
export function useShowAfterHeroHalf(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const hero = document.querySelector("[data-hero]");
      if (!hero) {
        setVisible(true);
        return;
      }
      const heroHeight = hero.getBoundingClientRect().height;
      const threshold = heroHeight / 4;
      setVisible(window.scrollY >= threshold);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    const hero = document.querySelector("[data-hero]");
    const resizeObserver = hero
      ? new ResizeObserver(updateVisibility)
      : undefined;
    if (hero) resizeObserver?.observe(hero);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      resizeObserver?.disconnect();
    };
  }, []);

  return visible;
}
