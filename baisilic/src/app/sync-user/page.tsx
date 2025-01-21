import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '~/server/db'

const SyncUser = async () => {

    const { userId } = await auth()

    if (!userId) {
        throw new Error('User not found')
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    if (!user.emailAddresses[0]?.emailAddress) {
        throw new Error('User not found')
    }

    await db.user.upsert({
        where: {
            emailAdress: user.emailAddresses[0]?.emailAddress ?? "",
        },
        update: {
            imageurl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName
        },
        create: {
            id: userId,
            emailAdress: user.emailAddresses[0]?.emailAddress ?? "",
            imageurl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    })
    return redirect('/dashboard')

}
export default SyncUser
