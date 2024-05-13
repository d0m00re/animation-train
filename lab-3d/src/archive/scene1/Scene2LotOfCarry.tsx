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
    id : string;
    pos : [number, number, number];
    color : string;
}

interface IVect3d {
    x : number;
    y : number;
    z : number;
}

interface IGenerateArr {
    startPos : IVect3d;
    endPos : IVect3d;
    lenY : number;
    lenX : number;
    zVariation : number;
}

const generateArr = (props : IGenerateArr) => {
    // calculate increment pos for x and y
    // -10 -10
    let incrX = Math.abs((props.endPos.x - props.startPos.x) / props.lenX);
    let incrY = Math.abs((props.endPos.y - props.startPos.y) / props.lenY);
    let arr : IMeshInitElem[] = [];
    for (let x = 0; x < props.lenX; x++) {
        for (let y = 0; y < props.lenY; y++) {
            arr.push({
                id : `${x}-${y}`,
                color : "green",
                pos : [
                    props.startPos.x + incrX * x,
                    props.startPos.y + incrY * y,
                    props.startPos.z - (Math.random() * props.zVariation)
                ]
            })
        }
    }
    return arr;
}


let meshList : IMeshInitElem[] = generateArr({
    startPos : {x : -100, y : -100, z : -10},
    endPos : {x : 100, y : 100, z : -10},
    lenX : 50,
    lenY : 50,
    zVariation : 100
});

// init lost of pts

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