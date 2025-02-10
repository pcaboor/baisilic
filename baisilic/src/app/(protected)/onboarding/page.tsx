'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation' // Correct import
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { api } from '~/trpc/react'
import useRefetch from '~/hooks/use-refetch'
import { ExternalLinkIcon, Info, Loader2, Check, Github, Coins } from 'lucide-react'
import Link from 'next/link'

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
    const router = useRouter() // Utilisation du router
    const [isLoading, setIsLoading] = useState(false)
    const [creditsInfo, setCreditsInfo] = useState<{
        fileCount?: number,
        userCredits?: number,
        hasEnoughCredits?: boolean
    }>({})

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
            onSuccess: (project) => {
                toast.success('Projet créé avec succès')
                setIsLoading(false)
                reset()
                refetch()
                setCreditsInfo({})

                // Redirection vers la page du projet
                router.push(`/dashboard`)
            },
            onError: (error) => {
                toast.error('Échec de la création du projet')
                console.error(error)
                setIsLoading(false)
            }
        })
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-6 rounded-lg w-full max-w-lg text-center">
                <h1 className="font-semibold text-2xl">Nouveau projet</h1>
                <p className="text-muted-foreground mt-2">Entrez l'URL de votre dépôt pour le lier à ToucaML</p>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
                    <Input className="bg-gray-200 shadow-none" {...register('projectName', { required: true })} placeholder="Nom du projet" required />
                    <Input className="bg-gray-200 shadow-none" {...register('repoUrl', { required: true })} placeholder="URL Github" required type="url" />

                    {creditsInfo.fileCount && (
                        <div className='bg-emerald-50 px-4 py-2 rounded-md border border-emerald-200 text-emerald-700'>
                            <div className='flex items-center gap-2'>
                                <Github className='size-4' />
                                <p className='text-sm'>
                                    <strong><Link href={repoUrl}>{repoUrl}</Link></strong> trouvé avec succès.
                                </p>
                            </div>
                        </div>
                    )}

                    <Input className="bg-gray-200 shadow-none" {...register('githubToken')} placeholder="Token Github (Optionnel)" />

                    <Button type="button" onClick={onCheckCredits} className="w-full bg-black text-white hover:bg-blue-700" disabled={!repoUrl || isLoading || checkCredits.isPending}>
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Vérification...
                            </span>
                        ) : (
                            <div className='flex gap-2'>
                                <Coins /> Vérifier les tokens
                            </div>
                        )}
                    </Button>

                    {creditsInfo.fileCount && (
                        <div className='bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700'>
                            <div className='flex items-center gap-2'>
                                <Info className='size-4' />
                                <p className='text-sm'>Ce projet consommera <strong>{creditsInfo.fileCount}</strong> tokens.</p>
                                <p className='text-sm text-blue-600 ml-6'>Il vous reste <strong>{creditsInfo.userCredits}</strong> tokens.</p>
                            </div>
                        </div>
                    )}

                    <Button className='bg-blue-500 text-white shadow-none hover:bg-[#BEB4FD] hover:text-emerald-900 w-full' type="submit" disabled={!creditsInfo.hasEnoughCredits || isLoading || createProject.isPending}>
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Création...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Check className="mr-2" /> Créer le projet
                            </span>
                        )}
                    </Button>

                    <Link href={"/learn"} className="mt-4 text-sm text-muted-foreground flex justify-center gap-2">
                        Vous voulez en apprendre plus ?
                        <ExternalLinkIcon className="h-4 w-4" />
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default CreatePage
