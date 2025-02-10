'use client'

import React, { useEffect, useState } from 'react'
import AskQuestionCard from './ask-question-card'
import AskQuestionCardSkeleton from './ask-question-skeleton'

const DashBoard = () => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulation de chargement (remplace par une logique réelle si nécessaire)
        setTimeout(() => setIsLoading(false), 500)
    }, [])

    return (
        <div className="flex items-center">
            <div className="w-full max-w-4xl mx-auto p-6">
                {isLoading ? (
                    <div>
                        <AskQuestionCardSkeleton />
                    </div>

                ) : (
                    <div>
                        <AskQuestionCard />
                    </div>
                )}
            </div>
        </div>
    )
}

export default DashBoard
