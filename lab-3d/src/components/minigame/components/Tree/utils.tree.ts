import boxIntersect from '../../utils/boxIntersect';
import { IVect3d } from '../Door/door.entity';

// 0 : x, y : 1, z : 2
type treeType = {
  position: IVect3d;
  boundingBox: IVect3d; // bounding area of the tree?
}


const isOverlapingBox = (index: number, tree: treeType, trees: treeType[]) => {
  const minTargetX = tree.position[0] - tree.boundingBox[0] / 2;
  const maxTargetX = tree.position[0] + tree.boundingBox[0] / 2;
  const minTargetZ = tree.position[2] - tree.boundingBox[2] / 2;
  const maxTargetZ = tree.position[2] + tree.boundingBox[2] / 2;

  for (let i = 0; i < index; i++) {
    let minChildX = trees[i].position[0] - trees[i].boundingBox[0] / 2;
    let maxChildX = trees[i].position[0] + trees[i].boundingBox[0] / 2;
    let minChildZ = trees[i].position[2] - trees[i].boundingBox[2] / 2;
    let maxChildZ = trees[i].position[2] + trees[i].boundingBox[2] / 2;

    if (boxIntersect(
      minTargetX,
      minTargetZ,
      maxTargetX,
      maxTargetZ,

      minChildX,
      minChildZ,
      maxChildX,
      maxChildZ
    )) {
      console.log("Content box overlapping", tree.position);
      return true;
    }
  }
  return false;
};


const isOverlaping = (index: number, tree: treeType, trees: treeType[]) => {
  return false;
}

const newPosition = (box: number, boundary: number) => {
    return (
      boundary / 2 -
      box / 2 -
      (boundary - box) * (Math.round(Math.random() * 100) / 100)
    )
  }

export {
    isOverlapingBox,
    isOverlaping,
    newPosition
}