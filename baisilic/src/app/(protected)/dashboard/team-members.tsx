'use client'

import React from 'react'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react'

const TeamMembers = () => {

    const { projectId } = useProject()
    const { data: members } = api.project.getTeamMembers.useQuery({ projectId })
    console.log(members)
    return (
        <div className='flex items-center gap-2'>
            {members?.map((member) => (
                <div key={member.id}>
                    <Avatar key={member.id} className='h-8 w-8'>
                        <AvatarImage src={member.user.imageurl || ''} alt={member.user.firstName || ''} />
                    </Avatar>
                </div>
            ))}
        </div>
    )
}

export default TeamMembers