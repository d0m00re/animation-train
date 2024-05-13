import React, {useRef} from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from "three";
import { useHelper } from '@react-three/drei';

interface IAnimateBox {
    isTesting : boolean;
}

const AnimateBox = (props : IAnimateBox) => {
    const meshRef : any = useRef<THREE.Mesh>(null);

    if (props.isTesting)
        useHelper(meshRef, THREE.BoxHelper, "red");
    
    useFrame(() => {
       // @ts-ignore
        if (meshRef.current)
        {
            // @ts-ignore
            meshRef.current.rotation.x += 0.1;
        }
    })

    // @ts-ignore
    return <mesh ref={meshRef} scale={[0.5, 0.5, 0.5]}>
        <boxGeometry />
        <meshStandardMaterial />
    </mesh>
}

export default AnimateBox;