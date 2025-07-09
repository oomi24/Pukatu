import React, { useState, useEffect } from 'react';
import pb from '../core/pocketbase';

type Status = 'connected' | 'connecting' | 'disconnected';

const statusConfig = {
    connected: {
        text: 'Conectado',
        color: 'bg-green-500',
        shadow: 'shadow-green-500/50',
    },
    connecting: {
        text: 'Conectando...',
        color: 'bg-yellow-500',
        shadow: 'shadow-yellow-500/50',
    },
    disconnected: {
        text: 'Desconectado',
        color: 'bg-red-500',
        shadow: 'shadow-red-500/50',
    },
};

const BackendStatus: React.FC = () => {
    const [status, setStatus] = useState<Status>('connecting');

    useEffect(() => {
        let isMounted = true;

        const checkConnection = async () => {
            if (!isMounted) return;
            // Don't change state if it's already connecting, prevents flashing
            if (status !== 'connecting') {
                setStatus('connecting');
            }
            
            try {
                // Attempt a lightweight API call to check the connection health.
                await pb.health.check();
                if (isMounted) setStatus('connected');
            } catch (error) {
                console.error('Backend connection check failed:', error);
                if (isMounted) setStatus('disconnected');
            }
        };

        // Initial check
        checkConnection();

        // Periodically check the connection
        const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    const currentStatus = statusConfig[status];

    return (
        <div className="flex items-center space-x-2" title={`Estado del backend: ${currentStatus.text}`}>
            <div className="relative flex items-center justify-center w-3 h-3">
                {status === 'connecting' && <div className={`absolute w-3 h-3 ${currentStatus.color} rounded-full animate-ping`}></div>}
                <div className={`absolute w-3 h-3 ${currentStatus.color} rounded-full blur-sm ${currentStatus.shadow}`}></div>
                <div className={`w-2 h-2 ${currentStatus.color} rounded-full`}></div>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">{currentStatus.text}</span>
        </div>
    );
};

export default BackendStatus;