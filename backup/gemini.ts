// import { GoogleGenerativeAI } from "@google/generative-ai"
import { RateLimiter } from 'limiter';
import { Document } from "@langchain/core/documents"
import axios from "axios";
import { ChatOllama, Ollama, OllamaEmbeddings } from "@langchain/ollama";


const ollama = new ChatOllama({
    model: "llama3.2",
    temperature: 0,
    baseUrl: 'http://localhost:11434',
})

const embeddings = new OllamaEmbeddings(
    {
        model: "mxbai-embed-large", // Default value
        baseUrl: "http://localhost:11434", // Default value
    })

// Create a rate limiter to allow 1 request per 1 seconds
const limiter = new RateLimiter({
    tokensPerInterval: 1,
    interval: 1000,
});

export const aiSummariseCommit = async (diff: string, progressCallback?: (progress: number) => void) => {

    console.log("== aiSummariseCommit DONE ! ==")

    //await limiter.removeTokens(1);
    try {

        const prompt = `
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
       Please summarise the following diff file: \n\n${diff},
       `
        const response = await ollama.invoke(prompt);

        console.log("== Response DONE ! ==", response)

        // if (progressCallback) {
        //     progressCallback(1);
        // }

        return response;
    } catch (error) {
        console.error('Ollama API Error:', error);
        throw error;
    }

}


export async function summariseCode(doc: Document) {
    console.log("getting summary for", doc.metadata.source);
    const code = doc.pageContent.slice(0, 10000);

    console.log("== Code DONE ! ==", code)

    const prompt = `
    You are an intelligent senior software engineer who specialises in onboarding junior software engineers on to projects
    You are onboarding a junior software engineer and explaining to them ther purpose to the ${doc.metadata.source} file,
    Here is the code:
    ---
    ${code} 
    ---
    Give a summary no more than 100 words of the code above`
    const response = await ollama.invoke(prompt);

    console.log("== Response Summarised DONE ! ==", response)

    return response;
}

// export async function generateEmbedding(summary: string) {
//     const model = genAI.getGenerativeModel({
//         model: 'text-embedding-004'
//     })
//     const result = await model.embedContent(summary)
//     const embedding = result.embedding
//     return embedding.values;
// }

export async function generateEmbedding(summary: string) {
    try {
        // Vérification du format de l'input
        console.log("Génération de l'embedding pour : ", summary);

        // Utiliser l'instance d'OllamaEmbeddings pour générer un embedding
        const result = await embeddings.embedQuery(summary);


        console.log("Embedding result:", result); // Vérifiez ce que l'API retourne

        // Si vous obtenez un vecteur, vous pourriez l'extraire comme ceci :
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