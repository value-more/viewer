import { useState, useEffect } from 'react'

const useMediaQuery = (query: string) => { 
    const [matches, setMatches] = useState(false);

    useEffect(() => { 
        const media = window.matchMedia(query); 
        if (media.matches !== matches) { 
            setMatches(media.matches); 
        }

        const listener = () => {
            setMatches(media.matches);
        };
    
        media.addEventListener('change', listener);
    
        return () => {
            media.removeEventListener('change', listener);
        };
    }, [matches, query]);

    return matches; 
}

export const useIsSmall = () => useMediaQuery(`(min-width: 576px)`); 
export const useIsMedium = () => useMediaQuery(`(min-width: 768px)`); 
export const useIsLarge = () => useMediaQuery(`(min-width: 992px)`); 
export const useIsXLarge = () => useMediaQuery(`(min-width: 1200px)`);
export const useIsXXLarge = () => useMediaQuery(`(min-width: 1440px)`);