'use client'

import { Book, Clock, Cloud, CreditCard, Github, Home, Keyboard, LifeBuoy, LogOut, Mail, MessageSquare, Plus, PlusCircle, Settings, SquareDashedMousePointer, User, UserPlus, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar"
import useProject from "~/hooks/use-project"
import { cn } from "~/lib/utils"
import { useUser } from "@clerk/nextjs"
import useUserDb from "~/hooks/use-user"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "~/components/ui/avatar"

const home = [
    { title: "Touca de", url: '/welcome', icon: Home },
]

const items = [
    { title: "Playground", url: '/dashboard', icon: SquareDashedMousePointer },
    { title: "Documentation", url: '/learn', icon: Book },
    { title: "Historique", url: '/qa', icon: Clock },
    { title: "Billing", url: '/billing', icon: CreditCard }
]

export function AppSidebar() {
    const pathname = usePathname()
    const { open } = useSidebar()
    const { projects, projectId, setProjectId } = useProject()
    const { user } = useUserDb();

    return (
        <TooltipProvider>
            <Sidebar collapsible="icon" variant="floating">
                <SidebarHeader />
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {home.map(home => (
                                    <SidebarMenuItem key={home.title}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <SidebarMenuButton className="w-full">
                                                    <div className={cn(
                                                        { '!bg-gray-red !text-black font-medium': pathname === home.url },
                                                        'list-none [&>svg]:size-5 flex items-center gap-2 p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-neutral-200 cursor-pointer'
                                                    )}>
                                                        <home.icon className="text-neutral-400" />
                                                        <span className="text-base font-medium text-neutral-600">
                                                            {home.title} {user?.firstName}
                                                        </span>
                                                    </div>
                                                </SidebarMenuButton>
                                            </DropdownMenuTrigger>

                                            {/* 🔽 Menu déroulant */}
                                            <DropdownMenuContent className="ml-5 w-72 text-2xl">
                                                {projects?.map(project => (
                                                    <div
                                                        onClick={() => setProjectId(project.id)}
                                                        className="flex items-center gap-2 p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-neutral-200 cursor-pointer"
                                                    >
                                                        <DropdownMenuItem>
                                                            <div className={cn(
                                                                'rounded-sm size-6 flex items-center justify-center text-sm bg-white text-primary transition-all duration-200 ease-in-out',
                                                                {
                                                                    'bg-neutral-400 text-neutral-100': project.id === projectId,
                                                                    'hover:bg-neutral-300 hover:text-neutral-800': project.id !== projectId
                                                                }
                                                            )}>
                                                                {project.name[0]}
                                                            </div>
                                                            <span className="font-medium text-neutral-600 transition-all duration-200 ease-in-out hover:text-neutral-800">
                                                                {project.name}
                                                            </span>
                                                        </DropdownMenuItem>
                                                    </div>
                                                ))}
                                                <DropdownMenuGroup >

                                                    <DropdownMenuItem>
                                                        <CreditCard />
                                                        <span>Facturation</span>
                                                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Settings />
                                                        <span>Paramètres</span>
                                                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Keyboard />
                                                        <span>Raccourcis clavier</span>
                                                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem>
                                                        <Users />
                                                        <span>Équipe</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger>
                                                            <UserPlus />
                                                            <span>Inviter des utilisateurs</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuPortal>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuItem>
                                                                    <Mail />
                                                                    <span>Email</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <MessageSquare />
                                                                    <span>Message</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem>
                                                                    <PlusCircle />
                                                                    <span>Autres...</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuPortal>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuItem>
                                                        <Plus />
                                                        <span>Nouvelle équipe</span>
                                                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <Github />
                                                    <span>GitHub</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <LifeBuoy />
                                                    <span>Support</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem disabled>
                                                    <Cloud />
                                                    <span>API</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <LogOut />
                                                    <span>Déconnexion</span>
                                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>


                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map(item => (
                                    <SidebarMenuItem key={item.title}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link href={item.url} className={cn(
                                                        { '!bg-neutral-100 !text-black font-medium': pathname === item.url },
                                                        'list-none [&>svg]:size-5 flex items-center gap-2 p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-neutral-200'
                                                    )}>
                                                        <item.icon className="text-neutral-400" />
                                                        <span className="text-base font-medium text-neutral-600">{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            {/* <TooltipContent>{item.title}</TooltipContent> */}
                                        </Tooltip>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-sm font-semibold text-neutral-400 justify-between flex">
                            Projets
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Link href={'/create'}>
                                        <Plus
                                            size={17}
                                            className="rounded transition-all duration-200 ease-in-out hover:bg-neutral-100 hover:scale-110"
                                        />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>Créer un projet</TooltipContent>
                            </Tooltip>
                        </SidebarGroupLabel>

                        {/* <SidebarGroupContent>
                            <SidebarMenu>
                                {projects?.map(project => (
                                    <SidebarMenuItem key={project.name}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <div
                                                        onClick={() => setProjectId(project.id)}
                                                        className="flex items-center gap-2 p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-neutral-200 cursor-pointer"
                                                    >
                                                        <div className={cn(
                                                            'rounded-sm size-6 flex items-center justify-center text-sm bg-white text-primary transition-all duration-200 ease-in-out',
                                                            {
                                                                'bg-neutral-400 text-neutral-100': project.id === projectId,
                                                                'hover:bg-neutral-300 hover:text-neutral-800': project.id !== projectId
                                                            }
                                                        )}>
                                                            {project.name[0]}
                                                        </div>
                                                        <span className="text-base font-medium text-neutral-600 transition-all duration-200 ease-in-out hover:text-neutral-800">
                                                            {project.name}
                                                        </span>
                                                    </div>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent>{project.name}</TooltipContent> 
                                        </Tooltip>
                                    </SidebarMenuItem>
                                ))}
                                {open && (
                                    <SidebarMenuItem>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={'/create'}>
                                                    <Button className="w-fit bg-emerald-900 flex items-center gap-2">
                                                        <Plus />
                                                        Create Project
                                                    </Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>Créer un projet</TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent> */}
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </TooltipProvider >
    )
}
