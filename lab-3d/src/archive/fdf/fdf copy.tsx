import React, { useState } from 'react'

import { Circle, Line, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';


type MyVect3d = [number, number, number];

const BASE_TTL = 25;

const DataFdf = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
];

// transform to pts
const ptsList: MyVect3d[] = [];

for (let z = 0; z < DataFdf.length; z++) {
    for (let x = 0; x < DataFdf[z].length; x++) {
        let height: number = DataFdf[z][x];
        let newPts: MyVect3d = [x, height, -z];
        ptsList.push(newPts);
    }
}

/*
** describe step incr for each pts
*/
interface IPointAnim {
    stepLerp: MyVect3d[];
    ttl: number; // number ttl operation, decr each time when it s 0
}

// The X axis is red. The Y axis is green. The Z axis is blue. 
const Fdf = () => {

    const terrainGeometry = React.useMemo(() => {
        const positions = new Float32Array(ptsList.length * 3);
        for (let i = 0; i < ptsList.length; i++) {
            positions[i * 3] = ptsList[i][0]; // x
            positions[i * 3 + 1] = ptsList[i][1]; // y
            positions[i * 3 + 2] = ptsList[i][2]; // z
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geometry;
    }, [ptsList]);

    return (
        <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
            <Canvas camera={{ position: [-0.5, 1, 2] }} shadows>
                <directionalLight
                    position={[3.3, 1.0, 4.4]}
                    castShadow
                    intensity={Math.PI * 2}
                />

                <mesh visible userData={{ hello: 'world' }} position={[2, 0, -10]}>
                    <sphereGeometry />
                    <meshStandardMaterial color="hotpink" transparent />
                </mesh>

                <mesh geometry={terrainGeometry}>
                    <meshBasicMaterial color={0x00ff00} wireframe={true} />
                </mesh>


                <OrbitControls target={[0, 1, 0]} />
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    )
}

export default Fdf;