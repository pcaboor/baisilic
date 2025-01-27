import { Octokit } from 'octokit';
import { Document } from "@langchain/core/documents";
import { Base64 } from 'js-base64';

export class GithubContentLoader {
    private octokit: Octokit;
    private owner: string;
    private repo: string;
    private branch: string;
    private ignoredFiles: string[];

    constructor(githubUrl: string, options: {
        branch?: string;
        ignoreFiles?: string[];
    } = {}) {
        this.octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN,
        });

        // Parse GitHub URL
        const urlParts = githubUrl.replace(/\.git$/, '').split('/');
        this.owner = urlParts[urlParts.length - 2]!;
        this.repo = urlParts[urlParts.length - 1]!;
        this.branch = options.branch || 'main';
        this.ignoredFiles = options.ignoreFiles || [
            'package-lock.json',
            'yarn.lock',
            'pnpm-lock.yaml',
            'bun.lockb'
        ];
    }

    private shouldIgnoreFile(path: string): boolean {
        return this.ignoredFiles.some(ignored => path.includes(ignored));
    }

    private async getContent(path: string = ''): Promise<Document[]> {
        try {
            const { data } = await this.octokit.rest.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path,
                ref: this.branch,
            });

            if (Array.isArray(data)) {
                // C'est un dossier
                const documents: Document[] = [];
                for (const item of data) {
                    if (this.shouldIgnoreFile(item.path)) continue;

                    if (item.type === 'file') {
                        const fileContent = await this.getContent(item.path);
                        documents.push(...fileContent);
                    } else if (item.type === 'dir') {
                        const subDirContent = await this.getContent(item.path);
                        documents.push(...subDirContent);
                    }
                }
                return documents;
            } else if ('content' in data) {
                // C'est un fichier
                const content = Base64.decode(data.content);
                return [{
                    pageContent: content,
                    metadata: {
                        source: data.path,
                        type: 'file'
                    }
                }];
            }

            return [];
        } catch (error: any) {
            console.error(`Error fetching ${path}:`, error.message);
            return [];
        }
    }

    async load(): Promise<Document[]> {
        const documents = await this.getContent();
        return documents;
    }
}

// Fonction de remplacement pour loadGithubRepo
export const loadGithubRepo = async (githubUrl: string) => {
    const loader = new GithubContentLoader(githubUrl, {
        branch: 'main',
        ignoreFiles: [
            'package-lock.json',
            'yarn.lock',
            'pnpm-lock.yaml',
            'bun.lockb',
            'node_modules'
        ]
    });

    try {
        return await loader.load();
    } catch (error: any) {
        throw new Error(`Failed to load repository: ${error.message}`);
    }
};