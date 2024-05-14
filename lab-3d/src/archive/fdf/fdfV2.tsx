import { Line, PerspectiveCamera, Sphere, Torus, OrbitControls } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, useRapier, TrimeshCollider } from "@react-three/rapier";
import { useEffect, useState, useRef } from "react";
import { DoubleSide } from "three";
import * as THREE from 'three';

// render with triangle
// so rework pts generation
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

//
interface ICustomRigiBody {

}



//-------------------------------------------

const FdfOld = () => {
    const [cameraPos, setCameraPos] = useState<MyVect3d>([-0.5, 1, 2]);

    /*
const collider = world.createRigidBody({
      type: 'Static', // Static or Kinematic depending on your needs
      position: [0, 0, 0], // Position of the collider
      shape: {
        type: 'ConvexHull', // Define the shape as a convex hull
        points: positions.flat(), // Flatten the positions array
      },
    });
    */
    /*
     const rapier = useRapier();
 
     useEffect(() => {
         rapier.world.createRigidBody({
 
         });
     }, [])
     */


    return (
        <Physics debug>
            <PerspectiveCamera
                makeDefault
                position={cameraPos}
                far={50}
            />
            <RigidBody colliders={"trimesh"} restitution={20} type="fixed">
                {/*<Torus /> */}
                <Line
                    position={[-8, -5, 0]}
                    points={positions}
                    color={0xff0000}
                    segments
                />
            </RigidBody>



            <RigidBody colliders="hull">
                <Sphere args={[1, 32, 32]} position={[-4, 5, -10]}>
                    <meshStandardMaterial color="red" />
                </Sphere>
            </RigidBody>
            <CuboidCollider position={[-6, -3, -10]} args={[20, 0.5, 20]} />
        </Physics>

    );
};

const vertices = new Float32Array([
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,

    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0
]);


const triangles = [
    [[0, 0, 0], [1, 0, 0], [0, 1, 0]], // Triangle 1
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]], // Triangle 2
    // Add more triangles as needed
];
/*
const Fdf = () => {
    return (
        <mesh>
            <Sphere args={[1, 32, 32]} position={[-4, 5, -10]}>
                <meshStandardMaterial color="red" />
            </Sphere>
            <OrbitControls target={[0, 0, 0]} />

            <meshStandardMaterial color="red" />
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={vertices}
                    itemSize={3}
                />
            </bufferGeometry>
            <meshBasicMaterial
                attach="material"
                color="#5243aa"
                wireframe={false}
                side={DoubleSide}
            />
        </mesh>
    )
}
*/

const Terrain = ({ width, height, segments, minHeight, maxHeight } : any) => {
  // @ts-ignore
    const terrainRef = useRef();

  // Generate heightfield vertices
  const vertices = [];
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const x = (i / (segments - 1)) * width;
      const z = (j / (segments - 1)) * height;
      const y = THREE.MathUtils.lerp(minHeight, maxHeight, Math.random());
      vertices.push(x, y, z);
    }
  }

  // Create geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.computeVertexNormals();

  return (
    <mesh ref={terrainRef} geometry={geometry}>
      <meshPhongMaterial color={0x008000} />
    </mesh>
  );
};

const Fdf = () => {
  return (
    <>
                <OrbitControls target={[0, 0, 0]} />

      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Terrain width={10} height={10} segments={50} minHeight={0} maxHeight={5} />
    </>
  );
};


export default Fdf;