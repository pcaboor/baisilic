import WebSocket, { WebSocketServer } from 'ws';

const PORT = 4000;
const wss = new WebSocketServer({ port: PORT });

interface LogMessage {
    timestamp: number;
    type: 'info' | 'success' | 'error';
    message: string;
}

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connecté');

    // Simulation de logs
    const logs: LogMessage[] = [
        { timestamp: Date.now(), type: 'info', message: 'Démarrage du processus...' },
        { timestamp: Date.now() + 1000, type: 'info', message: 'Création des fichiers...' },
        { timestamp: Date.now() + 2000, type: 'info', message: 'Initialisation des paramètres...' },
        { timestamp: Date.now() + 3000, type: 'success', message: 'Processus terminé avec succès !' },
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < logs.length) {
            ws.send(JSON.stringify(logs[i]));
            i++;
        } else {
            clearInterval(interval);
            ws.close();
        }
    }, 1000);

    ws.on('close', () => {
        console.log('Client déconnecté');
    });
});

console.log(`Serveur WebSocket démarré sur le port ${PORT}`);
