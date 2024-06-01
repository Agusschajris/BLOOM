"use client"
import React from "react"
import { motion } from 'framer-motion';

interface BloqueProps {
    name: string
    exp: string
}

const Bloque: React.FC<BloqueProps> = (props) => {
    return (
        <motion.div drag >
            <p className="">{props.name}</p>
            <span>{props.exp}</span>
        </motion.div>
    )
}

export default Bloque