import { IDoorObject } from "../Door/door.entity";
import { IPlayer } from "../MyPlayer/MyPlayer.types";
import { makeEmptyPlayer } from "../MyPlayer/MyPlayer.utils";
import { treeType } from "../Tree/tree.types";

export interface IObjectInfo {
    player : IPlayer;
    trees : treeType[];
    door : IDoorObject;
}

export const makeEmptyObjectInfo = () : IObjectInfo => {
    return ({
        player : makeEmptyPlayer(),
        trees : [],
        door : {
            position : [0, 0, -5],
            boundingBox : [2.5, 3, 0.9],
            data : {
                open : false,
                renderCount : 0
            }
        }
    })
};