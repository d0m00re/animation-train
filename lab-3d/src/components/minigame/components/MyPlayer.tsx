import { useAnimations, useGLTF } from '@react-three/drei'
import * as model from "../models";
import { useEffect, useRef } from 'react';
import useInput from "../hooks/useInput";

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

    scene.scale.set(0.2,0.2,0.2);



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
    
    return <>
        <primitive object={scene} />
    </>
}


export default MyPlayer;