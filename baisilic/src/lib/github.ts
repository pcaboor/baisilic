import { Octokit } from 'octokit';
import { db } from '~/server/db';
import axios from 'axios'
import { aiSummariseCommit } from './gemini';
import { octokit } from './github-loader';
import { RateLimiter } from 'limiter';

// TODOO : 

// Permettre au user de choisir quel type de fichier a fetch et traiter par l'ia
// Gagner du temps et des perfs et limiter les request api gemini et GitHub

const limiter = new RateLimiter({
    tokensPerInterval: 1,
    interval: 1000,
});

type Response = {
    commitHash: string
    commitMessage: string
    commitAuthorName: string
    commitAuthorAvatar: string
    commitDate: string
}
export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {

    const cleanUrl = githubUrl.replace('.git', '');
    const [owner, repo] = cleanUrl.split('/').slice(-2)

    if (!owner || !repo) {
        throw new Error('Invalid github URL')
    }

    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: 10,
        page: 1,
    })
    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]

    return sortedCommits.slice(0, 10).map((commit: any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date ?? "",
    }))

}

export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
    // console.log('Fetched project:', { projectId, githubUrl });

    const commitHashes = await getCommitHashes(githubUrl);
    //console.log('Commit hashes fetched:', commitHashes.length);

    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
    //console.log('Unprocessed commits:', unprocessedCommits.length);

    const summaryResponses = await Promise.allSettled(
        unprocessedCommits.map(async (commit) => {
            try {
                // Attendez un jeton avant d'exécuter la requête
                await limiter.removeTokens(1);
                return await summariseCommit(githubUrl, commit.commitHash);
            } catch (error) {
                console.error(`Rate limiting error: ${error}`);
                return ""; // En cas d'erreur de limitation, renvoyer une chaîne vide
            }
        })
    );
    const summaries = summaryResponses.map((response) => {
        if (response.status === 'fulfilled') {
            return response.value as string;
        }
        return ""
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            return {
                projectId: projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: new Date(unprocessedCommits[index]!.commitDate),
                summary,
            }
        })
    })
    return commits
}

// async function summariseCommit(githubUrl: string, commitHash: string) {
//     const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
//         headers: {
//             Accept: "application/vnd.github.v3.diff"
//         },
//     })
//     return await aiSummariseCommit(data) || ""
// }

// Wrapper function to handle multiple commits with progress
async function summariseCommit(githubUrl: string, commitHash: string) {
    const [owner, repo] = githubUrl.replace('.git', '').split('/').slice(-2);

    const { data } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: commitHash,
    });
    // Extract patch/diff information from the files
    const diffContent = data.files?.map(file =>
        `diff --git a/${file.filename} b/${file.filename}\n${file.patch || ''}`
    ).join('\n') || '';

    return await aiSummariseCommit(diffContent);
}

async function fetchProjectGithubUrl(projectId: string) {

    const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
            githubUrl: true,
        }
    })
    if (!project?.githubUrl) {
        throw new Error('Project has no github url')
    }
    return { project, githubUrl: project?.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: { projectId },
        select: { commitHash: true },
    });
    const unprocessedCommits = commitHashes.filter(commit => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits
}
