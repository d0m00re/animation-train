import {useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as models from "./../../models";
import { isOverlaping, newPosition } from './utils.tree';
import { treeType } from './tree.types';


interface TreeRealModel {
  boundary: number;
  count: number;
}

const TreeRealModel = ({ boundary, count }: TreeRealModel) => {
  const model = useLoader(GLTFLoader, models.tree);
  const [trees, setTrees] = useState<treeType[]>([]);
  console.log(model)

  model.scene.traverse((obj: any) => {
    if (obj.isMesh)
      obj.castShadow = true;
  })

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