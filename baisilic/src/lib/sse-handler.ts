import { randomBytes } from 'crypto';

// Basic stream-like interface
interface StreamWriter {
    write: (chunk: string) => void;
    end: () => void;
}

// Generate a unique SSE connection ID if no project ID is available
const connections: { [connectionId: string]: StreamWriter[] } = {};

export function setupSSEConnection(connectionId: string, res: StreamWriter) {
    if (!connections[connectionId]) {
        connections[connectionId] = [];
    }

    connections[connectionId].push(res);

    return connectionId;
}

export function broadcastProgress(connectionId: string, progress: number, projectId?: string) {
    if (connections[connectionId]) {
        connections[connectionId].forEach(res => {
            res.write(JSON.stringify({
                type: 'progress',
                progress,
                projectId
            }));
        });
    }
}

export function completeProjectPolling(connectionId: string, projectId?: string) {
    if (connections[connectionId]) {
        connections[connectionId].forEach(res => {
            res.write(JSON.stringify({
                type: 'complete',
                message: 'Commit polling completed',
                projectId
            }));
            res.end();
        });
        delete connections[connectionId];
    }
}