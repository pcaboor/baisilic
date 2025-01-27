'use client'

import { motion } from 'framer-motion'
import React from 'react'

const SkeletonLoader = ({ width = '100%', height = '1rem', borderRadius = '0.5rem' }) => {
    return (
        <motion.div
            className="bg-gray-300 overflow-hidden relative"
            style={{
                width,
                height,
                borderRadius,
            }}
            initial={{ backgroundPosition: '-200px' }}
            animate={{ backgroundPosition: '200px' }}
            transition={{
                ease: 'easeInOut',
                duration: 1.5,
                repeat: Infinity,
            }}
        >
            <div
                className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
                style={{
                    backgroundSize: '400% 100%',
                }}
            />
        </motion.div>
    )
}

export default SkeletonLoader
