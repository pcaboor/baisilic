'use client'

import { Book, Bot, Clock, CreditCard, Home, Plus, Presentation, SquareDashedMousePointer } from "lucide-react"
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
        title: "Documentation",
        url: '/learn',
        icon: Book
    },
    {
        title: "Historique",
        url: '/qa',
        icon: Clock
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
                <div className="flex gap-2 items-center p-3">
                    <img src="toucaml.png" className="h-10" />
                    {open && (
                        <h1 className="text-xl text-emerald-900 font-medium">
                            ToucaML
                        </h1>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent className="space-y-1"> {/* Added space between main sections */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1"> {/* Added space between menu items */}
                            {home.map(home => {
                                return (
                                    <SidebarMenuItem key={home.title} className="py-1"> {/* Added vertical padding */}
                                        <SidebarMenuButton asChild>
                                            <Link href={home.url} className={cn({
                                                '!bg-gray-100 !text-black font-medium': pathname === home.url
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
                    <SidebarGroupLabel className="mb-2"> {/* Increased margin bottom */}
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1"> {/* Added space between menu items */}
                            {items.map(item => {
                                return (
                                    <SidebarMenuItem key={item.title} className="py-1"> {/* Added vertical padding */}
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} className={cn({
                                                '!bg-gray-100 !text-black font-medium': pathname === item.url
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
                    <SidebarGroupLabel className="mb-4"> {/* Increased margin bottom */}
                        Your project
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-3"> {/* Added space between menu items */}
                            {projects?.map(project => {
                                return (
                                    <SidebarMenuItem key={project.name} className="py-1"> {/* Added vertical padding */}
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
                            <div className="h-4"></div> {/* Increased spacing before button */}
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