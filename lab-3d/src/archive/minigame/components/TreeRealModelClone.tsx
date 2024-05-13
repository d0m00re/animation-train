import React, { useRef, useEffect } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as models from "./../models";

const TreeRealModel = () => {
  const model = useLoader(GLTFLoader, models.tree);

  console.log(model)

  model.scene.traverse((obj: any) => {
    if (obj.isMesh)
      obj.castShadow = true;
  })

  return <group rotation={[0,4,0]}>
    <object3D position={[2, 0, 0]}>
      <primitive object={model.scene.clone()} />
    </object3D>
    <object3D position={[4, 0, 0]}>
      <primitive object={model.scene.clone()} />
    </object3D>
    <object3D position={[6, 0, 0]}>
      <primitive object={model.scene.clone()} />
    </object3D>
    </group>
}


export default TreeRealModel;