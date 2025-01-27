// import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';

import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { NomicEmbeddings } from "@langchain/nomic";

// import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { RateLimiter } from 'limiter';
import { Document } from "@langchain/core/documents"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'

})

// const embModel = new HuggingFaceTransformersEmbeddings({
//     model: "Xenova/all-MiniLM-L6-v2",
// });
const nomicEmbeddings = new NomicEmbeddings();

// Create a rate limiter to allow 1 request per 1 seconds
const limiter = new RateLimiter({
    tokensPerInterval: 1,
    interval: 5000,
});

export const aiSummariseCommit = async (diff: string) => {

    await limiter.removeTokens(1);
    // retryWithBackoff(() =>
    try {
        const response = await
            model.generateContent([
                `
                You are an expert programmer, and you trying to summarize a git diff.
                Reminders about the git diff format:
                - Each commit is a new line starting with "+" or "-"
                - "+" indicates an addition
                - "-" indicates a deletion
                For every file, there are a few metadata lines, like (for example):
                \`\`\`
                diff --git a/file.txt b/file.txt
                --- a/file.txt
                +++ b/file.txt
                 \`\`\`
                 This means that \`a/file.txt\` was modified in this commit. Note that is only an example.
                 Then there is a specifier of the lines that were modified.
                 A line starting with \`+\` means if was added.
                 A line starting with \`-\` means if was deleted.
                 A line that starts with neither \`+\` or \`-\` is code given for context and better understanding.
                 It is not part of the diff.
                 [...]
                 EXAMPLE SUMMARY COMMENTS:
                 \`\`\`
                 - Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts]. [package/server/constants.ts]
                 - Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
                 - Moved the \`octokit\` initialization to a separete file [src/octokit.ts]. [src/index.ts]
                 - Added an OpenAI API for completions [packages/utils/apis/openai.ts]
                 - Lowered numeric tolerance for test files
                 \`\`\`
                Most commits will have less comments than this examples list.
                The last comment does not include the file names,
                because there were more than two relevant fils int the hypothetical commit.
                Do not include parts of the example in your summary.
                It is given only as an example of appropriate comments.
                `,
                `Please summarise the following diff file: \n\n${diff}`,
            ]);

        return response.response.text();
    } catch (error) {
        console.error('TROP DE REQUEST');

        console.error('Gemini API Error:', error);
        throw error;
    }
}


export async function summariseCode(doc: Document) {
    await limiter.removeTokens(1);
    try {
        console.log('%cAnalyse de fichier', 'color: blue; font-weight: bold;', doc.metadata.source);
        const code = doc.pageContent.slice(0, 10000);
        const response = await model.generateContent([
            `You are an intelligent senior software engineer who specialises in onboarding junior software engineers on to projects`,
            `You are onboarding a junior software engineer and explaining to them ther purpose to the ${doc.metadata.source} file`,
            `Here is the code:
        ---
        ${code} 
        ---
            Give a summary no more than 100 words of the code above`,
        ]);

        return response.response.text();
    } catch (error) {
        console.error("Error while summarising code:", error);
        throw new Error("Failed to summarise the code.");
    }
}

export async function generateEmbedding(summary: string) {
    try {
        // Vérification du format de l'input


        // Utiliser l'instance d'OllamaEmbeddings pour générer un embedding
        const result = await nomicEmbeddings.embedQuery(summary);
        console.log("Génération de l'embedding pour : ", summary);

        if (result) {
            return result;
        } else {
            throw new Error("Aucun embedding trouvé dans la réponse");
        }
    } catch (error) {
        console.error("Erreur dans generateEmbedding:", error);
        throw new Error("Échec de la génération de l'embedding");
    }
}

// export async function generateEmbedding(summary: string) {
//     const model = genAI.getGenerativeModel({
//         model: 'text-embedding-004'
//     })
//     const result = await model.embedContent(summary)
//     const embedding = result.embedding
//     return embedding.values;
// }

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// async function retryWithBackoff<T>(
//     fn: () => Promise<T>,
//     retries: number = 3,
//     delayMs: number = 1000
// ): Promise<T> {
//     for (let attempt = 0; attempt < retries; attempt++) {
//         try {
//             return await fn();
//         } catch (error: any) {
//             if (error.response?.status === 429 && attempt < retries - 1) {
//                 console.warn(`Rate limit hit. Retrying in ${delayMs}ms...`);
//                 await delay(delayMs);
//                 delayMs *= 2; // Backoff exponentiel
//             } else {
//                 throw error;
//             }
//         }
//     }
//     throw new Error("Max retries exceeded");
// }
