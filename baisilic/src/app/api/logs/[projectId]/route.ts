// // app/api/logs/[projectId]/route.ts
// import { NextResponse } from 'next/server';

// export async function GET(
//     request: Request,
//     { params }: { params: { projectId: string } }
// ) {
//     const encoder = new TextEncoder();
//     const stream = new TransformStream();
//     const writer = stream.writable.getWriter();

//     // Fonction pour envoyer un log

//     const sendLog = async (type: string, message: string) => {
//         await writer.write(
//             encoder.encode(`data: ${JSON.stringify({ type, message })}\n\n`)
//         );
//     };

//     // Exemple d'utilisation dans votre code existant
//     const originalConsoleLog = console.log;
//     // Exemple d'utilisation
//     console.log = async (...args) => {
//         const type = 'info';  // Vous pouvez ajouter une logique pour déterminer le type ici
//         originalConsoleLog.apply(console, args);
//         await sendLog(type, args.join(' '));
//     };


//     return new NextResponse(stream.readable, {
//         headers: {
//             'Content-Type': 'text/event-stream',
//             'Cache-Control': 'no-cache',
//             'Connection': 'keep-alive',
//         },
//     });
// }