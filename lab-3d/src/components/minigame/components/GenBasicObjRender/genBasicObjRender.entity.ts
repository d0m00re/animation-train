import { IVect3d } from "../Door/door.entity";
import { IObjectInfo } from "../MainObject/mainObject";

// later abstract that
export interface IGenBasicObjRenderEntity {
    id : number;
    pos : IVect3d;
    rot : IVect3d;
    globalObject: IObjectInfo
    // sclae ????
    boundingBox : IVect3d;

    objPath : any; // object path could be an import
    name : string; // name of the object use for box[Name]
}