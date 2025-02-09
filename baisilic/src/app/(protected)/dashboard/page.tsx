'use client'

import { Plus, RotateCcw, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useProject from '~/hooks/use-project'

import { Button } from '~/components/ui/button'

import ArchiveButton from './archive-button'
import InviteButton from './invite-button'
import { UserButton } from '@clerk/nextjs'
import AskQuestionCard from './ask-question-card'

const DashBoard = () => {
    const { project } = useProject()

    return (
        <div className="h-full">
            {project ? (
                <div className="flex flex-col h-full">
                    {/* Top Tools Section */}



                    {/* Main Content Area */}
                    <div className="flex flex-grow ">
                        {/* Left Side: Chat Area */}

                        <AskQuestionCard />


                        {/* Right Side: Commit Log */}
                        {/* <div className="w-1/3 p-4 overflow-auto">
                            <CommitLog />
                        </div> */}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center h-96 gap-3 p-5 rounded-xl">
                    <Search className='text-neutral-600' />
                    <p className="text-sm 'text-neutral-600">
                        Vous n'avez pas encore de projet
                    </p>
                    <Link href={'/create'}>
                        <Button className="w-fit bg-blue-500 text-white shadow-none hover:bg-blue-400 ">
                            <Plus />
                            Create Project
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default DashBoard
