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

export interface IObjectInfo {
    player: IPlayer;
    trees: treeType[];
    door: IDoorObject;
    walls: IWallEntity[];
    towers : ITowerEntity[];
    platform : IPlatformEntity[];
}

export const WALL_BOUNDING_BOX : IVect3d = [3.6, 6, 8.65];
export const WALL_ZERO_H = WALL_BOUNDING_BOX[1] / 2;

export const DOOR_BOUNDING_BOX : IVect3d = [2.67, 3, 0.9];
export const DOOR_ZERO_H = DOOR_BOUNDING_BOX[1] / 2;

export const TOWER_BOUNDING_BOX : IVect3d = [9, 20, 9.86];
export const TOWER_ZERO_H = TOWER_BOUNDING_BOX[1] / 2;

export const makeEmptyObjectInfo = (): IObjectInfo => {
    return ({
        player: {
            pos : [0,0,-10],
            boundingBox : [0.5, 0.5, 0.5]
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
        platform: [
            {
                id : 0,
                pos: [3, 0, -20],
                rot : [0, 0, 0],
                boundingBox: [3.36,  1, 2,]
            }
        ],
        walls: [
            // front wall
            {
                id: 0,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 0, WALL_ZERO_H, -5],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 1,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 1, WALL_ZERO_H, -5],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            }, 
            {
                id: 2,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 2, WALL_ZERO_H, -5],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            }, {
                id: 3,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 0, WALL_ZERO_H, -5],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            }, {
                id: 4,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 1, WALL_ZERO_H, -5],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 5,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 2, WALL_ZERO_H, -5],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            },

            // back wall
            {
                id: 10,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 0, WALL_ZERO_H, -50],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 11,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 1, WALL_ZERO_H, -50],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            }, 
            {
                id: 12,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 2, WALL_ZERO_H, -50],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            }, {
                id: 13,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 0, WALL_ZERO_H, -50],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            }, {
                id: 14,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 1, WALL_ZERO_H, -50],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 15,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 2, WALL_ZERO_H, -50],
                rot: [0, Math.PI / 2, 0],
                boundingBox: WALL_BOUNDING_BOX
            },

            // left
            {
                id: 200,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 2 - TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 201,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 2 - TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10 - WALL_BOUNDING_BOX[2]],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 202,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 2 - TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10 - WALL_BOUNDING_BOX[2] * 2],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 203,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 2 - TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10 - WALL_BOUNDING_BOX[2] * 3],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 204,
                pos: [-5.5 - WALL_BOUNDING_BOX[2] * 2 - TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10 - WALL_BOUNDING_BOX[2] * 4],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },

            // right
            {
                id: 300,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 2 + TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 301,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 2 + TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10 - WALL_BOUNDING_BOX[2]],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 302,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 2 + TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10 - WALL_BOUNDING_BOX[2] * 2],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 303,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 2 + TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10 - WALL_BOUNDING_BOX[2] * 3],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },
            {
                id: 304,
                pos: [5.5 + WALL_BOUNDING_BOX[2] * 2 + TOWER_BOUNDING_BOX[2], WALL_ZERO_H, -10 - WALL_BOUNDING_BOX[2] * 4],
                rot: [0, 0, 0],
                boundingBox: WALL_BOUNDING_BOX
            },

        ],
        towers : [
            // front tower
            {
                id: 6,
                pos: [4 + WALL_BOUNDING_BOX[2] * 2 + TOWER_BOUNDING_BOX[2] * 1, TOWER_ZERO_H, -5],
                rot: [0, 0, 0],
                boundingBox: TOWER_BOUNDING_BOX
            }, {
                id: 7,
                pos: [-4 - WALL_BOUNDING_BOX[2] * 2 - TOWER_BOUNDING_BOX[2] * 1, TOWER_ZERO_H, -5],
                rot: [0, 0, 0],
                boundingBox: TOWER_BOUNDING_BOX
            },

            // back tower
            {
                id: 70,
                pos: [4 + WALL_BOUNDING_BOX[2] * 2 + TOWER_BOUNDING_BOX[2] * 1, TOWER_ZERO_H, -50],
                rot: [0, 0, 0],
                boundingBox: TOWER_BOUNDING_BOX
            }, {
                id: 80,
                pos: [-4 - WALL_BOUNDING_BOX[2] * 2 - TOWER_BOUNDING_BOX[2] * 1, TOWER_ZERO_H, -50],
                rot: [0, 0, 0],
                boundingBox: TOWER_BOUNDING_BOX
            },
            // behind tower center
            {
                id: 90,
                pos: [0, TOWER_ZERO_H, -50],
                rot: [0, 0, 0],
                boundingBox: TOWER_BOUNDING_BOX
            },
        ]
    })
};