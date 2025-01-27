import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

const LogTerminal = ({ projectId }) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const bottomRef = useRef(null);

    useEffect(() => {
        const eventSource = new EventSource(`/api/logs/${projectId}`);

        eventSource.onmessage = (event) => {
            const newLog = JSON.parse(event.data);
            setLogs(prevLogs => [...prevLogs, newLog]);
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
            setIsLoading(false);
        };

        return () => {
            eventSource.close();
        };
    }, [projectId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                    Terminal Output
                    {/* {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} */}
                </CardTitle>
                <CardTitle className='text-xs text-emerald-900 font-normal'>
                    Veuillez ne pas fermer cette page durant le process s'il vous plaît
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className=" rounded-lg h-96 overflow-y-auto text-sm">
                    <div className="space-y-3">
                        {logs.map((log, index) => (
                            <div
                                key={index}
                            >
                                {log.message}
                            </div>
                        ))}

                        <div ref={bottomRef} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LogTerminal;