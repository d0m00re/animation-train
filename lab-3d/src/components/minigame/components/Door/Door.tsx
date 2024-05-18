import React, { useEffect, useRef, useState } from 'react';
import * as model from "./../../models";
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from "three";
import { useThree } from '@react-three/fiber';
import { IDoorObject } from './door.entity';
import { IObjectInfo } from '../MainObject/mainObject';
import { MyVect3d } from '../MyPlayer/MyPlayer.types';

//[ d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2} ]
export function euclideanDistance(vector1 : MyVect3d, vector2 : MyVect3d, abs ?: boolean) {
    let dist = Math.hypot(
      vector2[0] - vector1[0],
      vector2[1] - vector1[1],
      vector2[2] - vector1[2]
    );
    return (abs) ? Math.abs(dist) : dist; 
  } 

/**
 * todo door
 * 0 - open door | done
 * 1 - close animation and click
 * 2 - contact
 * 3 - open / close only at a certain distance
 */

type IDoor = {
    onClick: any;
    door: IDoorObject;
    revOpenDoor: () => void;
    globalObject: IObjectInfo;
}

const openDoorAnimationNameList: string[] = ["openDoorRV2", "openDoorLV2"];
//const closeDoorAnimationNameList : string[] = ["closeDoorR", "closeDoorL"];
//const openCloseAnimList : [string, string] = ["fullDoorAnimR", "fullDoorAnimL"];

//const getAnimationList = (open : boolean) => (open) ? openDoorAnimationNameList : closeDoorAnimationNameList;

const MAX_DISTANCE_INTERACTION = 2.5;

function Door(props: IDoor) {
    const three = useThree();
    const propsRef = useRef(props);
    const threeRef = useRef(three);

    const { animations, scene } = useGLTF(model.doorAnim)
    const { actions } = useAnimations(animations, scene);

    // action click
    const meshRef = useRef();

    useEffect(() => {
        propsRef.current = props;
        threeRef.current = three;
    }, [props, three]);

    useEffect(() => {
        const handleClick = (event: any) => {
            //  console.log("handle click")
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );

            raycaster.setFromCamera(mouse, threeRef.current.camera);
            const intersects: any[] = raycaster.intersectObjects(threeRef.current.scene.children);

            // check if we hvae find our door scene or not
            let innerDoor = intersects.find(e => e?.object?.name === "doorR" || e?.object?.name === "doorL")

            if (innerDoor) {
                // distance get
                const distanceDoorPlayer = euclideanDistance(
                    propsRef.current.door.position,
                    propsRef.current.globalObject.player.pos,
                    true);
                if (distanceDoorPlayer < MAX_DISTANCE_INTERACTION)
                    props.revOpenDoor();
                else {
                    console.log(`Not close enough : ${distanceDoorPlayer} < ${MAX_DISTANCE_INTERACTION}`)
                }
            }
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);//three.camera, three.scene

    useEffect(() => {
        if (!props.door.data.renderCount) return;

        let animListName = openDoorAnimationNameList;//openCloseAnimList;//getAnimationList(props.door.data.open);

        // problemcome when i play 2 animation, that s don t reset init  door pos
        console.log("possible action")
        console.log(actions)
        animListName.map((animName) => {
            let anim = actions[animName];
            if (!anim) {
                console.error(`anim not found : ${animName}`);
                return;
            }
            anim.reset();
            anim.timeScale = (props.door.data.open) ? 1 : -1;
            anim.repetitions = 1;
            anim.clampWhenFinished = true;
            anim.play();
        });
    }, [props.door])

    // collision detect

    return (
        <object3D position={props.door.position}>
            <mesh scale={props.door.boundingBox}>
                <boxGeometry />
                <meshBasicMaterial color="blue" wireframe />
            </mesh>
            <primitive object={scene} ref={meshRef} />
        </object3D>
    )
}

export default Door