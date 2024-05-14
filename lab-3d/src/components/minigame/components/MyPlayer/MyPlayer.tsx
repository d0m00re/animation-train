import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as model from "../../models";
import * as THREE from "three";
import { useEffect, useRef } from 'react';
import useInput from "../../hooks/useInput";
import { useFrame, useThree } from '@react-three/fiber';
import { TAnimationType, animationNameDico } from './MyPlayer.types';
import { directionOffset } from './MyPlayer.utils';

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuaternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();

interface IKnightCaracter {
    animationType: TAnimationType;
}

const MyPlayer = (props: IKnightCaracter) => {
    const { animations, scene } = useGLTF(model.knight)
    const { actions } = useAnimations(animations, scene)
    const { forward, backward, left, right, jump, shift } = useInput();
    const currentAction = useRef("");
    const controlRef = useRef<typeof OrbitControls>();
    const camera = useThree(state => state.camera)

    scene.scale.set(0.2, 0.2, 0.2);

    const updateCameraTarget = (moveX : number, moveZ : number) => {
        // move camera
        camera.position.y = 1.3;
        camera.position.x += moveX;
        camera.position.z += moveZ;
    
        // update camera target
        cameraTarget.x = scene.position.x;
        cameraTarget.y = scene.position.y;
        cameraTarget.z = scene.position.z;
        
        if (controlRef.current)
        {
            // @ts-ignore
                controlRef.current.target = cameraTarget;
        }
    }

    useEffect(() => {
        updateCameraTarget(0,0)
    }, [])
    

    useEffect(() => {
        let action: TAnimationType;

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
        // walking or running

        if (currentAction.current === animationNameDico.running || currentAction.current === animationNameDico.walking || currentAction.current === animationNameDico.walkingBackward) {
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
            
            // calculate direction
            camera.getWorldDirection(walkDirection)
            walkDirection.y = 0
            walkDirection.normalize()
            walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);

            // run/walk velocity
            const velocity = currentAction.current === animationNameDico.running ? 10 : 5;

            // movemodel & camera
            const moveX = walkDirection.x * velocity * delta;
            const moveZ = walkDirection.z * velocity * delta;

            const futurPos = {
                x : scene.position.x + moveX,
                z : scene.position.z + moveZ
            }

            // add to caracter
            scene.position.x = futurPos.x;
            scene.position.z = futurPos.z;

            // update camera pos
            updateCameraTarget(moveX, moveZ)
        }

        // let position = scene.position;
        // camera.position.set(position.x, position.y + 0.5, position.z - 1)
        // camera.lookAt(position.x, position.y, position.z);
    })

    return <>
        {/*@ts-ignore*/}
        <OrbitControls ref={controlRef} enableZoom={true} minDistance={2} maxDistance={4} />
        <primitive object={scene} />
        <mesh
            scale={[1, 1, 1]}
            position={[scene.position.x, scene.position.y, scene.position.z]}
        >
            <boxGeometry />
            <meshBasicMaterial color="yellow" wireframe />
          </mesh>
    </>
}


export default MyPlayer;