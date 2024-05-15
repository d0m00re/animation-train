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
    setDoor: (door: IDoorObject) => void;
}

const animationName: string[] = ["rightDoorOpen", "leftDoorOpen"];

function Door(props: IDoor) {
    const three = useThree();

    const { animations, scene } = useGLTF(model.doorTest)
    const { actions } = useAnimations(animations, scene);
    const boundingBox = new THREE.Box3().setFromObject(scene);

    const revOpenDoorState = () => {
        props.setDoor({
            ...props.door, data: {
                ...props.door.data,
                open: !props.door.data.open
            }
        })
    }


    // action click
    const meshRef = useRef();

    useEffect(() => {
        const handleClick = (event: any) => {
            console.log("handle click")
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );

            console.log(mouse)

            raycaster.setFromCamera(mouse, three.camera);
            const intersects: any[] = raycaster.intersectObjects(three.scene.children);

            console.log("intersect")
            console.log(intersects)

            // check if we hvae find our door scene or not
            let innerDoor = intersects.find(e => e?.object?.name === "doorR" || e?.object?.name === "doorL")

            if (innerDoor) {
                revOpenDoorState();
                // @ts-ignore
                let anim1 = actions[animationName[0]];
                let anim2 = actions[animationName[1]];

                if (anim1) {
                    anim1.clampWhenFinished = true;
                    anim1.repetitions = 1;
                    anim1.play();
                }

                if (anim2) {
                    anim2.clampWhenFinished = true;
                    anim2.repetitions = 1;
                    anim2.play();
                }
            }

            if (intersects.length > 0 && intersects[0].object === meshRef.current) {
                props.onClick(intersects[0]);
            }
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [three.camera, three.scene]);
    // collision detect

    useEffect(() => {
        console.log(scene)
        console.log("scene id :", scene.uuid);


        console.log("BOUNDING BOX")
        console.log(boundingBox)

        //  actions[animationName[0]]?.play();
        //  actions[animationName[1]]?.play();
    }, []);

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