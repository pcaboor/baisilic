import { db } from './../server/db';
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { Document } from "@langchain/core/documents"
import { generateEmbedding, summariseCode } from "./gemini"


export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {

    const cleanUrl = githubUrl.replace(/\.git$/, '');


    try {
        const loader = new GithubRepoLoader(cleanUrl, {
            accessToken: githubToken || '',
            branch: 'main',
            ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
            recursive: true,
            unknown: 'warn',
            maxConcurrency: 5,
        });

        const docs = await loader.load();
        return docs;
    } catch (error: any) {
        if (error.response?.status === 404) {
            console.error(`Repository not found: ${githubUrl}`);
            throw new Error(`Unable to fetch repository files: ${error.response.status} ${error.response.data.message}`);
        } else if (error.response?.status === 403) {
            console.error('Authentication failed or rate limit exceeded.');
            throw new Error('GitHub API authentication failed. Please check your token or rate limits.');
        } else {
            console.error(`Failed to process repository: ${error.message}`);
            throw new Error(`Unknown error: ${error.message}`);
        }
    }
};


export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken)
    const allEmbeddings = await generateEmbeddings(docs)
    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        console.log(`processing ${index} of ${allEmbeddings.length}`)
        if (!embedding) return

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId,
            }
        })
        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `
    }))
}

const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async doc => {
        const summary = await summariseCode(doc)
        const embedding = await generateEmbedding(summary)
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source
        }
    }))
}