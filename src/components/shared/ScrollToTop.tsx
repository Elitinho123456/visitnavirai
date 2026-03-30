import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Enforce scroll to top immediately and after a short delay
        // to handle any dynamic content reflows
        window.scrollTo(0, 0);
        const timeout = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        
        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
}
