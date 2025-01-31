'use client'
import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react'
import AskQuestionCard from '../dashboard/ask-question-card'
import MDEditor from '@uiw/react-md-editor'
import CodeReference from '../dashboard/code-reference'
import { Avatar, AvatarImage } from '~/components/ui/avatar'

const QAPage = () => {
    const { projectId } = useProject()
    const { data: questions } = api.project.getQuestions.useQuery({ projectId })
    const [questionIndex, setQuestionIndex] = React.useState(0)
    const question = questions?.[questionIndex]

    return (
        <Sheet>
            {/* <AskQuestionCard /> */}
            <div className='h-4'></div>
            <h1 className='text-xl font-semibold'>Discussions sauvegardée</h1>
            <div className='h-2'></div>
            <div className='flex flex-col gap-2'>
                {questions?.map((questions, index) => {
                    return <React.Fragment key={questions.id}>
                        <SheetTrigger onClick={() => setQuestionIndex(index)}>
                            <div className='flex item-center gap-4 bg-white rounded-lg p-4 border'>
                                <Avatar>
                                    <AvatarImage src={question?.user.imageurl ?? ""} />
                                </Avatar>
                                <div className='text-left flex flex-col'>
                                    <div className='flex items-center gap-2'>
                                        <p className='text-gray-700 line-clamp-1 text-lg font-medium'>
                                            {question?.question}
                                        </p>
                                        <span className='text-xs text-gray-400 whitespace-nowrap'>
                                            {question?.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className='text-gray-500 line-clamp-1 text-sm'>
                                        {question?.answer}
                                    </p>
                                </div>
                            </div>
                        </SheetTrigger>
                    </React.Fragment>
                })}
            </div>
            {question && (
                <SheetContent className='sm:max-w-[80vw]'>
                    <SheetHeader>
                        <SheetTitle>
                            {question.question}
                        </SheetTitle>
                        <MDEditor.Markdown source={question.answer} />
                        <CodeReference filesReferences={(question.fileReference ?? []) as any} />
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    )
}

export default QAPage