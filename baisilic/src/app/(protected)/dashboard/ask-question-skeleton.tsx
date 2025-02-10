'use client'

import React from 'react'
import { Skeleton } from '~/components/ui/skeleton'

const AskQuestionCardSkeleton = () => {
    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="space-y-4">
                <Skeleton className="h-10 w-2/3 mb-4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    )
}

export default AskQuestionCardSkeleton
