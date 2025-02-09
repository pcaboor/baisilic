'use client'

import { ExternalLink, Github, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useProject from '~/hooks/use-project'

import { Button } from '~/components/ui/button'

import { motion } from 'framer-motion'
import ArchiveButton from './archive-button'
import AskQuestionCard from './ask-question-card'
import CommitLog from './commit-log'
import InviteButton from './invite-button'
import TeamMembers from './team-members'

const DashBoard = () => {
    const { project } = useProject()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
        >
            {project ? (
                <div className="flex flex-col h-full">
                    {/* Top Tools Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-between px-4 py-3 border-b"
                    >
                        {/* GitHub Project Link */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-4"
                        >

                            <InviteButton />
                            <ArchiveButton />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-4"
                        >
                            <TeamMembers />
                            <Github className="h-5 w-5 text-black mr-2" />
                            <Link
                                href={project.githubUrl ?? ""}
                                className="inline-flex items-center text-black hover:underline"
                            >
                                {project.githubUrl}
                                <ExternalLink className="ml-1 h-4 w-4" />
                            </Link>
                        </motion.div>

                        {/* Project Tools */}

                    </motion.div>

                    {/* Main Content Area */}
                    <div className="flex flex-grow ">
                        {/* Left Side: Chat Area */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="w-2/3 p-4 border-r overflow-auto"
                        >
                            <AskQuestionCard />
                        </motion.div>

                        {/* Right Side: Commit Log */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="w-1/3 p-4 overflow-auto"
                        >
                            <CommitLog />
                        </motion.div>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center text-center h-96 gap-3 p-5 rounded-xl"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Search className='text-emerald-900' />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-emerald-900"
                    >
                        Vous n'avez pas encore de projet
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link href={'/create'}>
                            <Button className="w-fit bg-[#BEB4FD] text-emerald-900 shadow-none hover:bg-emerald-900 hover:text-[#BEB4FD]">
                                <Plus />
                                Create Project
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    )
}

export default DashBoard