import React, {useRef} from 'react'

import { createRoot } from 'react-dom/client';
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber';

interface IMeshPosition {
    position : number[];
    color : string;
}

const MeshGen = (props : IMeshPosition) => {
    const ref = useRef();

    useFrame((_, delta) => {
        // @ts-ignore
        ref.current.position.z -= 0.1;
    })

    return <mesh position={props.position} ref={ref}>
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

interface IMeshInitElem {
    id : number;
    pos : [number, number, number];
    color : string;
}

const meshList : IMeshInitElem[] = [
    {
        id : 0,
        pos : [-1,-1,-2],
        color : "green"
    },
    {
        id : 1,
        pos : [1,-1,-2],
        color : "red"
    },
    {
        id : 2,
        pos : [1,1,-2],
        color : "yellow"
    },
]

const Scene1 = () => {
    return (
        <div id="canvas-container" style={{width : "100vw", height : "100vh"}}>
            <Canvas>
                <ambientLight intensity={0.1} />
                <directionalLight color="red" position={[0, 0, 5]} />
                {
                    meshList.map(e => <MeshGen
                        key={`mesh-${e.id + ""}`}
                        position={e.pos}
                        color={e.color}
                    />)
                }   
            </Canvas>
        </div>
    )
}

export default Scene1