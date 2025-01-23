import { NextRequest } from 'next/server';
import { setupSSEConnection } from '~/lib/sse-handler';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const connectionId = searchParams.get('connectionId');

    console.log('SSE Route - Received:', { projectId, connectionId });

    // Validate connection identifier
    const validConnectionId = (projectId || connectionId) as string;
    if (!validConnectionId) {
        return new Response(JSON.stringify({ error: 'Invalid connection identifier' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Create a stream for SSE
    const stream = new ReadableStream({
        start(controller) {
            const sendMessage = (data: object) => {
                controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
            };

            // Send initial connection message
            sendMessage({
                type: 'connected',
                connectionId: validConnectionId,
                message: 'SSE connection established'
            });

            // Store the stream controller for potential later use
            setupSSEConnection(validConnectionId, {
                write: (chunk) => controller.enqueue(chunk),
                end: () => controller.close()
            });
        }
    });

    // Return SSE response
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-open'
        }
    });
}