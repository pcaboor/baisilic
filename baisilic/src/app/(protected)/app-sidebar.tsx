'use client'

import { Bird, Book, ChevronDownIcon, CircleHelp, CircleUserRound, Clock, Cloud, CreditCard, GitGraph, Github, GithubIcon, Home, House, Keyboard, LifeBuoy, LogOut, Mail, MessageCircle, MessageSquare, Plus, PlusCircle, ScanFace, Settings, Settings2, Sparkles, SquareDashedMousePointer, Trash2, UserPlus, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar"
import useProject from "~/hooks/use-project"
import { cn } from "~/lib/utils"
import useUserDb from "~/hooks/use-user"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

const home = [
    { title: "Touca de", url: '/welcome', icon: CircleUserRound },
]

const items = [
    { title: "Accueil", url: '/welcome', icon: House },
    { title: "Billing", url: '/billing', icon: CreditCard }
]

const footer = [
    { title: "Inviter des collaborateurs", url: '/welcome', icon: UserPlus },
]



export function AppSidebar() {
    const pathname = usePathname()
    const { open } = useSidebar()
    const { projects, projectId, setProjectId } = useProject()
    const { user } = useUserDb();

    const projectTools = [
        { title: "IA de Singularity", url: `/dashboard`, icon: ScanFace },
        { title: "Tous les commits", url: `/commits`, icon: GitGraph },
        { title: "Conversations", url: '/qa', icon: MessageCircle },
        { title: "Aide", url: '/learn', icon: CircleHelp },
        { title: "Corbeille", url: '/trash', icon: Trash2 },
        { title: "Paramètres", url: '/settings', icon: Settings2 }
    ]


    return (
        <TooltipProvider>
            <Sidebar collapsible="icon" variant="floating" className="p-0 shadow-none rounded-none ">
                <SidebarContent className="shadow-none bg-muted">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {home.map(home => (
                                    <SidebarMenuItem key={home.title} className="flex items-center justify-between">
                                        <DropdownMenu >
                                            <DropdownMenuTrigger asChild>
                                                <div className={cn(
                                                    { '!bg-gray-red !text-black font-medium': pathname === home.url },
                                                    'list-none [&>svg]:size-5 flex items-center gap-2 p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-neutral-200 cursor-pointer'
                                                )}>
                                                    <home.icon className="text-neutral-500" />
                                                    <span className="text-base font-medium text-neutral-500">
                                                        {home.title} {user?.firstName}
                                                    </span>
                                                    <ChevronDownIcon />
                                                </div>
                                            </DropdownMenuTrigger>
                                            {/* 🔽 Menu déroulant */}
                                            < DropdownMenuContent className="ml-5 w-72 text-2xl" >
                                                {projects?.map(project => (
                                                    <div
                                                        key={project.id}
                                                        onClick={() => setProjectId(project.id)}
                                                        className="flex items-center gap-2 rounded-md transition-all duration-200 ease-in-out hover:bg-neutral-300 cursor-pointer"
                                                    >
                                                        <DropdownMenuItem>
                                                            <div className={cn(
                                                                'rounded-sm size-6 flex items-center justify-center text-sm bg-white text-primary transition-all duration-200 ease-in-out',
                                                                {
                                                                    'bg-neutral-400 text-neutral-100': project.id === projectId,

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
                                                        { '!bg-neutral-200 !text-black font-medium': pathname === item.url },
                                                        'list-none [&>svg]:size-5 flex items-center gap-2 p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-neutral-300'
                                                    )}>
                                                        <item.icon className="text-neutral-500" />
                                                        <span className="text-base font-medium text-neutral-500">{item.title}</span>
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
                            Gestion de projet
                        </SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                {projectTools.map(item => (
                                    <SidebarMenuItem key={item.title}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link href={item.url} className={cn(
                                                        { '!bg-neutral-200 !text-black font-medium': pathname === item.url },
                                                        'list-none [&>svg]:size-5 flex items-center gap-2 p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-neutral-300'
                                                    )}>
                                                        <item.icon className="text-neutral-500" />
                                                        <span className="text-base font-medium text-neutral-500">{item.title}</span>
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
                            Créer un projet
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Link href={'/onboarding'}>
                                        <Plus
                                            size={17}
                                            className="rounded transition-all duration-200 ease-in-out hover:bg-neutral-100 hover:scale-110"
                                        />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>Créer un projet</TooltipContent>
                            </Tooltip>
                        </SidebarGroupLabel>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="bg-muted mb-4">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {footer.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.url} className={cn(
                                                    { '!bg-neutral-200 !text-black font-medium': pathname === item.url },
                                                    'list-none [&>svg]:size-5 flex items-center gap-2 p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-neutral-300'
                                                )}>
                                                    <item.icon className="text-neutral-500" />
                                                    <span className="text-base font-medium text-neutral-500">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </TooltipTrigger>
                                        {/* <TooltipContent>{item.title}</TooltipContent> */}
                                    </Tooltip>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider >
    )
}
