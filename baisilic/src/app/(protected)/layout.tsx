'use client'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { SidebarProvider } from '~/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { usePathname } from 'next/navigation'
import useProject from '~/hooks/use-project'
import ArchiveButton from './dashboard/archive-button'
import InviteButton from './dashboard/invite-button'
import { RotateCcw } from 'lucide-react'

type Props = {
    children: React.ReactNode
}

const SidebarLayout = ({ children }: Props) => {

    const excludedPaths = ['']; // Ajoute ici les pages à ignorer
    const pathname = usePathname();
    const { project } = useProject()
    if (excludedPaths.includes(pathname)) {
        return <>{children}</>; // Pas de sidebar, on affiche juste le contenu
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                {project ? (
                    <div className="flex items-center justify-between w-full px-4 py-3">
                        {/* Nom du projet à gauche */}
                        <div className="flex items-center gap-2">
                            <div className="rounded-sm size-6 flex items-center justify-center text-white text-sm bg-neutral-400 text-primary transition-all duration-200 ease-in-out">
                                {project.name[0]}
                            </div>
                            <span className='text-neutral-300 text-sm'>Projet selectionné</span>

                            <span className="text-sm font-medium text-neutral-600 transition-all duration-200 ease-in-out hover:text-neutral-800">
                                {project.name}
                            </span>
                            {/* <span className=" text-sm font-light text-neutral-400 transition-all duration-200 ease-in-out hover:text-neutral-800">
                                Créé le:{' '}
                                {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span> */}
                        </div>

                        {/* Boutons à droite */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-neutral-400">
                                <RotateCcw size={18} />
                                <span className=" text-sm font-light  transition-all duration-200 ease-in-out hover:text-neutral-800">
                                    Dernières modifications le:{' '}
                                    {new Date(project.updatedAt).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                            <InviteButton />
                            <ArchiveButton />
                            <UserButton />
                        </div>
                        {/* <div className="flex items-center gap-4">
                         <TeamMembers />
                         <Github className="h-5 w-5 text-black mr-2" />
                         <Link
                             href={project.githubUrl ?? ""}
                             className="inline-flex items-center text-black hover:underline"
                         >
                             {project.githubUrl}
                             <ExternalLink className="ml-1 h-4 w-4" />
                         </Link>
                     </div> */}
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full px-4"></div>
                )}
                {/* <div className='flex items-center gap-2'>
                    <div className='ml-auto'>
                    </div>
              
                </div> */}
                <div className='overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
                    {children}
                </div>
            </main>
        </SidebarProvider >
    )
}

export default SidebarLayout