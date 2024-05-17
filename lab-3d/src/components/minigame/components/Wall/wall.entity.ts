import { IVect3d } from "../Door/door.entity";

// later abstract that
export interface IWallEntity {
    id : number;
    pos : IVect3d;
    rot : IVect3d;
    // sclae??
    boundingBox : IVect3d;
}