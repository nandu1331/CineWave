// frontend/my-app/src/hooks/useProfiles.js
import { useState, useEffect } from 'react';
import { djangoAxios } from '../axios';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const useProfiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                // Check if we have cached data
                const cachedData = localStorage.getItem('profilesCache');
                const cacheTimestamp = localStorage.getItem('profilesCacheTimestamp');
                const now = Date.now();

                if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp) < CACHE_DURATION)) {
                    // Use cached data if it's still valid
                    setProfiles(JSON.parse(cachedData));
                    setIsLoading(false);
                    return;
                }

                // Fetch fresh data if cache is invalid or missing
                const response = await djangoAxios.get('profiles/');
                setProfiles(response.data);
                
                const currentProfileId = localStorage.getItem('currentProfileId');
                if (!currentProfileId && response.data.length > 0) {
                    // Set first profile as default if none selected
                    localStorage.setItem('currentProfileId', response.data[0].id);
                }

                // Update cache
                localStorage.setItem('profilesCache', JSON.stringify(response.data));
                localStorage.setItem('profilesCacheTimestamp', now.toString());
            } catch (error) {
                setError(error);
                console.error('Error fetching profiles:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    // Function to force refresh profiles
    const refreshProfiles = async () => {
        setIsLoading(true);
        try {
            const response = await djangoAxios.get('profiles/');
            setProfiles(response.data);

            const currentProfileId = localStorage.getItem('currentProfileId');
            if (currentProfileId && !response.data.find(p => p.id === parseInt(currentProfileId))) {
                localStorage.setItem('currentProfileId', response.data[0]?.id || '');
            }
            
            // Update cache
            localStorage.setItem('profilesCache', JSON.stringify(response.data));
            localStorage.setItem('profilesCacheTimestamp', Date.now().toString());
        } catch (error) {
            setError(error);
            console.error('Error refreshing profiles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        profiles,
        isLoading,
        error,
        refreshProfiles
    };
};

export default useProfiles;
