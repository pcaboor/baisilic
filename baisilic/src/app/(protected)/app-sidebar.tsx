'use client'

import { Bot, CreditCard, LayoutDashboard, Plus, Presentation, Pyramid } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar"
import useProject from "~/hooks/use-project"
import { cn } from "~/lib/utils"
import { PiLegoFill } from "react-icons/pi";
import { FaBrain, FaFolder, FaFolderOpen } from "react-icons/fa";

const items = [
    {
        title: "Playground",
        url: '/dashboard',
        icon: FaBrain
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

                    <PiLegoFill size={40} />
                    {open && (
                        <h1 className="text-2xl font-bold text-primary/80">
                            Baisilic
                        </h1>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} className={cn({
                                                '!bg-purple-100 !text-black font-medium': pathname === item.url
                                            }, 'list-none')} >
                                                <item.icon />

                                                <span className="text-base font-medium">{item.title}</span>
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
                                const isSelected = project.id === projectId;
                                return (
                                    <SidebarMenuItem key={project.name}>
                                        <SidebarMenuButton asChild>

                                            <div onClick={() => {
                                                setProjectId(project.id)
                                            }}>

                                                <div className={cn(
                                                    'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary', {
                                                    'bg-primary text-white': project.id === projectId
                                                }
                                                )}>
                                                    {project.name[0]}
                                                </div>

                                                {isSelected ? (
                                                    <FaFolderOpen color="blue" />
                                                ) : (
                                                    <FaFolder color="blue" />
                                                )}
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
                                        <Button className="w-fit">
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