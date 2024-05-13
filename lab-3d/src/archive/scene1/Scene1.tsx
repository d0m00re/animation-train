import React, { useState } from 'react'

import { Circle, Line, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { fromHalfFloat } from 'three/src/extras/DataUtils.js';

import * as asset from "./models";

type MyVect3d = [number, number, number];

const BASE_TTL = 25;

/**
 * init code
 */

let arrTriangle: MyVect3d[][] = [
    [
        [-5, 0, -10],
        [0, 5, -10],
        [5, 0, -10]
    ]
];

arrTriangle = [...arrTriangle]//, ...arrTriangle, ...arrTriangle];

const generatePtsCloseForm = (pts: MyVect3d[]): MyVect3d[] => {
    return [
        ...pts,
        pts[0]
    ]
};

const ptsTriangleArr = arrTriangle.map(e => generatePtsCloseForm(e));

// ----------------------------------------------------------------
// utils
interface IGenEmptyMyVect3dArray {
    width: number;
    defaultValue: number;
}
const genEmpty2dArray = (props: IGenEmptyMyVect3dArray): MyVect3d[] => {
    const emptyArray: MyVect3d[] = Array.from({ length: props.width }, () => Array(3).fill(props.defaultValue)) as MyVect3d[];
    return emptyArray;
}

/*
** describe step incr for each pts
*/
interface IPointAnim {
    stepLerp: MyVect3d[];
    ttl: number; // number ttl operation, decr each time when it s 0
}

interface IPointAnimLerp {
    ptsInfo: IPointAnim;
    pts: MyVect3d[];
}

interface IAnimateLine {
    pts: MyVect3d[];
}

/**
 * animate a pts
 * * init : init target pts and lerp
 * when pts touch to the end we generate another one
 * base 100% evolution so 100 step for giing on the right pos
 * @param props 
 * @returns 
 */
const AnimateLine = (props: IAnimateLine) => {
    // if ttl === 0 generate next target pts
    const [configPts, setConfigPts] = useState<IPointAnimLerp>({
        ptsInfo: {
            stepLerp: genEmpty2dArray({
                width: 4,
                defaultValue: 0
            }),
            ttl: 0
        },
        pts: props.pts
    });

    useFrame((_, delta) => {
        // generate new PtsInfo
        if (configPts.ptsInfo.ttl === 0) {
            let randomX = ((Math.random() < 0.5) ? -1 : 1);
            let randomY = ((Math.random() < 0.5) ? -1 : 1);

            let newData: IPointAnimLerp = {
                ptsInfo: {
                    ttl: 50,
                    stepLerp: configPts.ptsInfo.stepLerp.map(() => ([randomX / BASE_TTL, randomY / BASE_TTL, 0]))
                },
                pts: configPts.pts
            }
            setConfigPts(newData);
        }
        // update pos
        else {
            setConfigPts(old => ({
                ...old,
                ptsInfo: {
                    stepLerp: old.ptsInfo.stepLerp,
                    ttl: old.ptsInfo.ttl - 1
                },
                pts: configPts.pts.map((pts, i) => ([
                    pts[0] + old.ptsInfo.stepLerp[i][0],
                    pts[1] + old.ptsInfo.stepLerp[i][1],
                    pts[2]
                ]))

            }))
        }
    })
    return <Line points={configPts.pts} color={0x0000ff} />
}

const Scene1 = () => {
    const gltfTest = useLoader(GLTFLoader, asset.test)
    const gltfMonkey = useLoader(GLTFLoader, asset.monkey)

    return (
        <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
            <Canvas camera={{ position: [-0.5, 1, 2] }} shadows>
                <directionalLight
                    position={[3.3, 1.0, 4.4]}
                    castShadow
                    intensity={Math.PI * 2}
                />
                <primitive
                    object={gltfTest.scene}
                    position={[0, 1, 0]}
                    children-0-castShadow
                />
                <primitive
                    object={gltfMonkey.scene}
                    position={[1,2,0]}
                    children-0-castShadow
                />

                <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
                    <meshStandardMaterial />
                </Circle>
                <OrbitControls target={[0, 1, 0]} />
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    )
}

export default Scene1;