'use client'
import { ExternalLink, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useProject from "~/hooks/use-project"
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

const CommitLog = () => {
    const { projectId, project } = useProject()
    const { data: commits } = api.project.getCommits.useQuery({ projectId })

    // Correction de la génération du lien
    const commitLink = project?.githubUrl
        .replace('.git', '')
        .split('/')
        .slice(-2)
        .join('/'); // Assurez-vous que le lien est bien formé

    return (
        <>
            <ul className='space-y-6'>
                {commits?.map((commit, commitIndex) => {
                    return <li key={commit.id} className='relative flex gap-x-4'>
                        <div className={cn(
                            commitIndex === commits.length - 1 ? "h-6" : "-bottom-6",
                            'absolute left-0 top-0 flex w-6 justify-center'
                        )}>
                            <div className='w-px translate-x-1 bg-gray-200'></div>
                        </div>
                        <>
                            <img src={commit.commitAuthorAvatar} alt='commit avatar' className='relative mt-4 size-8 flex-none rounded-full bg-gray-500' />
                            <div className='flex-auto rounded-lg bg-white p-3 ring-1 ring-inset ring-gray-200'>
                                <div className='flex justify-between gap-x-4'>
                                    <Link target='_blank' href={`https://github.com/${commitLink}/commits/${commit.commitHash}`} className='py-0.5 text-xs leading-5 text-gray-500'>
                                        <span className='font-medium text-gray-900'>
                                            {commit.commitAuthorName}
                                        </span>{" "}
                                        <span className='inline-flex items-center'>
                                            commited
                                            <ExternalLink className='m-1 size-4' />
                                        </span>
                                    </Link>
                                </div>
                                <span className='font-semibold'>
                                    {commit.commitMessage}
                                </span>
                                <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500'>
                                    {commit.summary}
                                </pre>
                                <div className='flex items-center gap-x-2 mt-2'>
                                    <Sparkles size={18} className='text-emerald-800' />
                                    <span className='text-emerald-800 text-sm font-medium'>
                                        Generate by Baisilic AI
                                    </span>
                                </div>
                            </div>
                        </>
                    </li>
                })}
            </ul>
        </>
    )
}

export default CommitLog
