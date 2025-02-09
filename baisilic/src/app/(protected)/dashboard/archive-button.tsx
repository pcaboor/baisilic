'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import useProject from '~/hooks/use-project'
import useRefetch from '~/hooks/use-refetch'
import { api } from '~/trpc/react'

const ArchiveButton = () => {
    const archiveProject = api.project.archiveProjects.useMutation()
    const { projectId, setProjectId } = useProject() || {};
    const refetch = useRefetch();
    const router = useRouter()

    // Query pour obtenir le premier projet non archivé
    const { data: projects } = api.project.getProjects.useQuery()

    const handleArchive = async () => {
        const confirm = window.confirm('Are you sure you want to archive this project ?')
        if (!confirm) return

        archiveProject.mutate({ projectId: projectId }, {
            onSuccess: async () => {
                toast.success('Project archived successfully')
                await refetch()

                // Trouver le premier projet non archivé
                const firstNonArchivedProject = projects?.find(
                    project => !project.deletedAt && project.id !== projectId
                )

                if (firstNonArchivedProject) {
                    // Si on trouve un projet non archivé, on le sélectionne
                    setProjectId(firstNonArchivedProject.id)
                    router.push('/dashboard')
                } else {
                    // Si aucun projet non archivé n'est trouvé, rediriger vers la page d'accueil
                    router.push('/welcome')
                }
            },
            onError: (error) => {
                toast.error('Error archiving project : ' + error.message)
            },
        })
    }

    return (
        <Button
            className='bg-white hover:bg-neutral-100 shadow-none text-neutral-500 text-base'
            disabled={archiveProject.isPending}
            onClick={handleArchive}
        >
            <Trash2 />
            Corbeille
        </Button>
    )
}

export default ArchiveButton