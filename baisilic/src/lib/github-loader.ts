import { db } from './../server/db';
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { Document } from "@langchain/core/documents"
import { generateEmbedding, summariseCode } from "./gemini"
import { Octokit } from 'octokit';


export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    // auth: process.env.GITHUB_TOKEN,

});

const getFileCount = async (path: string, octokit: Octokit, githubOwner: string, githubRepo: string, acc: number = 0) => {
    const { data } = await octokit.rest.repos.getContent({
        owner: githubOwner,
        repo: githubRepo,
        path,
    });

    if (!Array.isArray(data) && data.type === "file") {
        return acc + 1;
    }
    if (Array.isArray(data)) {
        let fileCount = 0
        const directories: string[] = []

        for (const item of data) {
            if (item.type === "dir") {
                directories.push(item.path);
            } else {
                fileCount++
            }
        }
        if (directories.length > 0) {
            const directoryCounts = await Promise.all(
                directories.map(dirPath =>
                    getFileCount(dirPath, octokit, githubOwner, githubRepo, 0))
            )
            fileCount += directoryCounts.reduce((acc, count) => acc + count, 0)
        }
        return acc + fileCount
    }

    return acc
}

export const checkCredits = async (githubUrl: string, githubToken?: string) => {

    const cleanUrl = githubUrl.replace(/\.git$/, '');
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN, });

    const githubOwner = cleanUrl.split('/')[3]
    const githubRepo = cleanUrl.split('/')[4]
    if (!githubOwner || !githubRepo) {
        return 0
    }
    const fileCount = await getFileCount('', octokit, githubOwner, githubRepo, 0)
    return fileCount
}

(async () => {
    const { data } = await octokit.rest.rateLimit.get();
    // console.log('Limite =>', data);
})();

const { data } = await octokit.rest.users.getAuthenticated();
// console.log('Utilisateur authentifié:', data.login);


export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {

    const cleanUrl = githubUrl.replace(/\.git$/, '');

    try {
        const loader = new GithubRepoLoader(cleanUrl, {
            accessToken: process.env.GITHUB_TOKEN,
            // accessToken: githubToken || '',
            branch: 'main', // master
            ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb', 'node_modules', 'databases', 'database'],
            recursive: true,
            unknown: 'warn',
            maxConcurrency: 2,
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
        // console.log(`processing ${index} of ${allEmbeddings.length}`)
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