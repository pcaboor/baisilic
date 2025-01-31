import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { db } from '~/server/db'

type Props = {
    params: Promise<{ projectId: string }>
}

const JoinHandler = async (props: Props) => {
    const { projectId } = await props.params
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }
    const dbUser = await db.user.findUnique({
        where: {
            id: userId
        }
    })
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    if (!dbUser) {
        await db.user.create({
            data: {
                id: userId,
                credits: 150,
                firstName: user.firstName,
                lastName: user.lastName,
                imageurl: user.imageUrl,
                emailAdress: user.emailAddresses[0]!.emailAddress,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

        })
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId
        }
    })
    if (!project) {
        return redirect('/dashboard')
    }
    try {
        await db.userToProject.create({
            data: {
                userId,
                projectId,
            }
        })
    }
    catch (error) {
        console.error('Error joining project:', error)
    }
    return redirect('/dashboard')
}

export default JoinHandler