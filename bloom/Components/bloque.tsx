"use client"
import React from "react"

interface BloqueProps {
    name: string;
}

const Bloque: React.FC<BloqueProps> = (props) => {
    return (
        <div>
            <h2 className="">
                {props.name}
            </h2>
        </div>
    )
}

export default Bloque;