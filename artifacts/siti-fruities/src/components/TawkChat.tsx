import { useEffect } from 'react';
import { useLocation } from 'wouter';

const PROPERTY_ID = '6add80bf0f2c2c346f1ce414';
const WIDGET_ID = 'default';
const EMBED_URL = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;

declare global {
  interface Window {
    Tawk_API?: {
      customStyle?: {
        visibility?: {
          desktop?: { position: string; xOffset: number; yOffset: number };
          mobile?: { position: string; xOffset: number; yOffset: number };
        };
      };
    };
    Tawk_LoadStart?: Date;
  }
}

function TawkChat() {
  const [location] = useLocation();

  useEffect(() => {
    const pagePath = new URL(location, window.location.origin).pathname;
    if (pagePath.startsWith('/admin')) return;
    if (document.querySelector(`script[src="${EMBED_URL}"]`)) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.customStyle = {
      visibility: {
        desktop: { position: 'br', xOffset: 110, yOffset: 32 },
        mobile: { position: 'br', xOffset: 95, yOffset: 24 },
      },
    };
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.async = true;
    script.src = EMBED_URL;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
  }, [location]);

  return null;
}

export default TawkChat;
