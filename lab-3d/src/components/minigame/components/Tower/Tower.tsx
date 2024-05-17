import React, {useRef} from 'react'
import { ITowerEntity } from './tower.entity';
import { IObjectInfo } from '../MainObject/mainObject';
import * as model from "./../../models";
import { useGLTF } from '@react-three/drei';

interface ITowerProps {
    wall : ITowerEntity;
    globalObject : IObjectInfo;
}

function Tower(props: ITowerProps) {
    const meshRef = useRef();
    const { scene } = useGLTF(model.tower1);

  return (
    <object3D position={props.wall.pos} rotation={props.wall.rot} scale={[1,0.5,1]}>
        <mesh name='boxTower' scale={props.wall.boundingBox}>
            <boxGeometry></boxGeometry>
            <meshBasicMaterial color="green" wireframe />
        </mesh>
        <primitive object={scene.clone()} ref={meshRef} />
    </object3D>
  )
}

export default Tower;