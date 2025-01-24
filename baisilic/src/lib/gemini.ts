import { GoogleGenerativeAI } from "@google/generative-ai"
import { RateLimiter } from 'limiter';
import { Document } from "@langchain/core/documents"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

// Create a rate limiter to allow 1 request per 1 seconds
const limiter = new RateLimiter({
    tokensPerInterval: 1,
    interval: 1000,
});

export const aiSummariseCommit = async (diff: string, progressCallback?: (progress: number) => void) => {

    await limiter.removeTokens(1);

    try {
        const response = await model.generateContent([
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

        // Optional progress tracking
        if (progressCallback) {
            progressCallback(1);
        }

        return response.response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}


export async function summariseCode(doc: Document) {
    console.log("getting summary for", doc.metadata.source);
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
}

export async function generateEmbedding(summary: string) {
    const model = genAI.getGenerativeModel({
        model: 'text-embedding-004'
    })
    const result = await model.embedContent(summary)
    const embedding = result.embedding
    return embedding.values;
}


