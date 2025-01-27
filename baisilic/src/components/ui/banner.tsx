'use client'

import { XMarkIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

interface BannerProps {
    title: string
    description: string
    buttonText: string
    buttonLink: string
    backgroundColor?: string
    textColor?: string
    buttonColor?: string
    onDismiss?: () => void
    alignment?: 'left' | 'center' | 'space-between'  // nouvelle prop
}

export default function Banner({
    title,
    description,
    buttonText,
    buttonLink,
    backgroundColor = 'bg-gray-50',
    textColor = 'text-emerald-900',
    buttonColor = 'bg-emerald-900',
    onDismiss,
    alignment = 'space-between'  // valeur par défaut
}: BannerProps) {
    const [isVisible, setIsVisible] = useState(true)

    const handleDismiss = () => {
        setIsVisible(false)
        onDismiss?.()
    }

    if (!isVisible) return null

    // Définir les classes de conteneur en fonction de l'alignement
    const containerClasses = {
        'left': 'justify-start',
        'center': 'justify-center',
        'space-between': 'justify-between'
    }[alignment]

    // Ajuster la classe flex-1 en fonction de l'alignement
    const dismissButtonClasses = alignment === 'space-between'
        ? "flex flex-1 justify-end"
        : "flex justify-end absolute right-2"

    return (
        <div className={`relative isolate flex  gap-x-6 overflow-hidden ${backgroundColor} px-6 py-2.5 sm:px-3.5 sm:before:flex-1`}>
            <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 w-full ${containerClasses}`}>
                <div className="flex items-center gap-x-4 flex-wrap">
                    <p className={`text-sm/6 ${textColor}`}>
                        <strong className="font-semibold">{title}</strong>
                        <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
                            <circle r={1} cx={1} cy={1} />
                        </svg>
                        {description}
                    </p>
                    <a
                        href={buttonLink}
                        className={`flex-none rounded-full ${buttonColor} px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900`}
                    >
                        {buttonText} <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>
            <div className={dismissButtonClasses}>
                <button
                    type="button"
                    className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
                    onClick={handleDismiss}
                >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon aria-hidden="true" className="size-5 text-gray-900" />
                </button>
            </div>
        </div>
    )
}