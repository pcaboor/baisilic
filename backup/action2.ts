'use server'

import { ollama, streamText } from 'modelfusion'
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateEmbedding } from '~/lib/gemini'
import { db } from '~/server/db'
import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";


// const google = createGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
// })


export async function askQuestion(question: string, projectId: string) {
    const stream = createStreamableValue()

    const queryVector = await generateEmbedding(question)
    const vectorQuery = `[${queryVector.join(',')}]`

    const result = await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 5
    ` as {
        fileName: string; sourceCode: string; summary: string
    }[]
    let context = ''

    for (const doc of result) {
        context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n `
    }
    (async () => {
        const textStream = await streamText({
            model: ollama.ChatTextGenerator({ model: "llama3.2" }).withChatPrompt(),
            prompt: {
                messages: [
                    {
                        role: 'assistant',
                        content: `
            You are an AI assistant who answers questions about the codebase. Your target audience ia technical intern developers
            AI assistant is a brand new, powerful AI assistant, human-like artificial intelligence.
            The traits of AI include expert knowledge, helpfulness, cleverness and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is a always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in IT.
            If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instructions.
            START CONTEXT BLOCK
            ${context}
            END CONTEXT BLOCK

            START QUESTION
            ${question}
            END QUESTION
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer"
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, make sure there is
            comprehensive coverage of the topic. Ensure examples are clear, accurate, and directly applicable. When providing explanations, include step-by-step reasoning, potential pitfalls, and best practices. 
            Additionally:
            Use clear headings and subheadings to organize information.
            Highlight important concepts using bold text or blockquotes.
            Include references to official documentation or trusted sources where applicable.
            Use examples that are easy to understand and practical for users to follow.
            If there are multiple solutions, compare their pros and cons to help users choose the best
            `

                    },
                    {
                        role: 'user',
                        content: question
                    }
                ]

            }
        });
        console.log(question)
        console.log(textStream)


        for await (const delta of textStream) {
            stream.update(delta)
        }

        stream.done();
    })()



    return {
        output: stream.value,
        filesReferences: result
    }
}