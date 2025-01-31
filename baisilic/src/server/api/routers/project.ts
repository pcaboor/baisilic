import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits } from "~/lib/github";
import { checkCredits, indexGithubRepo } from "~/lib/github-loader";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId!
            },
            select: {
                credits: true
            }
        })
        if (!user) {
            throw new Error('User not found')
        }

        const currentCredits = user.credits || 0;
        const fileCount = await checkCredits(
            input.githubUrl,
            input.githubToken
        )
        if (fileCount > currentCredits) {
            throw new Error('Not enough credits')
        }
        // TODO: Implement project creation logic
        const project = await ctx.db.project.create({
            data: {
                githubUrl: input.githubUrl,
                name: input.name,
                userToProjects: {
                    create: {
                        userId: ctx.user.userId!,
                    }
                }
            }
        })
        // Start commit polling in background
        // void (async () => {
        //     try {
        //         await pollCommits(project.id, (progress) => {
        //             // Broadcast progress via SSE
        //             broadcastProgress(project.id, progress);
        //         });

        //         // Mark polling as complete
        //         completeProjectPolling(project.id);
        //     } catch (error) {
        //         console.error('Commit polling failed:', error);
        //         // Optionally broadcast error
        //         broadcastProgress(project.id, -1);
        //     }
        // })();
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken)
        await pollCommits(project.id)
        await ctx.db.user.update({
            where: {
                id: ctx.user.userId!
            },
            data: {
                credits: {
                    decrement: fileCount,
                }
            }
        })
        return project;
    }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.project.findMany({
            where: {
                userToProjects: {
                    some: {
                        userId: ctx.user.userId!,
                    }
                },
                deletedAt: null
            }
        })
    }),
    getCommits: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        pollCommits(input.projectId).then().catch(console.error);
        return await ctx.db.commit.findMany({
            where: {
                projectId: input.projectId
            }
        })
    }),
    saveAnswer: protectedProcedure.input(z.object({
        projectId: z.string(),
        filesReferences: z.any(),
        question: z.string(),
        answer: z.string()
    })).mutation(async ({ ctx, input }) => {
        return await ctx.db.question.create({
            data: {
                projectId: input.projectId,
                fileReference: input.filesReferences,
                question: input.question,
                answer: input.answer,
                userId: ctx.user.userId!
            }
        })
    }),
    getQuestions: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
        return await ctx.db.question.findMany({
            where: {
                projectId: input.projectId
            },
            include: {
                user: true
            },
            orderBy: { createdAt: 'desc' }
        })
    }),
    archiveProjects: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(async ({ ctx, input }) => {
        return await ctx.db.project.update({
            where: {
                id: input.projectId
            },
            data: {
                deletedAt: new Date()
            }
        })
    }),
    getTeamMembers: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
        return await ctx.db.userToProject.findMany({
            where: {
                projectId: input.projectId
            },
            include: {
                user: true
            }
        })
    }),
    getMyCredits: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId!
            },
            select: {
                credits: true,
            }
        })
    }),
    checkCredits: protectedProcedure.input(z.object({ githubUrl: z.string(), githubToken: z.string().optional() })).mutation(async ({ ctx, input }) => {
        const fileCount = await checkCredits(input.githubUrl, input.githubToken)
        const userCredits = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId!
            },
            select: {
                credits: true,
            }
        })
        const hasEnoughCredits = userCredits?.credits && userCredits.credits >= fileCount
        return {
            fileCount,
            userCredits: userCredits?.credits || 0,
            hasEnoughCredits
        }
    })
})
