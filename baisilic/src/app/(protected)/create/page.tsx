'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { api } from '~/trpc/react'
import useRefetch from '~/hooks/use-refetch'
import { ExternalLinkIcon, Info, Loader2, Check, Github, Coins, Triangle, TriangleAlert } from 'lucide-react'
import LogTerminal from './log-project'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'


type FormInput = {
    repoUrl: string,
    projectName: string,
    githubToken?: string
}

const CreatePage = () => {
    const { register, handleSubmit, reset, watch } = useForm<FormInput>()
    const createProject = api.project.createProject.useMutation()
    const checkCredits = api.project.checkCredits.useMutation()
    const refetch = useRefetch()
    const [isLoading, setIsLoading] = useState(false)
    const [creditsInfo, setCreditsInfo] = useState<{
        fileCount?: number,
        userCredits?: number,
        hasEnoughCredits?: boolean
    }>({})

    // Watch form inputs
    const repoUrl = watch('repoUrl')
    const projectName = watch('projectName')
    const githubToken = watch('githubToken')

    function onCheckCredits() {
        setIsLoading(true)
        checkCredits.mutate({
            githubUrl: repoUrl,
            githubToken: githubToken,
        }, {
            onSuccess: (data) => {
                setCreditsInfo({
                    fileCount: data.fileCount,
                    userCredits: data.userCredits,
                    hasEnoughCredits: data.hasEnoughCredits
                })

                if (!data.hasEnoughCredits) {
                    toast.error('Crédits insuffisants')
                } else {
                    toast.success('Crédits vérifiés avec succès')
                }
                setIsLoading(false)
            },
            onError: (error) => {
                toast.error('Échec de la vérification des crédits')
                setCreditsInfo({})
                setIsLoading(false)
                console.error(error)
            }
        })
    }

    function onSubmit(data: FormInput) {
        if (!creditsInfo.hasEnoughCredits) {
            toast.error('Veuillez vérifier vos crédits avant de créer le projet')
            return
        }

        setIsLoading(true)
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken,
        }, {
            onSuccess: () => {
                toast.success('Projet créé avec succès')
                setIsLoading(false)
                reset()
                refetch()
                setCreditsInfo({}) // Réinitialiser les infos de crédits
            },
            onError: (error) => {
                toast.error('Échec de la création du projet')
                console.error(error)
                setIsLoading(false)
            }
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6"
        >
            <div>
                <motion.h1
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-semibold text-xl"
                >
                    Nouveau projet
                </motion.h1>
                <p className=" text-muted-foreground mt-2">
                    Entrez l'URL de votre dépôt pour le lier à ToucaML
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Input
                            className="bg-gray-200 shadow-none"
                            {...register('projectName', { required: true })}
                            placeholder="Nom du projet"
                            required
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Input
                            className="bg-gray-200 shadow-none"
                            {...register('repoUrl', { required: true })}
                            placeholder="URL Github"
                            required
                            type="url"
                        />
                    </motion.div>
                    <AnimatePresence>
                        {creditsInfo.fileCount && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className=' bg-emerald-50 px-4 py-2 rounded-md border border-emerald-200 text-emerald-700'
                            >

                                <div className='flex items-center gap-2'>

                                    <Github className='size-4' />
                                    <p className='text-sm'>
                                        <strong><Link href={repoUrl}>Projet Github</Link></strong> trouvé avec succès.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Input
                            className="bg-gray-200 shadow-none"
                            {...register('githubToken')}
                            placeholder="Token Github (Optionnel)"
                        />
                    </motion.div>

                    {/* Credits Check Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button
                            type="button"
                            onClick={onCheckCredits}
                            className="w-full bg-blue-600 text-white hover:bg-blue-700"
                            disabled={!repoUrl || isLoading || checkCredits.isPending}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" />
                                    Vérification...
                                </span>
                            ) : (
                                <div className='flex gap-2'>
                                    <Coins />
                                    Vérifier les tokens
                                </div>

                            )}
                        </Button>
                    </motion.div>


                    <AnimatePresence>
                        {creditsInfo.fileCount && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className=' bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700'
                            >

                                <div className='flex items-center gap-2'>
                                    <Info className='size-4' />
                                    <p className='text-sm'>
                                        Ce projet consommera <strong>{creditsInfo.fileCount}</strong> tokens pour ce repository.
                                    </p>
                                    <p className='text-sm text-blue-600 ml-6'>
                                        Il vous reste <strong>{creditsInfo.userCredits}</strong> tokens.
                                    </p>
                                    {!creditsInfo.hasEnoughCredits && (
                                        <p className='text-sm text-red-600 ml-6'>
                                            Crédits insuffisants
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {creditsInfo.fileCount && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className=' bg-violet-50 px-4 py-2 rounded-md border border-violet-200 text-violet-700'
                            >

                                <div className='flex items-center gap-2'>
                                    <TriangleAlert className='size-4' />
                                    <p className='text-sm'>
                                        Attention si vous cliqué sur <strong>"Créer le projet"</strong> vous consommerez vos tokens
                                    </p>

                                    {!creditsInfo.hasEnoughCredits && (
                                        <p className='text-sm text-red-600 ml-6'>
                                            Crédits insuffisants
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Create Project Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Button
                            className='bg-emerald-900 text-white shadow-none hover:bg-[#BEB4FD] hover:text-emerald-900 w-full'
                            type="submit"
                            disabled={!creditsInfo.hasEnoughCredits || isLoading || createProject.isPending}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" />
                                    Création...
                                </span>
                            ) : creditsInfo.hasEnoughCredits ? (
                                <span className="flex items-center gap-2">
                                    <Check className="mr-2" /> Créer le projet
                                </span>
                            ) : (
                                <div className='flex gap-4'>
                                    Créer votre projet
                                </div>
                            )}
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link href={"/learn"}>
                            <p className="mt-4 text-sm text-muted-foreground flex gap-2 align-middle">
                                Vous voulez en apprendre plus ?
                                <ExternalLinkIcon className="h-4 w-4" />
                            </p>
                        </Link>
                    </motion.div>
                </form>

                {/* Log Terminal */}
                {/* <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="h-auto border border-gray-300 rounded-lg overflow-hidden"
                >
                    <LogTerminal projectId={createProject.data?.id} />
                </motion.div> */}
            </div>
        </motion.div >
    )
}

export default CreatePage