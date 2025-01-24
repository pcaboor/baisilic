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


const AskQuestionCard = () => {
    const { project } = useProject();
    const [open, setOpen] = React.useState(false)
    const [question, setQuestion] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false)
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([])
    const [answer, setAnswer] = React.useState('')

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('')
        setFilesReferences([])
        e.preventDefault();
        if (!project?.id) return;
        setIsLoading(true)

        const { output, filesReferences } = await askQuestion(question, project.id)
        // setOpen(true);
        setFilesReferences(filesReferences)

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta)
            }
        }
        setIsLoading(false)
    }

    return (

        <>
            <Dialog open={open} onOpenChange={setOpen}>
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
            </Dialog>

            <Card className='relative col-span-3'>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                </CardHeader>
                <div className='px-10 my-5'>
                    <MDEditor.Markdown
                        wrapperElement={{
                            "data-color-mode": "light"
                        }}
                        source={answer}
                        className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll'
                    />
                    <div className='h-4'></div>
                    <CodeReference filesReferences={filesReferences} />
                </div>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea placeholder='Quel fichier dois-je modifier pour edit la home page ?' value={question} onChange={e => setQuestion(e.target.value)} />
                        <div className='h-4'>
                        </div>
                        <Button type='submit' disabled={isLoading}>
                            Ask to Baisilic
                        </Button>
                    </form>

                </CardContent>
            </Card>

        </>
    )
}

export default AskQuestionCard