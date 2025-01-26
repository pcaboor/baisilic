'use client'

import { ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useProject from '~/hooks/use-project'
import CommitLog from './commit-log'
import AskQuestionCard from './ask-question-card'

const DashBoard = () => {
    const { project } = useProject()
    return (
        <div>
            <div className='flex items-center justify-between flex-wrap gap-y-4'>
                <div className='w-fit rounded-lg bg-gray-200 px-4 py-3'>
                    <div className='flex items-center'>
                        <Github className='size-5 text-black' />
                        <div className='ml-2'>
                            <p className='text-sm font-medium text-blakc'>
                                This project is link to {' '}
                                <Link href={project?.githubUrl ?? ""} className='inline-flex items-center text-black hover:underline'>
                                    {project?.githubUrl}
                                    <ExternalLink className='ml-1 size-4' />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Add more components here */}
                <div className='h-4'></div>
                <div className='flex items-center gap-4'>
                    Team
                </div>
            </div>
            <div className='mt-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-5'>
                    <AskQuestionCard />
                </div>
            </div>
            <div className='mt-8'>
                <CommitLog />
            </div>
        </div>
    )
}
export default DashBoard