import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as model from "../../models";
import * as THREE from "three";
import { useEffect, useRef } from 'react';
import useInput from "../../hooks/useInput";
import { useFrame, useThree } from '@react-three/fiber';
import { IPlayer, TAnimationType, animationNameDico } from './MyPlayer.types';
import { directionOffset } from './MyPlayer.utils';
import { IObjectInfo } from '../MainObject/mainObject';
import { isOverlaping } from '../Tree/utils.tree';
import { IVect3d } from '../Door/door.entity';

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

// determine if an object is present on a specific position

const MyPlayer = (props: IMyPlayer) => {
    const { animations, scene } = useGLTF(model.knight)
    const { actions } = useAnimations(animations, scene)
    const { forward, backward, left, right, jump, shift } = useInput();
    const currentAction = useRef("");
    const controlRef = useRef<typeof OrbitControls>();
    const three = useThree()
    const { camera } = three;

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

    useEffect(() => {
        // update player pos
        scene.position.x = props.player.pos[0];
        scene.position.y = props.player.pos[1];
        scene.position.z = props.player.pos[2];

        //
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

            const futurPos: IVect3d = [
                scene.position.x + moveX,
                0,
                scene.position.z + moveZ
            ];

            // collision checker
            // box collision checker  on tree
            let overlaping = isOverlaping(
                props.globalObject.trees.length,
                { position: futurPos, boundingBox: props.player.boundingBox },
                props.globalObject.trees
            );

            if (overlaping) return;
            // ----
            overlaping = isOverlaping(
                1,
                { position: futurPos, boundingBox: props.player.boundingBox },
                [props.globalObject.door]
            )

            if (!props.globalObject.door.data.open && overlaping) return;

            // check global object checker
            const objects: any[] = [];
            three.scene.traverse((child) => {
                // @ts-ignore
                if (child.isMesh && (child.name === "boxWall") || (child.name === "boxTower")) {
                    //   console.log("is mesh")
                    //   console.log(child);
                    const box = new THREE.Box3().setFromObject(child);
                    if (box.containsPoint(new THREE.Vector3(futurPos[0], 0.5, futurPos[2]))) {
                        objects.push(child);
                    }
                }
            })
            if (objects.length) {
                console.log("box wall find\n")
                return;
            }

            // add to caracter
            scene.position.x = futurPos[0];
            scene.position.z = futurPos[2];
            // @ts-ignore
            //    console.log("Player position : ",  [scene.position.x, props.player.pos[1], scene.position.z] )
            props.setPlayer({ ...props.player, pos: [scene.position.x, props.player.pos[1], scene.position.z] });

            // update camera pos
            updateCameraTarget(moveX, moveZ)
        }
    })

    return <>
        {/*@ts-ignore*/}
        <OrbitControls ref={controlRef} enableZoom={true} minDistance={2} maxDistance={4} />
        <primitive object={scene} />
        <mesh
            scale={props.player.boundingBox}
            position={[scene.position.x, scene.position.y, scene.position.z]}
        >
            <boxGeometry />
            <meshBasicMaterial color="yellow" wireframe />
        </mesh>
    </>
}


export default MyPlayer;