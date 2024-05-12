import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as models from "./../models";

type treeType = {
  position: { x: number; z: number; };
  box: number; // bounding area of the tree?
}

interface TreeRealModel {
  boundary: number;
  count: number;
}

const boxIntersect = (
  minAx: number,
  minAz: number,
  maxAx: number,
  maxAz: number,
  minBx: number,
  minBz: number,
  maxBx: number,
  maxBz: number
) => {
  let aLeftOfB = maxAx < minBx;
  let aRightOfB = minAx > maxBx;
  let aAboveB = minAz > maxBz;
  let aBelowB = maxAz < minBz;

  return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
}

const isOverlaping = (index: number, tree: treeType, trees: treeType[]) => {
  const minTargetX = tree.position.x - tree.box / 2;
  const maxTargetX = tree.position.x + tree.box / 2;
  const minTargetZ = tree.position.z - tree.box / 2;
  const maxTargetZ = tree.position.z + tree.box / 2;

  console.log("is overlaping test : ")
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

const TreeRealModel = ({ boundary, count }: TreeRealModel) => {
  const model = useLoader(GLTFLoader, models.tree);
  const [trees, setTrees] = useState<treeType[]>([]);
  console.log(model)

  model.scene.traverse((obj: any) => {
    if (obj.isMesh)
      obj.castShadow = true;
  })

  const newPosition = (box: number, boudary: number) => {
    return (
      boundary / 2 -
      box / 2 -
      (boudary - box) * (Math.round(Math.random() * 100) / 100)
    )
  }

  const updatePosition = (treeArray: treeType[], boundary: number) => {
    let count = 0;
    while (count < treeArray.length) {
      let currentTree = treeArray[count];
      let newPos = {
        x: newPosition(currentTree.box, boundary),
        z: newPosition(currentTree.box, boundary)
      }
      treeArray[count].position = newPos;

      if (!isOverlaping(count, treeArray[count], treeArray))
        count++;
    }
    setTrees(treeArray);
}

useEffect(() => {
  const tempTrees: treeType[] = [];
  for (let i = 0; i < count; i++) {
    tempTrees.push({ position: { x: 0, z: 0 }, box: 1 });
  }
  updatePosition(tempTrees, boundary);
}, [boundary, count]);

return <group rotation={[0, 0, 0]}>
  {
    trees.map((tree, index) => {
      return (
        <object3D
          key={index}
          position={[tree.position.x, 0, tree.position.z]}>
          <mesh scale={[tree.box, tree.box, tree.box]}>
            <boxGeometry />
            <meshBasicMaterial color="blue" wireframe />
          </mesh>
          <primitive object={model.scene.clone()} />
        </object3D>
      )
    })
  }
</group>
}


export default TreeRealModel;