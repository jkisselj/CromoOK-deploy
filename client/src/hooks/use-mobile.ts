import { useState, useEffect } from "react";

const BREAKPOINTS = {
  mobile: 640,  // sm
  tablet: 768,  // md
  laptop: 1024, // lg
  desktop: 1280 // xl
};

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.tablet);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false
  });

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      setBreakpoint({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.laptop,
        isLaptop: width >= BREAKPOINTS.laptop && width < BREAKPOINTS.desktop,
        isDesktop: width >= BREAKPOINTS.desktop
      });
    };

    checkBreakpoint();

    window.addEventListener("resize", checkBreakpoint);

    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return breakpoint;
}

export function useIsMobile() {
  return useMobile();
}
