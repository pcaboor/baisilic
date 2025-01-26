'use client'
import React, { useState, useEffect } from 'react';

interface LogMessage {
    timestamp: number;
    type: 'info' | 'success' | 'error';
    message: string;
}

const RealTimeLogs: React.FC = () => {
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [status, setStatus] = useState<string>('En attente de connexion...');

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');

        ws.onopen = () => {
            setStatus('Connecté au serveur');
        };

        ws.onmessage = (event) => {
            try {
                const log: LogMessage = JSON.parse(event.data);
                setLogs((prevLogs) => [...prevLogs, log]);
            } catch (error) {
                console.error('Erreur lors du parsing du log :', error);
            }
        };

        ws.onclose = () => {
            setStatus('Connexion terminée');
        };

        ws.onerror = (error) => {
            console.error('Erreur WebSocket :', error);
            setStatus('Erreur de connexion');
        };

        return () => {
            ws.close();
        };
    }, []);

    const formatTimestamp = (timestamp: number): string => {
        const date = new Date(timestamp);
        return `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`;
    };

    return (
        <div className="p-4 border rounded-md shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Logs en temps réel</h2>
            <div className="mb-2 text-gray-600">{status}</div>
            <ul className="text-sm bg-gray-100 p-4 rounded-md h-48 overflow-y-auto">
                {logs.map((log, index) => (
                    <li
                        key={index}
                        className={`mb-1 ${log.type === 'success' ? 'text-green-600' : log.type === 'error' ? 'text-red-600' : 'text-gray-800'
                            }`}
                    >
                        <span className="block text-xs text-gray-500">{formatTimestamp(log.timestamp)}</span>
                        {log.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RealTimeLogs;
