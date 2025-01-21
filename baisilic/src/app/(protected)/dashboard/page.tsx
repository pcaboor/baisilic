'use client'

import { useUser } from '@clerk/nextjs'
import React from 'react'

const DashBoard = () => {
    const { user } = useUser()
    return (
        <div></div>
    )
}
export default DashBoard