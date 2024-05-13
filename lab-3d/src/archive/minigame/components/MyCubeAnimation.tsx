import { useAnimations, useGLTF } from '@react-three/drei'
import * as model from "./../models";
import { useEffect } from 'react';

const MyCubeAnimation = () => {
    const { nodes, materials, animations, scene } = useGLTF(model.cubeAnimation)
    const { ref, mixer, names, actions, clips } = useAnimations(animations, scene) 
    console.log(mixer)
    console.log(animations)

    useEffect(() => {
        // run animation
        actions?.swipe?.play();
        actions?.mooveTopBottom?.play();
    }, []);
    return <>
        <primitive object={scene} />
    </>
}


export default MyCubeAnimation;