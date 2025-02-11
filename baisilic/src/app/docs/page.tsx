'use client'

import { motion } from 'framer-motion'
import { Highlighter } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarImage } from '~/components/ui/avatar'

import NavBar from '~/components/ui/landing-page/navBar'

const Docs = () => {
    return (
        <div className="bg-white">
            <div className="relative isolate px-6">
                <div className="mx-auto max-w-4xl py-32 lg:py-48 text-center">
                    <NavBar />
                    <div className="flex flex-col ">
                        <div className="flex-grow px-4 pb-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full max-w-2xl mx-auto text-center"
                            >
                                <h1 className="text-4xl font-bold mb-6 text-neutral-500">
                                    Documentation
                                </h1>

                                <Avatar className='h-20 w-20 mx-auto my-5'>
                                    <AvatarImage sizes='xl' src='https://i.pinimg.com/736x/56/71/b8/5671b84e3f89c1f1eb3fbb6ed507b47a.jpg' />
                                </Avatar>

                                <div className='flex gap-2 items-center justify-center'>
                                    <p className="text-sm text-neutral-400 font-semibold flex gap-1 items-center">
                                        <Highlighter size={20} />
                                        Questions recommandées
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 p-8 md:grid-cols-2 lg:grid-cols-2"
                                >

                                    <img
                                        src="https://i.pinimg.com/736x/b3/2b/dc/b32bdc8a99f9f796b0b89002415966b6.jpg"
                                        alt="impressionist painting, uploaded to Cosmos"
                                        className="h-auto w-full rounded-[4px]"
                                    />
                                    <img
                                        src="https://images.beta.cosmos.so/cb674d14-ebd1-4408-bab1-79df895017b6?format=jpeg"
                                        alt="impressionist painting, uploaded to Cosmos"
                                        className="h-auto w-full rounded-[4px]"
                                    />
                                    <img
                                        src="https://images.beta.cosmos.so/e5a6c3ed-82ad-4084-9a11-1eccd7bc91aa?format=jpeg"
                                        alt="impressionist painting, uploaded to Cosmos"
                                        className="h-auto w-full rounded-[4px]"
                                    />
                                    <img
                                        src="https://images.beta.cosmos.so/4d02a1e7-d1f2-4575-86a9-bed243e59132?format=jpeg"
                                        alt="impressionist painting, uploaded to Cosmos"
                                        className="h-auto w-full rounded-[4px]"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Docs