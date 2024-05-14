import { IPlayer } from "../MyPlayer/MyPlayer.types";
import { makeEmptyPlayer } from "../MyPlayer/MyPlayer.utils";
import { treeType } from "../Tree/tree.types";

export interface IObjectInfo {
    player : IPlayer;
    trees : treeType[];
}

export const makeEmptyObjectInfo = () : IObjectInfo => {
    return ({
        player : makeEmptyPlayer(),
        trees : []
    })
};