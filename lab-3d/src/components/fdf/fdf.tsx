import React, { useState } from 'react'

import { Circle, Line, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';


type MyVect3d = [number, number, number];


const FACTOR_MINIMIZE = 2;
const BASE_TTL = 25;

const DataFdfe = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 5, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
];

const DataFdf2 = [
    [1, 0, 1],
    [1, 0, 1]
];

const DataFdf42 = [
[0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
[0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
[0,  0, 10, 10,  0,  0, 10, 10,  0,  0,  0, 10, 10, 10, 10, 10,  0,  0,  0],
[0,  0, 10, 10,  0,  0, 10 ,10 , 0 , 0 , 0 , 0,  0,  0,  0, 10, 10,  0,  0],
[0,  0, 10 ,10,  0,  0, 10, 10,  0,  0 , 0,  0,  0,  0,  0, 10, 10,  0,  0],
[0,  0, 10 ,10, 10, 10, 10, 10,  0,  0,  0,  0, 10, 10, 10, 10,  0,  0,  0],
[0,  0,  0 ,10, 10, 10, 10, 10,  0,  0,  0, 10, 10,  0,  0 , 0,  0,  0,  0],
[0,  0,  0,  0,  0,  0 ,10, 10,  0,  0,  0, 10, 10,  0,  0 , 0,  0,  0,  0],
[0,  0,  0,  0,  0,  0, 10 ,10 , 0,  0,  0, 10, 10, 10, 10, 10, 10,  0,  0],
[0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
[0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
]

const DataWave = [
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20],
    [20,15,11,7,5,3,2,1,0,0,1,2,3,5,7,11,15,20]
]

// transform to pts
const ptsList: MyVect3d[][] = [];

// convert on d array dim
let currData = DataWave;
for (let z = 0; z < currData.length; z++) {
    ptsList.push([]);
    for (let x = 0; x < currData[z].length; x++) {
        let height: number = currData[z][x] / FACTOR_MINIMIZE;
        let newPts: MyVect3d = [x, height, -z];
        ptsList[z].push(newPts);
    }
}

// The X axis is red. The Y axis is green. The Z axis is blue. 
const Fdf = () => {

        const positions : number[] = [];//new Float32Array(ptsList.length * 3);
        
        for (let z = 0; z < ptsList.length; z++) {
            for (let x = 0; x < ptsList[z].length; x++) {
                let basePts = ptsList[z][x];
                
                // generate right pts
                // ori pts + target pts
                if (x < ptsList[0].length - 1) {
                    let targetRightPts = ptsList[z][x + 1];
                    positions.push(...basePts);
                    positions.push(...targetRightPts);
                }
                // generate bottom pts
                // orif pts + target pts
                if (z < ptsList.length - 1) {
                    let targetBottomPts = ptsList[z + 1][x];
                    positions.push(...basePts);
                    positions.push(...targetBottomPts);
                }
            }
        }
        console.log("position")
        console.log(positions)
        
        
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

                <Line
                    points={positions}
                    color={0xff0000}
                    segments
                />

                <OrbitControls target={[0, 1, 0]} />
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    )
}

export default Fdf;