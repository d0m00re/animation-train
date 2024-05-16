export type IVect3d = [number, number, number];

export interface IDoorObject {
    boundingBox : IVect3d;
    position : IVect3d;
    data : {
        open : boolean;
        renderCount : number;
    }
}