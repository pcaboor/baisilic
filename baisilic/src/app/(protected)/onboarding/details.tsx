import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Check, Coins, ExternalLinkIcon, Github, Highlighter, Info, LinkIcon, Loader2, Lock, Text } from 'lucide-react';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import useRefetch from '~/hooks/use-refetch';
import useUserDb from '~/hooks/use-user';
import { Spinner } from '~/components/ui/spinner';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { cn } from '~/lib/utils';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type FormInput = {
    repoUrl: string,
    projectName: string,
    githubToken?: string
}

const CreateProjectContainer: React.FC = () => {

    const { register, handleSubmit, reset, watch } = useForm<FormInput>()
    const createProject = api.project.createProject.useMutation()
    const checkCredits = api.project.checkCredits.useMutation()
    const router = useRouter() // Utilisation du router
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
    let minHeight = 52,
        maxHeight = 200;

    const [question] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chatState] = useState<'initial' | 'asking' | 'answered'>('initial');
    const { user } = useUserDb();
    const refetch = useRefetch();
    const refresh = () => {
        window.location.reload();
    };

    return (
        <div>
            <div className={`flex-grow overflow-auto px-4 pt-8 ${chatState === 'initial' ? 'flex items-center justify-center' : ''}`}>
                <AnimatePresence>
                    {chatState === 'initial' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-2xl text-center"
                        >
                            <h1 className="text-4xl font-bold mb-6 text-neutral-500">
                                Créer un nouveau projet
                            </h1>
                            <Avatar className='h-20 w-20 mx-auto my-5'>
                                <AvatarImage sizes='xl' src='https://i.pinimg.com/736x/56/71/b8/5671b84e3f89c1f1eb3fbb6ed507b47a.jpg' />
                            </Avatar>


                        </motion.div>
                    )}

                    {(chatState === 'asking' || chatState === 'answered') && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-4xl mx-auto space-y-4"
                        >
                            <div>

                                <h2 className="text-lg font-medium text-neutral-400">
                                    {user?.firstName} demande: <span className='text-neutral-600'>{question}</span>
                                </h2>
                            </div>

                            {isLoading ? (
                                <div className='flex gap-2 items-center text-neutral-400 font-medium'>
                                    Singulary réfléchi <Spinner size='sm' />
                                </div>
                            ) : (
                                <div className="flex items-start gap-4">
                                    <Avatar className="shrink-0">
                                        <AvatarImage
                                            src='https://i.pinimg.com/736x/56/71/b8/5671b84e3f89c1f1eb3fbb6ed507b47a.jpg'
                                            alt="AI Assistant Avatar"
                                            className="w-10 h-10"
                                        />
                                    </Avatar>

                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4 ">
                <p className="text-sm text-neutral-400 font-semibold flex gap-1">
                    <Text size={20} />
                    Nom du projet
                </p>
                <Input className={cn(
                    "max-w-xl bg-black/5 dark:bg-white/5 rounded-3xl pl-6 pr-16",
                    "placeholder:text-black/50 dark:placeholder:text-white/50",
                    "border-none ring-black/20 dark:ring-white/20",
                    "text-black dark:text-white text-wrap",
                    "overflow-y-auto resize-none",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "transition-[height] duration-100 ease-out",
                    "leading-[1.2] py-[20px]",
                    `min-h-[${minHeight}px]`,
                    `max-h-[${maxHeight}px]`,
                    "[&::-webkit-resizer]:hidden",
                )} {...register('projectName', { required: true })} placeholder="Nom du projet" required />
                <p className="text-sm text-neutral-400 font-semibold flex gap-1 items-center">
                    <LinkIcon size={20} />
                    Lien du repository Github
                </p>
                <Input className={cn(
                    "max-w-xl bg-black/5 dark:bg-white/5 rounded-3xl pl-6 pr-16",
                    "placeholder:text-black/50 dark:placeholder:text-white/50",
                    "border-none ring-black/20 dark:ring-white/20",
                    "text-black dark:text-white text-wrap",
                    "overflow-y-auto resize-none",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "transition-[height] duration-100 ease-out",
                    "leading-[1.2] py-[20px]",
                    `min-h-[${minHeight}px]`,
                    `max-h-[${maxHeight}px]`,
                    "[&::-webkit-resizer]:hidden",
                )} {...register('repoUrl', { required: true })} placeholder="URL Github" required type="url" />

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
                <p className="text-sm text-neutral-400 font-semibold flex gap-1">
                    <Lock size={20} />
                    Pour repository privé (optionnel)
                </p>
                <Input className={cn(
                    "max-w-xl bg-black/5 dark:bg-white/5 rounded-3xl pl-6 pr-16",
                    "placeholder:text-black/50 dark:placeholder:text-white/50",
                    "border-none ring-black/20 dark:ring-white/20",
                    "text-black dark:text-white text-wrap",
                    "overflow-y-auto resize-none",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "transition-[height] duration-100 ease-out",
                    "leading-[1.2] py-[20px]",
                    `min-h-[${minHeight}px]`,
                    `max-h-[${maxHeight}px]`,
                    "[&::-webkit-resizer]:hidden",
                )} {...register('githubToken')} placeholder="Token Github (Optionnel)" />

                <Button type="button" onClick={onCheckCredits} className="max-w-xl bg-black text-white" disabled={!repoUrl || isLoading || checkCredits.isPending}>
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

                <Button className='bg-blue-500 text-white shadow-none max-w-xl' type="submit" disabled={!creditsInfo.hasEnoughCredits || isLoading || createProject.isPending}>
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

                <Link href={"/learn"} className="mt-4 text-sm text-muted-foreground flex justify-center gap-2 items-center">
                    Vous voulez en apprendre plus ?
                    <ExternalLinkIcon className="h-4 w-4" />
                </Link>
            </form>
        </div>
    );
};

export default CreateProjectContainer;
