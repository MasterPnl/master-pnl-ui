import {useState, useEffect} from 'react';

function useLocalStorageListener(key) {
    const [storedValue, setStoredValue] = useState(() => {
        const value = localStorage.getItem(key);
        return value ? value : null;
    });

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key) {
                setStoredValue(event.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return storedValue;
}

export default useLocalStorageListener;
