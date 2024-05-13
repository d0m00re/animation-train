import { useHelper } from '@react-three/drei';
import React, { useRef } from 'react'
import * as three from "three";

const Lights = () => {
    const lightRef = useRef<any | three.DirectionalLight>();

    if (lightRef) {
        useHelper(lightRef, three.DirectionalLightHelper, 5, "red");
    }
    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight
                ref={lightRef}
                position={[0, 10, 10]}
                color="white"
                castShadow
                />
        </>
    )
}

export default Lights;