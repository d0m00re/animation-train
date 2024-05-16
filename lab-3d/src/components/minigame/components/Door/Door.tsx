import React, { useEffect, useRef, useState } from 'react';
import * as model from "./../../models";
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from "three";
import { useThree } from '@react-three/fiber';
import { IDoorObject } from './door.entity';

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
    revOpenDoor : () => void;
}

const openDoorAnimationNameList: string[] = ["openDoorR", "openDoorL"];
const closeDoorAnimationNameList : string[] = ["closeDoorR", "closeDoorL"];
const openCloseAnimList : [string, string] = ["fullDoorAnimR", "fullDoorAnimL"];

//const getAnimationList = (open : boolean) => (open) ? openDoorAnimationNameList : closeDoorAnimationNameList;

function Door(props: IDoor) {
    const three = useThree();

    const { animations, scene } = useGLTF(model.doorTest)
    console.log(animations)
    const { actions } = useAnimations(animations, scene);
    
    // action click
    const meshRef = useRef();

    useEffect(() => {
        const handleClick = (event: any) => {
          //  console.log("handle click")
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );

            raycaster.setFromCamera(mouse, three.camera);
            const intersects: any[] = raycaster.intersectObjects(three.scene.children);

            // check if we hvae find our door scene or not
            let innerDoor = intersects.find(e => e?.object?.name === "doorR" || e?.object?.name === "doorL")

            if (innerDoor) {
                console.log("trigger onclick")
               props.revOpenDoor();
            }
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [three.camera, three.scene]);

    useEffect(() => {
        if (!props.door.data.renderCount) return ;

        let animListName = openDoorAnimationNameList;//openCloseAnimList;//getAnimationList(props.door.data.open);

        // problemcome when i play 2 animation, that s don t reset init  door pos

        animListName.map((animName) => {
            console.log("anim list name")
            console.log(animListName)
            let anim = actions[animName];
            if (!anim) {
                console.error(`anim not found : ${animName}`);
                return ;
            }
            anim.reset();
            //anim.time = 0;//duration / 2;
            anim.timeScale = (props.door.data.open) ? 1 : -1;
            anim.repetitions = 1;
           // anim.timeScale = 10;
            anim.clampWhenFinished = true;
            anim.play();
        });
    }, [props.door])
    
    // collision detect

    return (
        <object3D position={[0, 0, -5]}>
            <mesh scale={[2.5, 3, 0.9]}>
                <boxGeometry />
                <meshBasicMaterial color="blue" wireframe />
            </mesh>
            <primitive object={scene} ref={meshRef} />
        </object3D>
    )
}

export default Door