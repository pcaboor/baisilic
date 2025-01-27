// src/server/api/routers/user.ts
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    getUser: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId!
            },
            select: {
                id: true,
                credits: true,
                firstName: true,
                lastName: true,
                imageurl: true,
                emailAdress: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return user;
    }),
});