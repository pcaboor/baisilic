'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { api } from '~/trpc/react'
import useRefetch from '~/hooks/use-refetch'
import { ExternalLinkIcon, Loader2 } from 'lucide-react'
import LogTerminal from './log-project'
import Link from 'next/link'

type FormInput = {
    repoUrl: string,
    projectName: string,
    githubToken?: string
}

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>()
    const createProject = api.project.createProject.useMutation()
    const refetch = useRefetch()
    const [isLoading, setIsLoading] = useState(false)

    function onSubmit(data: FormInput) {
        setIsLoading(true)

        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken,
        }, {
            onSuccess: () => {
                toast.success('Project created successfully')
                setIsLoading(false)
                reset()
                refetch()
            },
            onError: (error) => {
                toast.error('Failed to create project')
                console.error(error)
                setIsLoading(false)
            }
        })
    }

    return (
        <div className="p-6">
            <div>
                <h1 className="font-semibold text-xl">Nouveau projet</h1>
                <p className="text-xs text-muted-foreground mt-2">
                    Enter the URL of your repository to link it to Baisilic
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input
                        className="bg-gray-200 shadow-none"
                        {...register('projectName', { required: true })}
                        placeholder="Project Name"
                        required
                    />
                    <Input
                        className="bg-gray-200 shadow-none"
                        {...register('repoUrl', { required: true })}
                        placeholder="Github URL"
                        required
                        type="url"
                    />
                    <Input
                        className="bg-gray-200 shadow-none"
                        {...register('githubToken')}
                        placeholder="Github Token (Optional)"
                    />
                    <Button className=' bg-emerald-900 text-[#BEB4FD] shadow-none hover:bg-[#BEB4FD] hover:text-emerald-900' type="submit" disabled={isLoading || createProject.isPending}>
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            'Create Project'
                        )}
                    </Button>
                    <Link href={"/learn"}>
                        <p className="mt-4 text-sm text-muted-foreground flex gap-2 align-middle">
                            Vous voulez en apprendre plus ?
                            <ExternalLinkIcon className="h-4 w-4" />
                        </p>
                    </Link>
                </form>

                {/* Log Terminal */}
                <div className="h-auto border border-gray-300 rounded-lg overflow-hidden">
                    <LogTerminal projectId={createProject.data?.id} />
                </div>
            </div>
        </div>
    )
}

export default CreatePage
