'use client'

import { ExternalLink, Github, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useProject from '~/hooks/use-project'
import CommitLog from './commit-log'
import AskQuestionCard from './ask-question-card'
import { Button } from '~/components/ui/button'
import ArchiveButton from './archive-button'
import InviteButton from './invite-button'
import TeamMembers from './team-members'

const DashBoard = () => {
    const { project } = useProject()

    return (
        <div>
            {project ? (
                <>
                    {/* Project Info Section */}
                    <div className="flex items-center justify-between flex-wrap gap-y-4">
                        <div className="w-fit rounded-lg bg-gray-200 px-4 py-3">
                            <div className="flex items-center">
                                <Github className="h-5 w-5 text-black" />
                                <div className="ml-2">
                                    <p className="text-sm font-medium text-black">
                                        This project is linked to{' '}
                                        <Link
                                            href={project.githubUrl ?? ""}
                                            className="inline-flex items-center text-black hover:underline"
                                        >
                                            {project.githubUrl}
                                            <ExternalLink className="ml-1 h-4 w-4" />
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Placeholder for additional components */}
                        <div className="flex items-center gap-4">
                            <TeamMembers />
                            <InviteButton />
                            <ArchiveButton />
                        </div>
                    </div>

                    {/* Ask Question Section */}
                    <div className="mt-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">

                        </div>
                        <AskQuestionCard />
                    </div>

                    {/* Commit Log Section */}
                    <div className="mt-8">
                        <CommitLog />
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center justify-center text-center h-96 gap-3 p-5 rounded-xl">
                        <Search className='text-emerald-900' />
                        <p className="text-sm text-emerald-900">Vous n'avez pas encore de projet</p>
                        <Link href={'/create'}>
                            <Button className="w-fit  bg-[#BEB4FD] text-emerald-900 shadow-none hover:bg-emerald-900 hover:text-[#BEB4FD]">
                                <Plus />
                                Create Project
                            </Button>
                        </Link>
                    </div>

                </>
            )}
        </div>
    )
}

export default DashBoard
