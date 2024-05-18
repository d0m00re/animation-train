import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as model from "../../models";
import * as THREE from "three";
import { useState, useEffect, useRef } from 'react';
import useInput from "../../hooks/useInput";
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { IPlayer, TAnimationType, animationNameDico } from './MyPlayer.types';
import { checkIsOverlap, directionOffset } from './MyPlayer.utils';
import { IObjectInfo } from '../MainObject/mainObject';
import { IVect3d } from '../Door/door.entity';
import { decrementByPointOne, incrementByPointOne } from '../../utils/incrDecrFixed';

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuaternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();

interface IMyPlayer {
    animationType: TAnimationType;
    player: IPlayer;
    setPlayer: (props: IPlayer) => void;
    globalObject: IObjectInfo;
}
//----------------

const checkIfPlayerMoove = (currentAction: React.MutableRefObject<string>) => {
    return currentAction.current === animationNameDico.running ||
        currentAction.current === animationNameDico.walking ||
        currentAction.current === animationNameDico.walkingBackward
}

// determine if an object is present on a specific position
// fiou too many things inside
const MyPlayer = (props: IMyPlayer) => {
    const { animations, scene } = useGLTF(model.knight)
    const { actions } = useAnimations(animations, scene)
    const { forward, backward, left, right, jump, shift } = useInput();
    const currentAction = useRef("");
    const controlRef = useRef<typeof OrbitControls>();
    const sceneRef = useRef<any>();
    const three = useThree()
    const { camera } = three;

    // State for vertical position and velocity
    const verticalVelocityRef = useRef<number>(0);
    scene.scale.set(0.2, 0.2, 0.2);

    const updateCameraTarget = (moveX: number, moveZ: number) => {
        // move camera
        camera.position.y = 1.3;
        camera.position.x += moveX;
        camera.position.z += moveZ;

        // update camera target
        cameraTarget.x = scene.position.x;
        cameraTarget.y = scene.position.y;
        cameraTarget.z = scene.position.z;

        if (controlRef.current) {
            // @ts-ignore
            controlRef.current.target = cameraTarget;
        }
    }

    // initial state
    useEffect(() => {
        // update player pos
        scene.position.x = props.player.pos[0];
        scene.position.y = props.player.pos[1];
        scene.position.z = props.player.pos[2];
        updateCameraTarget(0, 0)
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
            action = animationNameDico.walking;
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

    // too may things in it?
    useFrame((state, delta) => {
        let moovementPerform = false;

        // moove to aplied to the player
        let absMoove: IVect3d = [0, 0, 0];

        let futurPos: IVect3d = [
            scene.position.x,
            scene.position.y,
            scene.position.z
        ];

        let isPlayerMooving = checkIfPlayerMoove(currentAction);

        // find mooveX / mooveZ
        if (isPlayerMooving) {
            moovementPerform = true;

            // calcul next moovements
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

            // move model & camera
            absMoove[0] = walkDirection.x * velocity * delta;
            absMoove[2] = walkDirection.z * velocity * delta;

            futurPos[0] += absMoove[0];
            futurPos[2] += absMoove[2];
        }

        //incrementByPointOne
        //----------------------------------------
        if (jump && !verticalVelocityRef.current && scene.position.y === 0) {
            verticalVelocityRef.current = 1;
        }
        if (verticalVelocityRef.current > 0) {
            moovementPerform = true;
            futurPos[1] = incrementByPointOne(futurPos[1], 0.05);
            verticalVelocityRef.current = decrementByPointOne(verticalVelocityRef.current, 0.05);
        }
        else if (scene.position.y > 0) {
            moovementPerform = true;
            futurPos[1] = decrementByPointOne(futurPos[1], 0.05);
        }

        if (moovementPerform) {
            //if overlap don t applied new position
            if (checkIsOverlap({
                futurPos: futurPos,
                globalObject: props.globalObject,
                player: props.player,
                three: three
            })) {
                console.info("something overlap")
                return;
            }
            // UPDATE POSITION IF NO OVERLAP
            // add to caracter
            scene.position.x = futurPos[0];
            scene.position.y = futurPos[1]; // new
            scene.position.z = futurPos[2];

            props.setPlayer({ ...props.player, pos: futurPos });

            // update camera pos - fix that later we don t have y here too
            updateCameraTarget(absMoove[0], absMoove[2]);
        }
    })

    return <>
        {/*@ts-ignore*/}
        <OrbitControls ref={controlRef} enableZoom={true} minDistance={2} maxDistance={4} />
        <primitive ref={sceneRef} object={scene} />
        <mesh
            scale={props.player.boundingBox}
            position={[scene.position.x, scene.position.y + 0.25, scene.position.z]}
        >
            <boxGeometry />
            <meshBasicMaterial color="yellow" wireframe />
        </mesh>
    </>
}


export default MyPlayer;