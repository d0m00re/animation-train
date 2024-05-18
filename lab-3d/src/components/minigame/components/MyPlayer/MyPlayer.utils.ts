import { RootState } from "@react-three/fiber";
import { IVect3d } from "../Door/door.entity";
import { IObjectInfo } from "../MainObject/mainObject";
import { IDirectionOffset, IPlayer } from "./MyPlayer.types";
import { isOverlaping } from '../Tree/utils.tree';
import * as THREE from "three";

const makeEmptyPlayer = (): IPlayer => ({
    pos: [0, 0, 0],
    boundingBox: [1, 1, 1]
});

const directionOffset = (props: IDirectionOffset) => {
    let directionOffset = 0;//Math.PI;//0; // w
    let baseRot = 0;
    //    let baseRot = 0;

    if (props.forward) {
        if (props.left) {
            directionOffset = baseRot + Math.PI / 4; // w + a
        } else if (props.right) {
            directionOffset = baseRot - Math.PI / 4; // w + d
        }
    } else if (props.backward) {
        if (props.left) {
            directionOffset = baseRot + Math.PI / 4 + Math.PI / 2; // s + a
        } else if (props.right) {
            directionOffset = baseRot + -Math.PI / 4 - Math.PI / 2; // s + d
        } else {
            directionOffset = baseRot + Math.PI; // s
        }
    } else if (props.left) {
        directionOffset = baseRot + Math.PI / 2; // a
    } else if (props.right) {
        directionOffset = baseRot + -Math.PI / 2; // d
    }
    return directionOffset;
}

interface IThreeObjectFilter {
    filter: {
        isMesh?: boolean;
        names?: string[];
    },
    data: {
        isMesh?: boolean;
        name?: string;
    }
}
//child.isMesh && ((child.name === "boxWall") || (child.name === "boxTower") || (child.name === "boxPlatform"))
/**
 * check if an object is valid
 * @param props 
 * @returns 
 */
const threeObjectFilter = (props: IThreeObjectFilter) => {
    // isMesh?????
    if ((props.filter.isMesh !== undefined) && props.filter.isMesh !== props.data.isMesh)
        return false;
    // name checker
    if ((props.filter.names && props.filter.names.length) && props.filter.names.findIndex(e => e === props.data.name) === -1) {
        return false;
    }
    return true;
}

interface IGetAllObjWtVect3d {
    three: RootState;
    futurPos: IVect3d;
}

const C_SOLID_MESH_OBJECT : string[] = ["boxWall", "boxTower", "boxPlatform"];

/**
 * get all object wich contains futurPos pts
 * @param props 
 * @returns 
 */
const getAllObjWtVect3d = (props: IGetAllObjWtVect3d) => {
    const objects: any[] = [];
    props.three.scene.traverse((child) => {
        if (threeObjectFilter({
            filter: {
                names: C_SOLID_MESH_OBJECT,
                isMesh: true
            },
            data: {
                name: child.name,
                isMesh: true
            }
        })) {
            const box = new THREE.Box3().setFromObject(child);
            if (box.containsPoint(new THREE.Vector3(props.futurPos[0], props.futurPos[1], props.futurPos[2]))) {
                objects.push(child);
            }
        }
    });
    return objects;
}

interface ICheckIsOverlap {
    futurPos: IVect3d;
    globalObject: IObjectInfo;
    player: IPlayer;
    three: RootState;
}

/**
 * main contact function
 * 
 * @param props 
 * @returns 
 */
const checkIsOverlap = (props: ICheckIsOverlap): boolean => {
    /*
    old tree checker
    let overlaping = isOverlaping(
        props.globalObject.trees.length,
        { position: props.futurPos, boundingBox: props.player.boundingBox },
        props.globalObject.trees
    );
    if (overlaping) return true;
    */

    //  check door contact
    let overlaping = isOverlaping(
        1,
        { position: props.futurPos, boundingBox: props.player.boundingBox },
        [props.globalObject.door]
    )

    if (!props.globalObject.door.data.open && overlaping) return true;
    // ---------------------------------

    // check global object checker
    const objects = getAllObjWtVect3d({ futurPos: props.futurPos, three: props.three });

    if (objects.length) {
        console.log("box wall/tower/platform find\n")
        return true;
    }
    return false;
}

export {
    directionOffset,
    makeEmptyPlayer,
    checkIsOverlap
}