/**
 * start wave vetices generator infinite
 * 
 */

import React, { useState } from 'react'

import { Circle, Line, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { cameraPosition } from 'three/examples/jsm/nodes/Nodes.js';
import { DataWave } from './data/exemple';


type MyVect3d = [number, number, number];
const FACTOR_MINIMIZE = 2;

// convert on d array dim
const startPts = [0,0,0];

const generatePtsFromValueArr = (data : number[][]) => {
    const _ptsList: MyVect3d[][] = [];

    for (let z = 0; z < data.length; z++) {
        _ptsList.push([]);
        for (let x = 0; x < data[z].length; x++) {
            let height: number = data[z][x] / FACTOR_MINIMIZE;
            let newPts: MyVect3d = [x, height, -z];
            _ptsList[z].push(newPts);
        }
    }

    return _ptsList;
}

const convertPtsToFdfViewPts = (_ptsList : MyVect3d[][]) => {
    let _positions = [];
    for (let z = 0; z < _ptsList.length; z++) {
        for (let x = 0; x < _ptsList[z].length; x++) {
            let basePts = _ptsList[z][x];
    
            // generate right pts
            // ori pts + target pts
            if (x < _ptsList[0].length - 1) {
                let targetRightPts = _ptsList[z][x + 1];
                _positions.push(...basePts);
                _positions.push(...targetRightPts);
            }
            // generate bottom pts
            // orif pts + target pts
            if (z < _ptsList.length - 1) {
                let targetBottomPts = _ptsList[z + 1][x];
                _positions.push(...basePts);
                _positions.push(...targetBottomPts);
            }
        }
    }
    return _positions;
}

let ptsList = generatePtsFromValueArr(DataWave);
let positions = convertPtsToFdfViewPts(ptsList);

const FdfChild = () => {
    const [cameraPos, setCameraPos] = useState<MyVect3d>([-0.5, 1, 2]);

    useFrame((_, delta) => {
        // update camera pos
        setCameraPos(old => ([old[0], old[1], old[2] - 0.1]))
        console.log(cameraPos)
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPos} />
            <directionalLight
                position={[3.3, 1.0, 4.4]}
                castShadow
                intensity={Math.PI * 2}
            />

            <mesh visible userData={{ hello: 'world' }} position={[-5, -5, 0]}>
                <sphereGeometry />
                <meshStandardMaterial color="hotpink" transparent />
            </mesh>

            <Line
                position={[-8, -5, 0]}
                points={positions}
                color={0xff0000}
                segments
            /></>
    )

}

// The X axis is red. The Y axis is green. The Z axis is blue. 
const Fdf = () => {

    return (
        <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
            <Canvas shadows>
                <FdfChild />
                {/*
                <OrbitControls target={[0, 0, 0]} />
                */}
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    )
}

export default Fdf;