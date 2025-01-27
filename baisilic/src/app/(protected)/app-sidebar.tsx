'use client'

import { Book, Bot, CreditCard, Home, Plus, Presentation, SquareDashedMousePointer } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar"
import useProject from "~/hooks/use-project"
import { cn } from "~/lib/utils"
import { FaFolder, FaFolderOpen } from "react-icons/fa";


const home = [
    {
        title: "Accueil",
        url: '/welcome',
        icon: Home
    },
]
const items = [
    {
        title: "Playground",
        url: '/dashboard',
        icon: SquareDashedMousePointer
    },
    {
        title: "Learn",
        url: '/learn',
        icon: Book
    },
    {
        title: "Q&A",
        url: '/qa',
        icon: Bot
    }
    , {
        title: "Meetings",
        url: '/meetings',
        icon: Presentation
    },
    {
        title: "Billing",
        url: '/billing',
        icon: CreditCard
    }
]

export function AppSidebar() {

    const pathname = usePathname()
    const { open } = useSidebar()
    const { projects, projectId, setProjectId } = useProject()

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="flex gap-2 items-center p-1">
                    {/* TODOO Logo */}
                    <img src="toucaml.png" className="h-10" />

                    {/* <PiLegoFill size={40} /> */}
                    {open && (
                        <h1 className="text-xl text-emerald-900 font-medium">
                            ToucaML
                        </h1>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {/* <SidebarGroupLabel className="my">
                        Application
                    </SidebarGroupLabel> */}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {home.map(home => {
                                return (
                                    <SidebarMenuItem key={home.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={home.url} className={cn({
                                                '!bg-gray-200 !text-black font-medium': pathname === home.url
                                            }, 'list-none [&>svg]:size-5')} >
                                                <home.icon />
                                                <span className="text-sm font-medium">{home.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="my">
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} className={cn({
                                                '!bg-gray-200 !text-black font-medium': pathname === item.url
                                            }, 'list-none [&>svg]:size-5')} >
                                                <item.icon />
                                                <span className="text-sm font-medium">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Your project
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map(project => {
                                // const isSelected = project.id === projectId;
                                return (
                                    <SidebarMenuItem key={project.name}>
                                        <SidebarMenuButton asChild>

                                            <div onClick={() => {
                                                setProjectId(project.id)
                                            }}>

                                                <div className={cn(
                                                    'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary', {
                                                    'bg-emerald-900 text-white': project.id === projectId
                                                }
                                                )}>
                                                    {project.name[0]}
                                                </div>


                                                <span className="text-base">{project.name}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                            <div className="h-2"></div>
                            {open && (
                                <SidebarMenuItem>
                                    <Link href={'/create'}>
                                        <Button className="w-fit bg-emerald-900">
                                            <Plus />
                                            Create Project
                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}