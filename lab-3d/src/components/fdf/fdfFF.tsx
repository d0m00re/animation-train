/**
 * start wave vetices generator infinite
 * 
 */

import React, { useState } from 'react'


import { Line, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

type MyVect3d = [number, number, number];
const FACTOR_MINIMIZE = 2;
const DEBUG = false;
const CAMERA_ADVANCE = 0.0;// -0.1



//-------
const getVariation = (variation: number) => {
    let randomValue = Math.random()

    return (randomValue < 0.5) ? -variation : variation;
}
//-----------

// convert on d array dim
const baseHeightPts = [20, 15, 11, 7, 5, 3, 2, 1, 0, 0, 1, 2, 3, 5, 7, 11, 15, 20]

const convertPtsToFdfViewPts = (_ptsList: MyVect3d[][]) => {
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

interface IGenerateNewPts {
    weightArr: number[];
    startZ: number;
    length: number;
    incr: number; // incr startZ
    dir: -1 | 1;
    variation: number; // heightmap variation
}

const generateNewPts = (props: IGenerateNewPts) => {
    let fullArr: MyVect3d[][] = [];

    for (let _z = 0; _z < props.length; _z += props.incr) {
        // current _z
        let currentZ = (props.startZ + _z) * props.dir;
        let arr: MyVect3d[] = props.weightArr.map((heightElem, x) => ([
            x + getVariation(props.variation),
            heightElem + getVariation(props.variation),
            currentZ
        ]));

        fullArr.push(arr);
    }

    return fullArr;
}

let ptsListV2 = generateNewPts({
    weightArr: baseHeightPts,
    startZ: 0,
    length: 250,
    incr: 1,
    dir: -1,
    variation: 0.2
})

let positions = convertPtsToFdfViewPts(ptsListV2);

const FdfChild = () => {
    const [cameraPos, setCameraPos] = useState<MyVect3d>([-0.5, 1, 2]);

    useFrame((_, delta) => {
        // update camera pos
        setCameraPos(old => ([old[0], old[1], old[2] - CAMERA_ADVANCE]))
        //  console.log(cameraPos)
    })

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={cameraPos}
                far={50}
            />
            <directionalLight
                position={[3.3, 1.0, 4.4]}
                castShadow
                intensity={Math.PI * 2}
            />

            <mesh visible userData={{ hello: 'world' }} position={[1, 1, cameraPos[2] - 20]}>
                <sphereGeometry />
                <meshStandardMaterial color="hotpink" transparent />
            </mesh>
                <Line
                    position={[-8, -5, 0]}
                    points={positions}
                    color={0xff0000}
                    segments
                />
                {/*<Ball position={[1, 1, -20]} /> */}
        </>
    )

}

interface IBall {
    position: MyVect3d;
}

/*
const Ball = (props : IBall) => {
    useRapier(() => {
      const rigidBody = world.createRigidBody({
        type: 'Sphere',
        position: props.position,
        radius: 1,
        density: 1,
      });
  
      return () => world.removeRigidBody(rigidBody);
    });
  
    return (
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="red" />
      </Sphere>
    );
  };
*/
/*
const BallOld = (props: IBall) => {
    const [ref] = useSphere(() => ({
        mass: 1,
        position: props.position,
        args: [1], // Radius of the ball
    }));

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
};
*/

// The X axis is red. The Y axis is green. The Z axis is blue. 
const FuckYou = () => {
    return 
        <mesh position-y={-0.251} receiveShadow>
          <boxGeometry args={[20, 0.5, 20]} />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
}

const Fdf = () => {

    return (
        <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>

            <Canvas shadows>
               

                {DEBUG ? <>
                    <OrbitControls target={[0, 0, 0]} />
                    <axesHelper args={[5]} />
                </> : <></>}
            </Canvas>
        </div>
    )
}

export default Fdf;