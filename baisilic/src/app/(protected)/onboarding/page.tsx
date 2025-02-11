'use client'

import React, { useState } from 'react'
import AskQuestionCardSkeleton from '../dashboard/ask-question-skeleton'
import CreateProjectContainer from './details'

const CreatePage = () => {
    const [isLoading] = useState<boolean>(false);
    return (
        <div className="flex items-center">
            <div className="w-full max-w-4xl mx-auto p-6">
                {isLoading ? (
                    <div>
                        <AskQuestionCardSkeleton />
                    </div>
                ) : (
                    <div>
                        <CreateProjectContainer />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreatePage
