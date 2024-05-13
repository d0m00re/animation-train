import React, {useState} from 'react'

import { Line } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';

type MyVect3d = [number, number, number];

const BASE_TTL = 25;

/**
 * init code
 */

const ptsTriangle : MyVect3d[] = [
    [-10, 0, -10],
    [0, 10, -10],
    [10, 0, -10]
]

const generatePtsCloseForm = (pts : MyVect3d[]) : MyVect3d[] => {
    return [
        ...pts,
        pts[0]
    ]
};

const points : MyVect3d[] = generatePtsCloseForm(ptsTriangle);

// ----------------------------------------------------------------

/*
** describe step incr for each pts
*/
interface IPointAnim {
    stepLerp : MyVect3d[];
    ttl : number; // number ttl operation, decr each time when it s 0
}

interface IPointAnimLerp {
    ptsInfo : IPointAnim;
    pts : MyVect3d[];
}

interface IAnimateLine {
    pts : MyVect3d[];
}

/**
 * animate a pts
 * * init : init target pts and lerp
 * when pts touch to the end we generate another one
 * base 100% evolution so 100 step for giing on the right pos
 * @param props 
 * @returns 
 */
const AnimateLine = (props : IAnimateLine) => {
    // if ttl === 0 generate next target pts
    const [configPts, setConfigPts] = useState<IPointAnimLerp>({
        ptsInfo : {
            stepLerp : [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], // rework later
            ttl : 0
        },
        pts : props.pts
    });

    useFrame((_, delta) => {
        // generate new PtsInfo
        if (configPts.ptsInfo.ttl === 0) {
            let randomX = ((Math.random() < 0.5) ? -1 : 1);
            let randomY = ((Math.random() < 0.5) ? -1 : 1);
            
            let newData : IPointAnimLerp = {
                ptsInfo : {
                    ttl : 50,
                    stepLerp : configPts.ptsInfo.stepLerp.map(e => ([randomX / BASE_TTL, randomY / BASE_TTL, 0]))
                },
                pts : configPts.pts
            }
            setConfigPts(newData);
        }
        // update pos
        else {
            setConfigPts(old => ({
                ...old,
                ptsInfo : {
                    stepLerp : old.ptsInfo.stepLerp,
                    ttl : old.ptsInfo.ttl - 1
                },
                pts : configPts.pts.map((pts, i) => ([
                    pts[0] + old.ptsInfo.stepLerp[i][0],
                    pts[1] + old.ptsInfo.stepLerp[i][1],
                    pts[2]
                ]))
                 
            }))
        }
    })
    return <Line points={configPts.pts} color={0x0000ff}/>
}




const Scene1 = () => {
    return (
        <div id="canvas-container" style={{width : "100vw", height : "100vh"}}>
            <Canvas>
                <ambientLight intensity={0.1} />
                <directionalLight color="red" position={[0, 0, 5]} />
                <AnimateLine
                    pts={points}
                />
            </Canvas>
        </div>
    )
}

export default Scene1;