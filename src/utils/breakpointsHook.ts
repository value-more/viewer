import { useState, useEffect } from 'react';

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);

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
};

export const useIsSmallScreen = () => useMediaQuery(`(min-width: 576px)`);
export const useIsMediumScreen = () => useMediaQuery(`(min-width: 768px)`);
export const useIsLargeScreen = () => useMediaQuery(`(min-width: 992px)`);
export const useIsXLargeScreen = () => useMediaQuery(`(min-width: 1200px)`);
export const useIsXXLargeScreen = () => useMediaQuery(`(min-width: 1440px)`);
