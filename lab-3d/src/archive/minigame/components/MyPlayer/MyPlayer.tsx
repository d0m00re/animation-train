import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as model from "../../models";
import * as THREE from "three";
import { useEffect, useRef } from 'react';
import useInput from "../../hooks/useInput";
import { useFrame, useThree } from '@react-three/fiber';
import { TAnimationType, animationNameDico } from './MyPlayer.types';

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

const directionOffset = (props : IDirectionOffset) => {
    let directionOffset = 0; // w

    if (props.forward) {
        if (props.left) {
            directionOffset = Math.PI / 4; // w + a
        } else if (props.right) {
            directionOffset = -Math.PI / 4; // w + d
        }
    } else if (props.backward) {
        if (props.left) {
            directionOffset = Math.PI / 4 + Math.PI / 2; // s + a
        } else if (props.right) {
            directionOffset = -Math.PI / 4 - Math.PI / 2; // s + d
        } else {
            directionOffset = Math.PI; // s
        }
    } else if (props.left) {
        directionOffset = Math.PI / 2; // a
    } else if (props.right) {
        directionOffset = -Math.PI / 2; // d
    }
    return directionOffset;
}



interface IKnightCaracter {
    animationType : TAnimationType;
}
const MyPlayer = (props : IKnightCaracter) => {
    const { nodes, materials, animations, scene } = useGLTF(model.knight)
    const { ref, mixer, names, actions, clips } = useAnimations(animations, scene) 
    const { forward, backward, left, right, jump, shift} = useInput();
    const currentAction = useRef("");
    const controlRef = useRef<typeof OrbitControls>();
    const camera = useThree(state => state.camera)

    scene.scale.set(0.2,0.2,0.2);

    const updateCameraTarget = (moveX : number, moveZ : number) => {
        // move camera
        camera.position.x += moveX;
        camera.position.z += moveZ;

        // update camera target
        cameraTarget.x = scene.position.x;
        cameraTarget.y = scene.position.y + 2;
        cameraTarget.z = scene.position.z;

        if (controlRef.current)
        {
            // @ts-ignore
                controlRef.current.target = cameraTarget;
        }
    }

    

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
        if (currentAction.current === animationNameDico.running || currentAction.current === animationNameDico.walking) {
            scene.position.x += 0.1;
            scene.position.z += 0.1;

        
            let angleYCameraDirection = Math.atan2(
                camera.position.x - scene.position.x,
                camera.position.z - scene.position.z
            );

            // diagonal movement angle offset
            let newDirectionOffset = directionOffset({
                forward,
                backward,
                left,
                right
            });

            // rotate model
            rotateQuaternion.setFromAxisAngle(
                rotateAngle,
                angleYCameraDirection + newDirectionOffset
            );
            scene.quaternion.rotateTowards(rotateQuaternion, 0.2)

            // calculate walk direction
            camera.getWorldDirection(walkDirection)
            walkDirection.y = 0;
            walkDirection.normalize();
            walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);
        
            // run/walk velocity
            const velocity = currentAction.current === animationNameDico.running ? 10 : 5;
        
            // movemodel & camera
            const moveX = walkDirection.x * velocity * delta;
            const moveZ = walkDirection.z * velocity * delta;

            // add to caracter
            scene.position.x += moveX;
            scene.position.z += moveZ;

            // update camera pos
           // updateCameraTarget(moveX, moveZ)
        }
    })

    return <>
        {/*@ts-ignore*/}
        <OrbitControls ref={controlRef} />
        <primitive object={scene} />
    </>
}


export default MyPlayer;