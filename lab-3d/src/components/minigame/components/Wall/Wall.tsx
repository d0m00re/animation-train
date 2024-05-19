import React, {useRef} from 'react'
import { IWallEntity } from './wall.entity';
import { IObjectInfo } from '../MainObject/mainObject';
import * as model from "./../../models";
import { useGLTF } from '@react-three/drei';

interface IWallProps {
    wall : IWallEntity;
    globalObject : IObjectInfo;
}

function Wall(props: IWallProps) {
    const meshRef = useRef();
    const { scene } = useGLTF(model.wall);

  return (
    <object3D position={props.wall.pos} rotation={props.wall.rot}>
      
        <mesh name='boxWall' scale={props.wall.boundingBox}>
            <boxGeometry></boxGeometry>
            <meshBasicMaterial color="gray" wireframe />
        </mesh>
  
        <primitive object={scene.clone()} ref={meshRef} />
    </object3D>
  )
}

export default Wall