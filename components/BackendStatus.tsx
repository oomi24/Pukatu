import React, { useState, useEffect } from 'react';

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
    // This is a mock status for demonstration.
    // In a real app, this would be derived from API health checks.
    const [status, setStatus] = useState<Status>('connecting');

    useEffect(() => {
        const statuses: Status[] = ['connecting', 'connected', 'disconnected'];
        let currentIndex = 0;
        
        // Initial state
        setStatus('connecting');

        // After a moment, connect
        const connectTimer = setTimeout(() => {
             setStatus('connected');
        }, 2000);

        // This timer is just for demo purposes to show all states.
        // In a real implementation, you would remove this interval
        // and update status based on network events.
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % statuses.length;
            // For demo, let's just cycle between connected and disconnected after initial connection
            setStatus(prev => prev === 'connected' ? 'disconnected' : 'connected');
        }, 15000); // switch every 15 seconds

        return () => {
            clearTimeout(connectTimer);
            clearInterval(interval);
        };
    }, []);

    const currentStatus = statusConfig[status];

    return (
        <div className="flex items-center space-x-2" title={`Estado del servidor: ${currentStatus.text}`}>
            <div className="relative flex items-center justify-center w-3 h-3">
                <div className={`absolute w-3 h-3 ${currentStatus.color} rounded-full blur-sm ${currentStatus.shadow}`}></div>
                <div className={`w-2 h-2 ${currentStatus.color} rounded-full`}></div>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">{currentStatus.text}</span>
        </div>
    );
};

export default BackendStatus;
