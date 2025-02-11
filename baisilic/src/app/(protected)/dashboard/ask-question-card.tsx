import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '~/components/ui/input';
import MDEditor from '@uiw/react-md-editor';
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import useProject from '~/hooks/use-project';
import CodeReference from './code-reference';
import { Button } from '~/components/ui/button';
import { Asterisk, Bookmark, BookOpen, ChartNoAxesGantt, Download, Highlighter, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import useRefetch from '~/hooks/use-refetch';
import useUserDb from '~/hooks/use-user';
import { Spinner } from '~/components/ui/spinner';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { cn } from '~/lib/utils';
import QuestionCard from './questionCard';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import Link from 'next/link';


const AskQuestionCard: React.FC = () => {
    const placeholders = [
        "Posez votre question à Singulary...",
        "Que voulez-vous savoir?",
        "Comment puis-je vous aider aujourd'hui?",
    ];
    let minHeight = 52,
        maxHeight = 200;

    const { project } = useProject();
    const [question, setQuestion] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string>('');
    const [filesReferences, setFilesReferences] = useState<{ fileName: string; sourceCode: string; summary: string }[]>([]);
    const [chatState, setChatState] = useState<'initial' | 'asking' | 'answered'>('initial');

    const saveAnswer = api.project.saveAnswer.useMutation();
    const { user } = useUserDb();
    const refetch = useRefetch();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!project?.id || !question.trim()) return;

        // Transition from initial/centered to bottom input
        setChatState('asking');
        setAnswer('');
        setFilesReferences([]);
        setIsLoading(true);

        const { output, filesReferences } = await askQuestion(question, project.id);
        setFilesReferences(filesReferences);

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta);
            }
        }
        setChatState('answered');
        setIsLoading(false);
    };

    const refresh = () => {
        window.location.reload();
    };

    const saveCurrentAnswer = () => {
        saveAnswer.mutate({
            projectId: project!.id,
            question,
            answer,
            filesReferences
        }, {
            onSuccess: () => {
                toast.success('Réponse sauvegardée !');
                refetch();
            },
            onError: () => {
                toast.error('Erreur lors de la sauvegarde de la réponse');
            }
        });
    };

    const handleCardClick = (question: string) => {
        setQuestion(question);
        onSubmit({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>);
    };

    return (
        <div>
            <div className={`flex-grow overflow-auto px-4 pt-8 pb-32 ${chatState === 'initial' ? 'flex items-center justify-center' : ''}`}>
                <AnimatePresence>
                    {chatState === 'initial' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-2xl text-center"
                        >
                            <h1 className="text-4xl font-bold mb-6 text-neutral-500">
                                Bonjour {user?.firstName} travaillons ensemble
                            </h1>
                            <Avatar className='h-20 w-20 mx-auto my-5'>
                                <AvatarImage sizes='xl' src='https://i.pinimg.com/736x/56/71/b8/5671b84e3f89c1f1eb3fbb6ed507b47a.jpg' />
                            </Avatar>
                            <div className='flex gap-2 items-center'>
                                <p className="text-sm text-neutral-400 font-semibold flex gap-1 items-center">
                                    <Highlighter size={20} />
                                    Questions recommandées
                                </p>
                                <p className="text-sm text-blue-400 font-semibold flex gap-1 items-center">
                                    <Popover>
                                        <PopoverTrigger className='flex items-center gap-1'><Lightbulb /> Fonctionnement de Singulary</PopoverTrigger>
                                        <PopoverContent className='text-sm text-neutral-400'>Singulary est entrainé et spécialisé pour votre projet <span className='text-blue-500 font-medium'><Link href={"/learn"}>apprenez à utiliser Singulary ici</Link></span></PopoverContent>
                                    </Popover>
                                </p>
                            </div>
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                                <QuestionCard question="Parles moi de ce projet et de son fonctionnement" onClick={handleCardClick} />
                                <QuestionCard question="Quel est le fichier principal de ce projet ?" onClick={handleCardClick} />
                                <QuestionCard question="Ou modifier la home page dans ce projet ?" onClick={handleCardClick} />
                                <QuestionCard question="Quel language utilisé pour le backend ?" onClick={handleCardClick} />
                                <QuestionCard question="Comment déployer ce projet ?" onClick={handleCardClick} />
                                <QuestionCard question="Comment améliorer la sécurité ?" onClick={handleCardClick} />
                            </div>
                            <div className='mt-5'>
                            </div>

                        </motion.div>
                    )}

                    {(chatState === 'asking' || chatState === 'answered') && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-4xl mx-auto space-y-4"
                        >
                            <div>
                                {answer && (
                                    <div className='py-3 flex items-center gap-2'>
                                        <Button
                                            onClick={saveCurrentAnswer}
                                            disabled={saveAnswer.isPending}
                                            variant={"outline"}
                                            size={'icon'}
                                            className="text-neutral-600 hover:bg-neutral-100 shadow-none"
                                        >
                                            <Download />
                                        </Button>
                                        <Button
                                            onClick={refresh}
                                            variant={"outline"}
                                            size={'icon'}
                                            className="text-neutral-600 hover:bg-neutral-100 shadow-none"
                                        >
                                            <RefreshCw />
                                        </Button>
                                    </div>
                                )}
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
                                    <div className="flex-grow" aria-live="polite">
                                        <MDEditor.Markdown
                                            wrapperElement={{ "data-color-mode": "light" }}
                                            source={answer}
                                            style={{
                                                fontSize: "16px",
                                                lineHeight: "1.6",
                                                color: "#333",
                                                backgroundColor: "transparent"
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            <CodeReference filesReferences={filesReferences} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className={`sticky -bottom-5 left-0 right-0 bg-white border-t py-4 px-4 ${chatState === 'initial' ? 'hidden' : ''}`}>
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
                    <div className={cn("w-full py-4")}>
                        <div className="relative max-w-xl w-full mx-auto">
                            <Input
                                placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className={cn(
                                    "max-w-xl bg-black/5 dark:bg-white/5 rounded-3xl pl-6 pr-16",
                                    "placeholder:text-black/50 dark:placeholder:text-white/50",
                                    "border-none ring-black/20 dark:ring-white/20",
                                    "text-black dark:text-white text-wrap",
                                    "overflow-y-auto resize-none",
                                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "transition-[height] duration-100 ease-out",
                                    "leading-[1.2] py-[40px]",
                                    `min-h-[${minHeight}px]`,
                                    `max-h-[${maxHeight}px]`,
                                    "[&::-webkit-resizer]:hidden",
                                )}
                            />
                        </div>
                    </div>
                </form>
            </div>
            {chatState === 'initial' && (
                <div className="bottom-0 w-full px-4">
                    <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
                        <div className={cn("w-full py-4")}>
                            <div className="relative max-w-xl w-full mx-auto">
                                <Input
                                    placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]}
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className={cn(
                                        "max-w-xl bg-black/5 dark:bg-white/5 rounded-3xl pl-6 pr-16",
                                        "placeholder:text-black/50 dark:placeholder:text-white/50",
                                        "border-none ring-black/20 dark:ring-white/20",
                                        "text-black dark:text-white text-wrap",
                                        "overflow-y-auto resize-none",
                                        "focus-visible:ring-0 focus-visible:ring-offset-0",
                                        "transition-[height] duration-100 ease-out",
                                        "leading-[1.2] py-[40px]",
                                        `min-h-[${minHeight}px]`,
                                        `max-h-[${maxHeight}px]`,
                                        "[&::-webkit-resizer]:hidden",
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AskQuestionCard;
