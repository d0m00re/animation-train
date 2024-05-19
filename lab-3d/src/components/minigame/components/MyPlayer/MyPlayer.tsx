import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as model from "../../models";
import * as THREE from "three";
import { useState, useEffect, useRef } from 'react';
import useInput from "../../hooks/useInput";
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { IPlayer, TAnimationType, animationNameDico } from './MyPlayer.types';
import { checkIsOverlap, directionOffset, getAllSolidObjWtVect3d } from './MyPlayer.utils';
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

    const updateCameraTarget = (moveX: number, moveY: number, moveZ: number) => {
        // move camera
        camera.position.y += moveY //= 1.3;
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
        updateCameraTarget(0, 0, 0)
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

    const getPlayerMoovePos = ({ futurPos, delta, moovementPerform }: { futurPos: IVect3d, delta: number, moovementPerform: boolean }) => {
        let absMoove: IVect3d = [0, 0, 0];
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

        return { futurPos, absMoove, moovementPerform };
    }

    const checkUpperCollision = ({ futurPos }: { futurPos: IVect3d }): IVect3d | undefined => {
        const raycaster = new THREE.Raycaster(
            new THREE.Vector3(...futurPos),
            new THREE.Vector3(0, 1, 0),
            0,
            10.5 // max dist checker
            //10  //euclideanDistance(props.player.pos, props.futurPos, true)
        );

        const intersectsTest: any[] = raycaster.intersectObjects(three.scene.children); //(threeRef.current.scene.children);

        const rampage = intersectsTest.filter(e => e.object.name === "rampage");
        //console.log("New pts checker")
        // second pts
        if (rampage.length) {
            //  console.log("New pts find let s go update our current pos")
            //  console.log(rampage);
            //  console.log(intersectsTest)

            let lastIntersect = rampage[rampage.length - 1];
            // console.log("last intersect : ")
            // console.log(lastIntersect)
            futurPos = [lastIntersect.point.x, lastIntersect.point.y, lastIntersect.point.z];
            //
            return futurPos;

        } else {
            //      console.log("new pts not found bitch")
            //     console.log(intersectsTest)
            return undefined
        }
    }

    // basic gravity checker
    const checkGravity = ({ futurPos }: { futurPos: IVect3d }) => {
        three.scene.updateWorldMatrix(true, true);

        // 
        
        let dupFuturPos = [...futurPos];
        dupFuturPos[1] = 0;
        const raycaster = new THREE.Raycaster(
            new THREE.Vector3(...dupFuturPos),
            new THREE.Vector3(0, 1, 0), // upper check
            0,
            futurPos[1] + 2 // max dist checker
            //10  //euclideanDistance(props.player.pos, props.futurPos, true)
        );
        let intersectsTest: any[] = raycaster.intersectObjects(three.scene.children); //(threeRef.current.scene.children);
        //console.log("putainde merde tu es trop con")
        //console.log(intersectsTest)
       // console.log(intersectsTest.map(e => e.object.name))
        intersectsTest = intersectsTest.filter(e => (e.object.name === "rampage"))// || (e.object.name === "boxGround"));
       // console.log(intersectsTest.map(e => e.object.name))
       // console.log("------")

        let lastElement = intersectsTest[intersectsTest.length - 1];

        // only ground
        
        if (intersectsTest.length === 0) {
            console.log("fuck of len of 0 .....");
            console.log(intersectsTest.length)
            if (futurPos[1] >= 0.1) {
               // console.log("PREVIOUS VALUE : ", futurPos[1]);
                futurPos[1] -= 0.05;
            }
        }
        else if (false && lastElement) {
     //   console.log("--g-o-")
       // console.log(futurPos[1])
        //console.log(intersectsTest[intersectsTest.length - 1])
       // console.log(`diff : ${futurPos[1] - lastElement.point.y}`)

        let diffHeight = Math.abs(futurPos[1] - lastElement.point.y);
        if (diffHeight > 0.1) {

        }
        //     console.log("gravity checker");
        //  console.log(intersectsTest)
        }
        // go down directly
        /*
        if (intersectsTest.length) {// && intersectsTest[0].distance > 0.5) {
            if (intersectsTest[0].distance > 1) {
              futurPos[1] -= 0.01;
              console.log(intersectsTest[0].distance)
            }
            //else
            //    futurPos[1] = intersectsTest[0].point.y
            // futurPos[1] = intersectsTest[0].point.y;
        }*/


        return futurPos;
    }

    // too may things in it?
    useFrame((state, delta) => {
        let moovementPerform = false;

        // moove to aplied to the player
        let absMoove: IVect3d = [0, 0, 0];
        let futurPos: IVect3d = [scene.position.x, scene.position.y, scene.position.z];

        let isPlayerMooving = checkIfPlayerMoove(currentAction);

        // find mooveX / mooveZ
        if (isPlayerMooving) {
            let dataFuturPos = getPlayerMoovePos({ futurPos, delta, moovementPerform });
            futurPos = dataFuturPos.futurPos;
            absMoove = dataFuturPos.absMoove;
            moovementPerform = dataFuturPos.moovementPerform;
        }
        let isOverlap = false;

        if (moovementPerform) {

            // base moovement
            isOverlap = checkIsOverlap({
                futurPos: futurPos,
                globalObject: props.globalObject,
                player: props.player,
                three: three
            });

            // get upper pos if possible
            if (isOverlap) {
                const newFuturPos = checkUpperCollision({ futurPos });
                if (newFuturPos !== undefined) {
                    isOverlap = false;
                    futurPos = newFuturPos;
                }
            }
        }

        if (isOverlap) return;

        // gravity check
        futurPos = checkGravity({ futurPos });

        // UPDATE POSITION IF NO OVERLAP
        // add to caracter
        if (futurPos[0] !== scene.position.x || futurPos[1] !== scene.position.y || futurPos[2] !== scene.position.z) {
            absMoove[0] = futurPos[0] - scene.position.x
            absMoove[1] = futurPos[1] - scene.position.y
            absMoove[2] = futurPos[2] - scene.position.z
            scene.position.x = futurPos[0];
            scene.position.y = futurPos[1]; // new
            scene.position.z = futurPos[2];

            props.setPlayer({ ...props.player, pos: futurPos });

            // update camera pos - fix that later we don t have y here too
            updateCameraTarget(absMoove[0], absMoove[1], absMoove[2]);
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

/*
   //-------- J - U - M - P -----------------
                if (jump && verticalVelocityRef.current === 0) {
                    console.log("wtf update ref from : ", verticalVelocityRef.current)
                    verticalVelocityRef.current = 1;
                }
        
                if (verticalVelocityRef.current > 0) {
                    console.log(verticalVelocityRef.current)
                    moovementPerform = true;
                    futurPos[1] = incrementByPointOne(futurPos[1], 0.05);
                    verticalVelocityRef.current = decrementByPointOne(verticalVelocityRef.current, 0.05);
                }
                //---------------------------------
                // G-R-A-V-I-T-Y_C-H-E-C-K
                /*
                if (verticalVelocityRef.current <= 0) {
                    let dupFuturPos: IVect3d = [...futurPos];
                    dupFuturPos[1] = decrementByPointOne(dupFuturPos[1], 0.05);
                    // get object
                    let checkObject = getAllSolidObjWtVect3d({
                        three: three,
                        futurPos: dupFuturPos
                    });
        
                    // no object contact so we fall 
                    if (checkObject.length === 0 && scene.position.y > 0) {
                        moovementPerform = true;
                        futurPos = dupFuturPos;
                    }
                }
                */
