"use client"

import { ChartNoAxesGantt, GraduationCap } from "lucide-react";
import useUserDb from "~/hooks/use-user"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import useProject from "~/hooks/use-project";
import Link from "next/link";
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import ArchiveButton from "../dashboard/archive-button";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

const ProjectSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <Card className="rounded-lg shadow-none">
            <CardHeader className="bg-muted p-3">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="p-3">
                <Skeleton className="h-4 w-full mb-2" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const LearningSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <Card className="rounded-lg shadow-none">
            <CardHeader className="bg-muted p-3">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="p-0">
                <Skeleton className="h-40 w-full rounded-b-lg" />
            </CardContent>
        </Card>
    </motion.div>
);

export function Welcome() {
    const { user, isLoading: isUserLoading } = useUserDb()
    const { projects, setProjectId } = useProject()
    const { isLoading: isProjectsLoading } = api.project.getProjects.useQuery(undefined, {
        initialData: projects
    })
    const [showAlert, setShowAlert] = useState(false);

    const handleSelectProject = (projectId: string) => {
        setProjectId(projectId);
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 1000);
    };

    const items = [
        {
            id: "1",
            title: "What makes Origin UI different?",
            content: "Origin UI focuses on developer experience and performance. Built with TypeScript, it offers excellent type safety, follows accessibility standards, and provides comprehensive documentation with regular updates.",
            img: "https://i.pinimg.com/736x/76/73/69/767369c68af2202bad42ada679885946.jpg",
        },
    ]

    console.log(projects)

    const isLoading = isUserLoading || isProjectsLoading;

    return (
        <div className="w-full">
            {showAlert && (
                <AlertDialog open={true}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex gap-2 items-center text-sm text-neutral-600">
                                Basculement vers le projet <Spinner size="sm" />
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            <div className="rounded-lg text-card-foreground">
                <div className="p-4">

                    <div className="mb-5">
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Skeleton className="h-10 w-2/3 mb-10" />
                            </motion.div>
                        ) : (
                            <h1 className="text-3xl font-semibold text-neutral-600 mb-10">
                                Bonjour {user?.firstName || 'User'} ravi de vous revoir
                            </h1>
                        )}

                        <p className="text-sm text-neutral-400 font-semibold flex gap-1 items-center">
                            <ChartNoAxesGantt size={20} />
                            Vos projets
                        </p>
                        <div className="h-4"></div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {isLoading ? (
                                    Array(3).fill(0).map((_, index) => (
                                        <ProjectSkeleton key={index} />
                                    ))
                                ) : projects?.length ? (
                                    projects.map((project) => (
                                        <Card
                                            key={project.id}
                                            className="rounded-lg shadow-none cursor-pointer hover:shadow-lg transition-all duration-200"
                                            onClick={() => handleSelectProject(project.id)}
                                        >
                                            <CardHeader className="bg-muted text-neutral-600 p-3 font-medium flex">
                                                <ChartNoAxesGantt />
                                                <span>{project.name}</span>
                                            </CardHeader>
                                            <CardContent className="text-sm p-3">
                                                <Link href={project.githubUrl ?? ""}>
                                                    {project.githubUrl}
                                                </Link>
                                                <div className="h-2"></div>
                                                <div className="text-neutral-400 transition-all duration-200 ease-in-out hover:text-neutral-800">
                                                    Dernières modifs{' '}
                                                    {new Date(project.updatedAt).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                    <br />
                                                    <div className="h-1"></div>
                                                    Créé le{' '}
                                                    {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-sm text-neutral-600">
                                        Vous n'avez pas encore de projet
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="h-6"></div>

                        <p className="text-sm text-neutral-400 font-semibold flex gap-1 items-center">
                            <GraduationCap size={20} />
                            Apprendre à utiliser Singularity
                        </p>
                        <div className="h-4"></div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {isLoading ? (
                                    Array(3).fill(0).map((_, index) => (
                                        <LearningSkeleton key={index} />
                                    ))
                                ) : (
                                    items.map((item) => (
                                        <Link href="/learn" key={item.id}>
                                            <Card className="rounded-lg shadow-none cursor-pointer hover:shadow-lg transition-all duration-200">
                                                <CardHeader className="bg-muted text-neutral-600 p-3 font-medium">
                                                    <GraduationCap />
                                                    <span>{item.title}</span>
                                                </CardHeader>
                                                <CardContent className="p-0">
                                                    <img
                                                        src={item.img}
                                                        alt={item.title}
                                                        className="w-full h-40 object-cover rounded-b-lg"
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome