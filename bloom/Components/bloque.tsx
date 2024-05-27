"use client"
import React from "react"
import { motion } from 'framer-motion';

interface BloqueProps {
    name: string
    exp: string
}

const Bloque: React.FC<BloqueProps> = (props) => {
    return (
        <motion.div drag>
            <h2 className="">{props.name}</h2>
            <span>{props.exp}</span>
        </motion.div>
    )
}

export default Bloque