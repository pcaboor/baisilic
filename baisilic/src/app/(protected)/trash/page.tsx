'use client'

import { useRouter } from 'next/navigation';
import React from 'react'
import useRefetch from '~/hooks/use-refetch'
import { api } from '~/trpc/react';

const Trash = () => {
    const { data: projects } = api.project.getTrashProjects.useQuery()
    const router = useRouter();

    const refetch = useRefetch();
    const untrashMutation = api.project.untrashProjects.useMutation({
        onSuccess: () => {
            refetch() // Rafraîchir les projets après restauration
            router.refresh();

        }
    })
    const deleteForeverMutation = api.project.deleteProjects.useMutation({
        onSuccess: () => {
            refetch() // Rafraîchir les projets après restauration
            router.refresh();

        }
    })

    const deletedProjects = projects?.filter(project => project.deletedAt !== null)
    console.log(deletedProjects)

    return (
        <div>
            <h1 className='text-xl font-semibold'>Corbeille</h1>
            <div className='h-2'></div>
            <div className='flex flex-col gap-2'>
                {deletedProjects?.length ? (
                    deletedProjects.map(project => (
                        <div key={project.id} className='p-4 border rounded-lg'>
                            <h2 className='text-lg font-semibold'>{project.name}</h2>
                            <p className='text-sm text-gray-500'>
                                Supprimé le : {project.deletedAt
                                    ? new Date(project.deletedAt).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : 'Date inconnue'}
                            </p>
                            <button
                                className='bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-md mt-2'
                                onClick={() => untrashMutation.mutate({ projectId: project.id })}

                            >
                                Restaurer
                            </button>
                            <button
                                className='bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-md mt-2'
                                onClick={() => deleteForeverMutation.mutate({ projectId: project.id })}

                            >
                                Supprimer définitivemet
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Aucun projet supprimé.</p>
                )}
            </div>
        </div>
    )
}

export default Trash


