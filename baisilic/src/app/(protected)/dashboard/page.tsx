'use client'

import { useUser } from '@clerk/nextjs'
import React from 'react'
import useProject from '~/hooks/use-project'

const DashBoard = () => {
    const { project } = useProject()
    return (
        <div>
            <h1>{project?.name}</h1>
        </div>
    )
}
export default DashBoard