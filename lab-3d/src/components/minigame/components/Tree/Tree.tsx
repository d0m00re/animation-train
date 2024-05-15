import {useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as models from "./../../models";
import { isOverlaping, newPosition } from './utils.tree';
import { treeType } from './tree.types';
import { IObjectInfo } from '../MainObject/mainObject';
import { IVect3d } from '../Door/door.entity';

interface TreeRealModel {
  boundary: number;
  count: number;
  trees: treeType[]
  setTrees: (trees: treeType[]) => void;
  globalObject : IObjectInfo;
}

const Tree = (props: TreeRealModel) => {
  const model = useLoader(GLTFLoader, models.tree);

  model.scene.traverse((obj: any) => {
    if (obj.isMesh)
      obj.castShadow = true;
  })

  const updatePosition = (treeArray: treeType[], boundary: number) => {
    let count = 0;
    while (count < treeArray.length) {
      let currentTree = treeArray[count];
      let newPos : IVect3d = [
        newPosition(currentTree.boundingBox[0], boundary),
        0,
        newPosition(currentTree.boundingBox[2], boundary)
      ];
      treeArray[count].position = newPos;

      if (!isOverlaping(count, treeArray[count], treeArray))
        count++;
    }
    props.setTrees(treeArray);
}

useEffect(() => {
  const tempTrees: treeType[] = [];
  for (let i = 0; i < props.count; i++) {
    tempTrees.push({ position: [0, 0, 0], boundingBox: [1,1,1] });
  }
  updatePosition(tempTrees, props.boundary);
}, [props.boundary, props.count]);

return <group rotation={[0, 0, 0]}>
  {
    props.trees.map((tree, index) => {
      return (
        <object3D
          key={index}
          position={[tree.position[0], 0, tree.position[2]]}>
          <mesh scale={tree.boundingBox}>
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


export default Tree;