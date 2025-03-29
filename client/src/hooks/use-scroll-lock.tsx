import { useEffect } from "react";

interface ScrollLockOptions {
  enabled: boolean;
}

export function useScrollLock({ enabled }: ScrollLockOptions) {
  useEffect(() => {
    if (!enabled) return;
    
    const scrollY = window.scrollY;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.documentElement.style.scrollbarWidth = 'none';
    (document.documentElement.style as any)['-ms-overflow-style'] = 'none';
    document.documentElement.classList.add('no-scrollbar');

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.documentElement.style.scrollbarWidth = '';
      (document.documentElement.style as any)['-ms-overflow-style'] = '';
      document.documentElement.classList.remove('no-scrollbar');

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY.replace('px', '') || '0') * -1);
      }
    };
  }, [enabled]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);
}
