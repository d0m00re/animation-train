import React, { useRef, useEffect } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import AnimateBox from './components/AnimateBox'
import { OrbitControls, PerspectiveCamera, Stats, TransformControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as models from "./models";
import Lights from './components/Lights';

const TexturedSphere = () => {

    return (
        <>
            {/*
            <mesh scale={[0.5, 0.5, 0.5]} position={[1, 0, 0]}>
                <sphereGeometry />
                <meshStandardMaterial  />
            </mesh>

            <mesh scale={[0.5, 0.5, 0.5]} position={[0, 0, 0]}>
                <sphereGeometry />
                <meshStandardMaterial  />
            </mesh>

            <mesh scale={[0.5, 0.5, 0.5]} position={[-1, 0, 0]}>
                <sphereGeometry />
                <meshStandardMaterial />
            </mesh>
    */}
            <mesh position={[0, 0, 0]} rotation-x={Math.PI * -0.5} receiveShadow>
                <planeGeometry
                    args={[5, 5]}
                />
                <meshStandardMaterial color={"#458745"} />
            </mesh>
        </>
    )
}

const Tree = () => {
    const model = useLoader(GLTFLoader, models.tree);

    console.log(model)

    model.scene.traverse((obj: any) => {
        if (obj.isMesh)
            obj.castShadow = true;
    })

    return <primitive object={model.scene} />
}

const Minigame = () => {
    const testing = true;

    return (
        <>
            <PerspectiveCamera />

            <Tree />
            <OrbitControls />
            <Lights />
            {/*<AnimateBox isTesting={testing}/> */}

            <TexturedSphere />

            {testing ?
                <>
                    <axesHelper args={[2]} />
                    <Stats />
                    <gridHelper args={[10, 10]} />
                </> : <></>
            }

        </>
    )
}

export default Minigame