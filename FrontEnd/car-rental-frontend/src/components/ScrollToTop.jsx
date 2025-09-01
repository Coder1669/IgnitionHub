import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will automatically scroll the page to the top on any route change.
const ScrollToTop = () => {
  // Extracts the pathname property from the current location object
  const { pathname } = useLocation();

  // This useEffect hook will run every time the pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // The effect depends on the pathname

  // This component does not render any visible UI
  return null; 
};

export default ScrollToTop;