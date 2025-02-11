import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '~/components/ui/input';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { Highlighter, Lightbulb, MoveRight, User } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '~/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import useProject from '~/hooks/use-project';
import { cn } from '~/lib/utils';
import { useSession } from '@clerk/nextjs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../breadcrumb';

interface QuestionCardProps {
    question: string;
    onClick: (question: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onClick }) => (
    <button
        onClick={() => onClick(question)}
        className="p-4 text-left bg-white rounded-lg border hover:shadow-md transition-shadow"
    >
        <p className="text-sm text-neutral-600">{question}</p>
    </button>
);

const AskQuestionCard: React.FC = () => {
    const router = useRouter();
    const { session } = useSession();
    //const { project } = useProject();
    const [question, setQuestion] = useState('');
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!question.trim()) return; // || !project?.id

        if (session) {
            router.push('/dashboard');
        } else {
            setShowAuthDialog(true);
        }
    };

    const handleCardClick = (question: string) => {
        setQuestion(question);
        if (session) {
            router.push('/dashboard');
        } else {
            setShowAuthDialog(true);
        }
    };

    return (
        <div className="flex flex-col ">
            <div className="flex-grow px-4 pb-5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl "
                >
                    <h1 className="text-5xl font-semibold mb-6 text-neutral-800 ">
                        L'IA entrainée uniquement pour <span className='italic font-normal'>vos projets</span> IT
                    </h1>
                    <div className='h-3'></div>
                    <p className="text-sm text-neutral-400 font-semibold flex gap-1 items-center">
                        <User size={20} />
                        Vous pourriez poser ce types de questions sur votre projet...
                    </p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        <QuestionCard question="Parles moi de ce projet et de son fonctionnement" onClick={handleCardClick} />
                        <QuestionCard question="Quel est le fichier principal de ce projet ?" onClick={handleCardClick} />
                        <QuestionCard question="Ou modifier la home page dans ce projet ?" onClick={handleCardClick} />
                        <QuestionCard question="Quel language utilisé pour le backend ?" onClick={handleCardClick} />
                        <QuestionCard question="Comment déployer ce projet ?" onClick={handleCardClick} />
                        <QuestionCard question="Comment améliorer la sécurité ?" onClick={handleCardClick} />
                    </div>

                </motion.div>
            </div>

            <div className="w-full px-4">
                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <div className="w-full py-4">
                        <div className="relative w-full mx-auto">
                            <Input
                                placeholder="Que voulez-vous savoir?"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className={cn(
                                    "max-w-xl bg-black/5 rounded-3xl pl-6 pr-16",
                                    "placeholder:text-black/50",
                                    "border-none ring-black/20",
                                    "text-black text-wrap",
                                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "py-[30px]"
                                )}
                            />
                        </div>
                    </div>
                </form>
            </div>

            <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Veuillez vous connecter pour envoyer un message</AlertDialogTitle>
                        <AlertDialogDescription>
                            Pour poser des questions à Singulary, vous devez être connecté.

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction asChild>
                            <Link href="/login">Se connecter</Link>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AskQuestionCard;