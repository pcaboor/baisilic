'use client'

import React from 'react'
import { PiLegoFill } from 'react-icons/pi'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'
import useProject from '~/hooks/use-project'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'
import MDEditor from '@uiw/react-md-editor'
import CodeReference from './code-reference'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { Bookmark } from 'lucide-react'
import useRefetch from '~/hooks/use-refetch'
import { PlaceholdersAndVanishInput } from './ai-input'
import useUserDb from '~/hooks/use-user'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { FlipWords } from '~/components/ui/flip-word'


const AskQuestionCard = () => {

    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
    ];
    const words = ["Posez votre question à Touca"]

    const { project } = useProject();
    const [open, setOpen] = React.useState(false)
    const [question, setQuestion] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false)
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([])
    const [answer, setAnswer] = React.useState('')
    const saveAnswer = api.project.saveAnswer.useMutation();
    const { user } = useUserDb()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('')
        setFilesReferences([])
        e.preventDefault();
        if (!project?.id) return;
        setIsLoading(true)

        const { output, filesReferences } = await askQuestion(question, project.id)
        setFilesReferences(filesReferences)

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta)
            }
        }
        setIsLoading(false)
    }
    const refetch = useRefetch();

    return (
        <>
            {/* <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-[80vw]'>
                    <DialogHeader>
                        <DialogTitle>
                            <PiLegoFill size={40} />
                        </DialogTitle>
                    </DialogHeader>
                    <MDEditor.Markdown
                        wrapperElement={{
                            "data-color-mode": "light"
                        }}
                        source={answer}
                        className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll'
                    />
                    <Button type='button' onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogContent>
            </Dialog> */}
            <div >
                <div className='flex gap-2'>
                    <Avatar>
                        <AvatarImage src={`${user?.imageurl}`} />
                    </Avatar>

                    <div className="flex items-center gap-5">
                        {question ? (
                            <h1 className="font-medium text-3xl">{question}</h1>
                        ) : (
                            <div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
                                <FlipWords words={words} />
                            </div>
                        )}
                        {answer && (
                            <Button
                                disabled={saveAnswer.isPending}
                                className="bg-gray-200 shadow-none text-black hover:bg-slate-100"
                                onClick={() => {
                                    saveAnswer.mutate({
                                        projectId: project!.id,
                                        question,
                                        answer,
                                        filesReferences
                                    }, {
                                        onSuccess: () => {
                                            toast.success('Réponse sauvegardée !')
                                            refetch();
                                        },
                                        onError: () => {
                                            toast.error('Erreur lors de la sauvegarde de la réponse')
                                        }
                                    })
                                }}
                            >
                                <Bookmark />
                            </Button>
                        )}
                    </div>
                </div>
                <div className='h-4'></div>
                <MDEditor.Markdown
                    wrapperElement={{ "data-color-mode": "light" }}
                    source={answer}
                    style={{ fontSize: "18px", lineHeight: "1.6", color: "#333", backgroundColor: "transparent" }}
                />

                <div className='h-4'></div>
                <CodeReference filesReferences={filesReferences} />
            </div>
            <div className='h-24'></div>

            <div className="fixed bottom-8 z-50">
                <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onSubmit={onSubmit}
                />
            </div>
            {/* <form onSubmit={onSubmit}>
                        <Textarea placeholder='Quel fichier dois-je modifier pour edit la home page ?' value={question} onChange={e => setQuestion(e.target.value)} />
                     
                        <div className='h-4'></div>
                        <div className='flex gap-4'>
                            <Button className="bg-emerald-900" type='submit' disabled={isLoading}>
                                Demander à Touca
                            </Button>

                        </div>
                    </form> */}

        </>
    )
}

export default AskQuestionCard