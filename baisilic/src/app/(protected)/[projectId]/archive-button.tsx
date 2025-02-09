'use client'

import { Save } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import useProject from '~/hooks/use-project'
import useRefetch from '~/hooks/use-refetch'
import { api } from '~/trpc/react'

const ArchiveButton = () => {

    const archiveProject = api.project.archiveProjects.useMutation()
    const { projectId } = useProject()
    const refetch = useRefetch
    return (
        <Button className='bg-gray-200 shadow-none text-black ' disabled={archiveProject.isPending} onClick={() => {
            const confirm = window.confirm('Are you sure you want to archive this project ?')
            if (confirm) {
                archiveProject.mutate({ projectId: projectId }, {
                    onSuccess: () => {
                        toast.success('Project archived successfully')
                    },
                    onError: (error) => {
                        toast.error('Error archiving project : ' + error.message)
                    },
                })
            }
        }}>
            <Save />
        </Button>
    )
}

export default ArchiveButton