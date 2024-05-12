import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as model from "../models";
import * as THREE from "three";
import { useEffect, useRef } from 'react';
import useInput from "../hooks/useInput";
import { useFrame, useThree } from '@react-three/fiber';

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

//https://kaylousberg.itch.io/kaykit-adventurers
type TAnimationType = 
  "Idle" |
  "Walking_A" |
  "Walking_B" |
  "Walking_C" |
  "Walking_Backward" |
  "Running_A" |
  "Running_B" |
  "Running_Strafe_Right" |
  "Running_Strafe_Left" |
  "Jump_Full_Short" |
  "Jump_Full_Long" |
  "Jump_Start" |
  "Jump_Idle" |
  "Jump_Land" |
  "Dodge_Right" |
  "Dodge_Left" |
  "Dodge_Forward" |
  "Dodge_Backward" |
  "Pickup" |
  "Use Item" |
  "Throw" |
  "Interact" |
  "Cheer" |
  "Hit_A" |
  "Hit_B" |
  "Death_A" |
  "Death_A_Pose" |
  "Death_B" |
  "Death_B_Pose" |
  "1H_Melee_Attack_Chop" |
  "1H_Melee_Attack_Slice_Diagonal" |
  "1H_Melee_Attack_Slice_Horizontal" |
  "1H_Melee_Attack_Stab" |
  "2H_Melee_Idle" |
  "2H_Melee_Attack_Chop" |
  "2H_Melee_Attack_Slice" |
  "2H_Melee_Attack_Stab" |
  "2H_Melee_Attack_Spin" |
  "2H_Melee_Attack_Spinning" |
  "Dualwield_Melee_Attack_Chop" |
  "Dualwield_Melee_Attack_Slice" |
  "Dualwield_Melee_Attack_Stab" |
  "Unarmed_Idle" |
  "Unarmed_Pose" |
  "Unarmed_Melee_Attack_Punch_A" |
  "Unarmed_Melee_Attack_Punch_B" |
  "Unarmed_Melee_Attack_Kick" |
  "Block" |
  "Blocking" |
  "Block_Hit" |
  "Block_Attack" |
  "1H_Ranged_Aiming" |
  "1H_Ranged_Shoot" |
  "1H_Ranged_Shooting" |
  "1H_Ranged_Reload" |
  "2H_Ranged_Aiming" |
  "2H_Ranged_Shoot" |
  "2H_Ranged_Shooting" |
  "2H_Ranged_Reload" |
  "Spellcast_Shoot" |
  "Spellcast_Raise" |
  "Spellcast_Long" |
  "Spellcast_Charge" |
  "Lie_Down" |
  "Lie_Idle" |
  "Lie_Pose" |
  "Lie_StandUp" |
  "Sit_Chair_Down" |
  "Sit_Chair_Idle" |
  "Sit_Chair_Pose" |
  "Sit_Chair_StandUp" |
  "Sit_Floor_Down" |
  "Sit_Floor_Idle" |
  "Sit_Floor_Pose" |
  "Sit_Floor_StandUp";

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
                controlRef.current.target = cameraTarget;
        
    }

    useEffect(() => {
        let action : TAnimationType;

        if (forward || left || right) {
            action = "Walking_A";
            if (shift)
                action = "Running_A";
        }
        else if (jump) {
            action = "Jump_Full_Long";
        }
        else if (backward) {
            action = "Walking_Backward";
        }
        else {
            action = "Idle"
        }

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
        if (currentAction.current === "Running_A" || currentAction.current === "Walking_A") {
            scene.position.x += 0.1;
            scene.position.x += 0.1;

        
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
            const velocity = currentAction.current === "Running_A" ? 10 : 5;
        
            // movemodel & camera
            const moveX = walkDirection.x * velocity * delta;
            const moveZ = walkDirection.z * velocity * delta;

            // add to caracter
            scene.position.x += moveX;
            scene.position.z += moveZ;

            // update camera pos
            updateCameraTarget(moveX, moveZ)
        }
    })

    return <>
        {/*@ts-ignore*/}
        <OrbitControls ref={controlRef} />
        <primitive object={scene} />
    </>
}


export default MyPlayer;