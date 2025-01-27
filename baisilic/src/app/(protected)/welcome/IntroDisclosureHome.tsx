"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Book, ChevronDownIcon, DatabaseIcon, Play, Plus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "~/lib/utils"
import IntroDisclosure from "~/components/ui/IntroDisclosure"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import { Button } from "~/components/ui/button"
import { useUser } from "@clerk/nextjs"
import SkeletonLoader from "~/components/ui/skeleton-loader"
import { Avatar, AvatarImage } from "~/components/ui/avatar"
import Link from "next/link"
import Banner from "~/components/ui/banner"
import { api } from "~/trpc/server"
import useUserDb from "~/hooks/use-user"
import { ChartCredits } from "~/components/ui/chart-credits"


const steps = [
    {
        title: "Bienvenue sur ToucaML",
        short_description: "Discover our modern component library",
        full_description:
            "Welcome to Cult UI! Let's explore how our beautifully crafted components can help you build stunning user interfaces with ease.",
        media: {
            type: "image" as const,
            src: "/learn-step-1.png",
            alt: "Cult UI components overview",
        },
    },
    {
        title: "Customizable Components",
        short_description: "Style and adapt to your needs",
        full_description:
            "Every component is built with customization in mind. Use our powerful theming system with Tailwind CSS to match your brand perfectly.",
        media: {
            type: "image" as const,
            src: "/feature-2.png",
            alt: "Component customization interface",
        },
        action: {
            label: "View Theme Builder",
            href: "/docs/theming",
        },
    },
    {
        title: "Responsive & Accessible",
        short_description: "Built for everyone",
        full_description:
            "All components are fully responsive and follow WAI-ARIA guidelines, ensuring your application works seamlessly across all devices and is accessible to everyone.",
        media: {
            type: "image" as const,

            src: "/feature-1.png",
            alt: "Responsive design demonstration",
        },
    },
    {
        title: "Start Building",
        short_description: "Create your next project",
        full_description:
            "You're ready to start building! Check out our comprehensive documentation and component examples to create your next amazing project.",
        action: {
            label: "Créer votre projet",
            href: "/docs/components",
        },
    },
]

type StorageState = {
    desktop: string | null
    mobile: string | null
}

export function IntroDisclosureHome() {
    const router = useRouter()
    const [open, setOpen] = useState(true)
    const [openMobile, setOpenMobile] = useState(true)
    const [debugOpen, setDebugOpen] = useState(false)
    const [storageState, setStorageState] = useState<StorageState>({
        desktop: null,
        mobile: null,
    })

    const updateStorageState = () => {
        setStorageState({
            desktop: localStorage.getItem("feature_intro-demo"),
            mobile: localStorage.getItem("feature_intro-demo-mobile"),
        })
    }

    // Update storage state whenever localStorage changes
    useEffect(() => {
        updateStorageState()
        window.addEventListener("storage", updateStorageState)
        return () => window.removeEventListener("storage", updateStorageState)
    }, [])

    // Update storage state after reset
    const handleReset = () => {
        // localStorage.removeItem("feature_intro-demo")
        setOpen(true)
        if (storageState.desktop === "false") {
            toast.info("Clear the local storage to trigger the feature again")
            setDebugOpen(true)
        }
        if (storageState.desktop === null) {
            updateStorageState()
        }
    }

    // const handleResetMobile = () => {
    //     // localStorage.removeItem("feature_intro-demo-mobile")
    //     setOpenMobile(true)
    //     updateStorageState()
    // }

    // const handleClearDesktop = () => {
    //     localStorage.removeItem("feature_intro-demo")
    //     updateStorageState()
    //     router.refresh()
    //     toast.success("Desktop storage cleared")
    // }

    // const handleClearMobile = () => {
    //     localStorage.removeItem("feature_intro-demo-mobile")
    //     updateStorageState()
    //     router.refresh()
    //     toast.success("Mobile storage cleared")
    // }

    // const handleDebugOpenChange = (open: boolean) => {
    //     if (open) {
    //         updateStorageState()
    //     }
    //     setDebugOpen(open)
    // }

    const { user } = useUserDb()

    return (
        <div className="w-full space-y-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">

                    <div className="gap-4 flex mb-5">
                        <Avatar>
                            <AvatarImage src={`${user?.imageurl}`} />
                        </Avatar>
                        <h1 className="text-3xl">
                            Bonjour {user?.firstName || 'User'} ravi de vous revoir
                        </h1>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Découvrez tout ce que vous pouvez faire sur ToucaML
                    </p>
                    <Banner title={"Il vous reste"} description={`${user?.credits} tokens`} buttonText={"Obtenez en plus ici"} buttonLink={"/billing"} alignment="left" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 pt-0">
                    <div className="flex flex-col">
                        <div
                            className={cn(
                                "flex flex-col gap-6 rounded-lg bg-muted/50 border-2 p-6 transition-colors",
                                !open && "border-muted bg-muted/50",
                                open && "border-primary"
                            )}
                        >
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="flex   flex-col">
                                    <p className="text-sm text-muted-foreground text-left">
                                        (Development)
                                    </p>
                                    <h3 className="text-xl font-semibold">Créer un nouveau projet</h3>
                                </div>
                                <Link href={'/create'}>
                                    <Button className="w-fit  bg-emerald-900 text-white shadow-none hover:bg-[#BEB4FD] hover:text-emerald-900">
                                        <Plus />
                                        Create Project
                                    </Button>
                                </Link>
                                {/* <button
                                    onClick={handleReset}
                                    className="inline-flex items-center justify-center rounded-full bg-emerald-900 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <Play className="mr-2 h-4 w-4" />
                                    Start Demo
                                </button> */}
                            </div>
                            <IntroDisclosure
                                open={open}
                                setOpen={setOpen}
                                steps={steps}
                                featureId="intro-demo"
                                showProgressBar={false}
                                onComplete={() => toast.success("Tour completed")}
                                onSkip={() => toast.info("Tour skipped")}
                            />
                            <div className="text-sm text-muted-foreground">
                                Status:
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div
                            className={cn(
                                "flex flex-col gap-6 rounded-lg border-2 p-6 transition-colors",
                                !openMobile && "border-muted bg-muted/50",
                                openMobile && "border-primary"
                            )}
                        >
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="flex  flex-col">
                                    <p className="text-sm text-muted-foreground">
                                        (Tuto)
                                    </p>
                                    <h3 className="text-xl font-semibold">Comment utiliser ?</h3>
                                </div>
                                <Link href={'/learn'}>
                                    <Button className="w-fit hover:bg-emerald-900 hover:text-white shadow-none bg-[#BEB4FD] text-emerald-900">
                                        <Book />
                                        Apprendre ToucaML
                                    </Button>
                                </Link>
                            </div>
                            <IntroDisclosure
                                open={openMobile}
                                setOpen={setOpenMobile}
                                steps={steps}
                                featureId="intro-demo-mobile"
                                onComplete={() => toast.success("Mobile tour completed")}
                                onSkip={() => toast.info("Mobile tour skipped")}
                                forceVariant="mobile"
                            />
                            <div className="text-sm text-muted-foreground">
                                Status:
                            </div>
                        </div>
                    </div>
                    {/* <ChartCredits /> */}
                </div>
            </div>
        </div>
    )
}


export default IntroDisclosureHome