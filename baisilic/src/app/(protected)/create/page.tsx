'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Progress } from '~/components/ui/progress'
import { api } from '~/trpc/react'
import useRefetch from '~/hooks/use-refetch'
import { Loader2 } from 'lucide-react'

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
                refetch()
                reset()
                setIsLoading(false)
            },
            onError: (error) => {
                toast.error('Failed to create project')
                console.error(error)
                setIsLoading(false)
            }
        })
    }

    return (
        <div className='flex items-center gap-12 h-full justify-center'>
            {/* <img src='/undraw_data-processing_z2q6.svg' className='h-56 w-auto' /> */}
            <div>
                <div>
                    <h1 className='font-semibold text-2xl'>
                        Link your GitHub Repository
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter the URL of your repository to link it to Baisilic
                    </p>
                </div>
                <div className='h-4'></div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input {...register('projectName', { required: true })} placeholder='Project Name' required />
                    <div className='h-2'></div>
                    <Input {...register('repoUrl', { required: true })} placeholder='Github URL' required type='url' />
                    <div className='h-2'></div>
                    <Input {...register('githubToken',)} placeholder='Github Token (Optional)' />
                    <div className='h-4'></div>
                    <Button
                        type='submit'
                        disabled={isLoading || createProject.isPending}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className='animate-spin' />
                                Creating...
                            </span>
                        ) : (
                            'Create Project'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CreatePage
