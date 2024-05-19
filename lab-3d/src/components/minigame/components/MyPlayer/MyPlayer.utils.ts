import { RootState } from "@react-three/fiber";
import { IVect3d } from "../Door/door.entity";
import { IObjectInfo } from "../MainObject/mainObject";
import { IDirectionOffset, IPlayer, MyVect3d } from "./MyPlayer.types";
import { isOverlaping } from '../Tree/utils.tree';
import * as THREE from "three";
import { euclideanDistance } from "../Door/Door";

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
        type?: string;
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
    //if ((props.filter.isMesh !== undefined) && props.filter.isMesh !== props.data.isMesh)
    //    return false;
    // name checker
    //  if ((props.filter.names && props.filter.names.length) && props.filter.names.findIndex(e => e === props.data.name) === -1) {
    //      return false;
    //  }
    const nameExclude = ["Rig", "Knight_Body", "Knight_Head", "boxGround", "Scene"]
    const typeExclude = ["Mesh", "Scene"]
    if (typeExclude.includes(props.data.type ?? "") || nameExclude.includes(props.data.name ?? ""))
        return false;
    return true;
}

interface IGetAllObjWtVect3d {
    three: RootState;
    futurPos: IVect3d;
}

const C_SOLID_MESH_OBJECT: string[] = [
    "boxWall",
    "boxTower",
    "boxPlatform",
    "boxRampage",
    "RampagePrime"];

/**
 * get all object wich contains futurPos pts (abstract later)
 * @param props 
 * @returns 
 */
export const getAllSolidObjWtVect3d = (props: IGetAllObjWtVect3d) => {
    const objects: any[] = [];

    props.three.scene.traverse((child) => {
        console.log("---")
        if (threeObjectFilter({
            filter: {
                names: C_SOLID_MESH_OBJECT,
                isMesh: true
            },
            data: {
                name: child.name,
                isMesh: true,
                type: child.type
            }
        })) {
            // proble come from here, you use Box3
            const box = new THREE.Box3().setFromObject(child);
            if (box.containsPoint(new THREE.Vector3(props.futurPos[0], props.futurPos[1], props.futurPos[2]))) {
                objects.push(child);
            }
        }
    });
    if (objects.length) {
        console.log("Object contain pts : ")
        console.log(objects)
        console.log("all obj scene")
        console.log(props.three.scene.children)
    }
    return objects;
}

// texting porpose
const checkObjectCurrentPos = () => {

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
const checkIsOverlapOld = (props: ICheckIsOverlap): boolean => {
    return false;
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
    /*
    let overlaping = isOverlaping(
        1,
        { position: props.futurPos, boundingBox: props.player.boundingBox },
        [props.globalObject.door]
    )

    if (!props.globalObject.door.data.open && overlaping) return true;
    // ---------------------------------

    // check global object checker
    const objects = getAllSolidObjWtVect3d({ futurPos: props.futurPos, three: props.three });

    if (objects.length) {
        console.log("box wall/tower/platform find\n")
        return true;
    }
    return false;
    */
}

const subVector = (v1: MyVect3d, v2: MyVect3d): MyVect3d => {
    return [
        v1[0] - v2[0],
        v1[1] - v2[1],
        v1[2] - v2[2],
    ];
}

const checkIsOverlap = (props: ICheckIsOverlap): boolean => {
    //scene.updateMatrixWorld();
    props.three.scene.updateWorldMatrix(true, true);
    let _futurPos: IVect3d = [...props.futurPos];
    let _playerPos: IVect3d = [...props.globalObject.player.pos];

    console.log(`Futur pos : ${JSON.stringify(_futurPos)}`)

    _futurPos[1] += 0.05;
    _playerPos[1] += 0.05;


    let dist = euclideanDistance(props.player.pos, props.futurPos, true);
    let vPos = new THREE.Vector3(..._playerPos);
    let direction = new THREE.Vector3(...subVector(_futurPos, _playerPos)).normalize();
 //   console.log("vector normalize")
  //  console.log(direction)

    const raycaster = new THREE.Raycaster(
        vPos,
        direction,
        0,
        dist
        //10  //euclideanDistance(props.player.pos, props.futurPos, true)
    );

    //    console.log("fucking children n::::: ")
    //    console.log(props.three.scene.children);
    const intersects: any[] = raycaster.intersectObjects(props.three.scene.children); //(threeRef.current.scene.children);

    if (intersects.length) {
      //  console.log("intersect : ", intersects.length)
      //  console.log(intersects)
       // console.log("dist checkr : ", dist)

        // raycaster new pts
        /*
        const raycaster2 = new THREE.Raycaster(
            new THREE.Vector3(...props.futurPos),
            new THREE.Vector3(0,1,0),
            0,
            10.5 // max dist checker
            //10  //euclideanDistance(props.player.pos, props.futurPos, true)
        );

        const intersectsTest: any[] = raycaster2.intersectObjects(props.three.scene.children); //(threeRef.current.scene.children);

        const rampage = intersectsTest.filter(e => e.object.name === "rampage");
        console.log("New pts checker")
        // second pts
        if (rampage.length) {
            console.log("New pts find let s go update our current pos")
            console.log(rampage);
            console.log(intersectsTest)
          //  return false;
        } else {
            console.log("new pts not found bitch")
            console.log(intersectsTest)
          //  return true
        }
        */
        return true;
    }

    //props.three.scene.add(new THREE.ArrowHelper(direction, vPos, 1))

 //   console.log(`base pos : ${JSON.stringify(props.player.pos)} ---> futur pos : ${JSON.stringify(props.futurPos)}`)
    return false;
};

export {
    directionOffset,
    makeEmptyPlayer,
    checkIsOverlap
}