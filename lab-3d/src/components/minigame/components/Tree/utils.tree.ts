import boxIntersect from '../../utils/boxIntersect';

type treeType = {
  position: { x: number; z: number; };
  box: number; // bounding area of the tree?
}

const isOverlaping = (index: number, tree: treeType, trees: treeType[]) => {
  const minTargetX = tree.position.x - tree.box / 2;
  const maxTargetX = tree.position.x + tree.box / 2;
  const minTargetZ = tree.position.z - tree.box / 2;
  const maxTargetZ = tree.position.z + tree.box / 2;

  for (let i = 0; i < index; i++) {
    let minChildX = trees[i].position.x - trees[i].box / 2;
    let maxChildX = trees[i].position.x + trees[i].box / 2;
    let minChildZ = trees[i].position.z - trees[i].box / 2;
    let maxChildZ = trees[i].position.z + trees[i].box / 2;

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

const newPosition = (box: number, boundary: number) => {
    return (
      boundary / 2 -
      box / 2 -
      (boundary - box) * (Math.round(Math.random() * 100) / 100)
    )
  }

export {
    isOverlaping,
    newPosition
}