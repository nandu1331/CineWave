// DelayedRender.js
import React, { useEffect, useState } from 'react';

const DelayedRender = ({ delay, children }) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldRender(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return shouldRender ? children : null;
};

export default DelayedRender;