import React from 'react'

import { createRoot } from 'react-dom/client';
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber';

type Props = {}

interface IMeshPosition {
    position : number[];
}

const MeshGen = (props : IMeshPosition) => {
    return <mesh position={props.position}>
        <boxGeometry />
        <meshStandardMaterial />
    </mesh>
}

/*
** position :
** x, y, z 
** x : deplacement gauche droite
** y ; deplacement bas haut
** z : deplacement vers moi et loins de moi
*/

const Scene1 = ({ }: Props) => {
    return (
        <div id="canvas-container" style={{width : "100vw", height : "100vh"}}>
            <Canvas>
                <ambientLight intensity={0.1} />
                <directionalLight color="red" position={[0, 0, 5]} />
                <MeshGen
                    position={[1,-1,-2]}
                />
               
            </Canvas>
        </div>
    )
}

export default Scene1