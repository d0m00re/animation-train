import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as model from "../../models";
import * as THREE from "three";
import { useEffect, useRef } from 'react';
import useInput from "../../hooks/useInput";
import { useFrame, useThree } from '@react-three/fiber';
import { TAnimationType, animationNameDico } from './MyPlayer.types';
import { mx_bits_to_01 } from 'three/examples/jsm/nodes/materialx/lib/mx_noise.js';

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuaternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();


interface IDirectionOffset {
    forward : boolean;
    backward : boolean;
    left : boolean;
    right : boolean;
}

interface IKnightCaracter {
    animationType : TAnimationType;
}
const MyPlayerV2 = (props : IKnightCaracter) => {
    const { nodes, materials, animations, scene } = useGLTF(model.knight)
    const { ref, mixer, names, actions, clips } = useAnimations(animations, scene) 
    const { forward, backward, left, right, jump, shift} = useInput();
    const currentAction = useRef("");
    const controlRef = useRef<typeof OrbitControls>();
    const camera = useThree(state => state.camera)

    scene.scale.set(0.2,0.2,0.2);

    useEffect(() => {
        let action : TAnimationType;

        if (forward || left || right) {
            action = animationNameDico.walking;
            if (shift)
                action = animationNameDico.running;
        }
        else if (jump)
            action = animationNameDico.jump;
        else if (backward)
            action = animationNameDico.walkingBackward;
        else
            action = animationNameDico.idle

        // woot woot ?? 
        if (currentAction.current !== action) {
            // get new animation
            const nextActionToplay = actions[action];
            // get back current playing animation
            const current = actions[currentAction.current];
            current?.fadeOut(0.2); // ????????
            nextActionToplay?.reset().fadeIn(0.2).play();
            currentAction.current = action;
        }

    //  actions[props.animationType]?.play();
    //  console.log({ forward, backward, left, right, jump, shift})
    }, [forward, backward, left, right, jump, shift]);


    useFrame((state, delta) => {
        // step 1 applied basic moovement, later calculate with trygo
        if (forward) {
            console.log("forward")
            scene.position.z += 0.1;
        } else if (backward) {
            console.log("backward")
            scene.position.z -= 0.1;
        }
        if (left) {
            console.log("left")
            scene.position.x += 0.1;
        } if (right) {
            console.log("right")
            scene.position.x -= 0.1;
        }

        let position = scene.position;
        camera.position.set(position.x, position.y + 0.5, position.z - 1)
        camera.lookAt(position.x, position.y, position.z);
    })

    return <>
        {/*@ts-ignore*/}
        <OrbitControls ref={controlRef} />
        <primitive object={scene} />
    </>
}


export default MyPlayerV2;