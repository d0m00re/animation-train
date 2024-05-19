import { IDoorObject, IVect3d } from "../Door/door.entity";
import { IPlayer } from "../MyPlayer/MyPlayer.types";
import { makeEmptyPlayer } from "../MyPlayer/MyPlayer.utils";
import { ITowerEntity } from "../Tower/tower.entity";
import { treeType } from "../Tree/tree.types";
import { IWallEntity } from "../Wall/wall.entity";

export interface IPlatformEntity {
    id : number;
    pos : IVect3d;
    rot : IVect3d;
    boundingBox : IVect3d;
}

export interface IRampageEntity {
    id : number;
    pos : IVect3d;
    rot : IVect3d;
    boundingBox : IVect3d;
}

export interface IObjectInfo {
    player: IPlayer;
    trees: treeType[];
    door: IDoorObject;
    walls: IWallEntity[];
    towers : ITowerEntity[];
    platform : IPlatformEntity[];
    rampage : IRampageEntity[];
}

export const WALL_BOUNDING_BOX : IVect3d = [3.6, 6, 8.65];
export const WALL_ZERO_H = WALL_BOUNDING_BOX[1] / 2;

export const DOOR_BOUNDING_BOX : IVect3d = [2.67, 3, 0.9];
export const DOOR_ZERO_H = DOOR_BOUNDING_BOX[1] / 2;

export const TOWER_BOUNDING_BOX : IVect3d = [9, 20, 9.86];
export const TOWER_ZERO_H = TOWER_BOUNDING_BOX[1] / 2;

export const PLATFORM_BOUNDING_BOX : IVect3d = [3.36,  1, 2];
export const PLATFORM_ZERO_H = PLATFORM_BOUNDING_BOX[1] / 2;

export const RAMPAGE_BOUNDING_BOX : IVect3d = [4.59, 2.03, 4.59];
export const RAMPAGE_ZERO_H = RAMPAGE_BOUNDING_BOX[1] / 2;

export const makeEmptyObjectInfo = (): IObjectInfo => {
    return ({
        player: {
            pos : [0,0,-10],
            boundingBox : [0.5, 0.55, 0.5]
        },
        trees: [],
        door: {
            position: [0, DOOR_ZERO_H, -5],
            boundingBox: [2.5, 3, 0.9],
            data: {
                open: false,
                renderCount: 0
            }
        },
        rampage: [
            {
                id : 11110,
                pos : [-4, RAMPAGE_ZERO_H, -15],
                rot : [0,0,0],
                boundingBox : RAMPAGE_BOUNDING_BOX
            }
        ],
        platform: [
      

        ],
        walls: [
            // front wall
            {
                id: 0,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 0, WALL_ZERO_H, -5],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            }

        ],
        towers : [  
        ]
    })
};