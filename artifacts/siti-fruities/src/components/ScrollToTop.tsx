import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop — resets the window scroll position to the top of the page
 * every time the Wouter route location changes. Rendered once inside the
 * WouterRouter so it covers all route transitions.
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);

  return null;
}
