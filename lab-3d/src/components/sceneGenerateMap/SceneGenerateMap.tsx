import { Canvas } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';
import { Circle, Line, OrbitControls } from '@react-three/drei';

type MyVect3d = [number, number, number];

interface ITerrain {
    terrainPoints : MyVect3d[];
}

const Terrain = (props : ITerrain) => {
    // Création de la géométrie à partir des points
    const terrainGeometry = React.useMemo(() => {
        const positions = new Float32Array(props.terrainPoints.length * 3);
        for (let i = 0; i < props.terrainPoints.length; i++) {
            positions[i * 3] = props.terrainPoints[i][0]; // x
            positions[i * 3 + 1] = props.terrainPoints[i][1]; // y
            positions[i * 3 + 2] = props.terrainPoints[i][2]; // z
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geometry;
    }, [props.terrainPoints]);

    return (
        <mesh geometry={terrainGeometry}>
            <meshBasicMaterial color={0x00ff00} wireframe={true} />
        </mesh>
    );
};

const Scene = () => {
    // Exemple de points représentant le terrain
    const terrainPoints : MyVect3d[] = [
        [3, 3, -10],
        [3, 5, -10],
        [5, 5, -10],
        
        [7, 7, -10],
        [-10, -10, -10],
        [8, 9, -10],
        // Ajoutez plus de points selon vos besoins
    ];

    return (
        <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>

        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Terrain terrainPoints={terrainPoints} />
            <OrbitControls target={[0, 1, 0]} />
            <axesHelper args={[20]}/>
            <gridHelper />
        </Canvas>
        </div>
    );
};

export default Scene;