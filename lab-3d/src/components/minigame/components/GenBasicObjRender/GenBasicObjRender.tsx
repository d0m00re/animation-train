import React, {useRef} from 'react'
import * as entity from './genBasicObjRender.entity';
import { IObjectInfo } from '../MainObject/mainObject';
import * as model from "./../../models";
import { useGLTF } from '@react-three/drei';

function GenBasicObjRender(props: entity.IGenBasicObjRenderEntity) {
    const meshRef = useRef();
    // @ts-ignore wtf ????
    const { scene } = useGLTF(props.objPath);

  return (
    <object3D position={props.pos} rotation={props.rot} name={props.namePrimitive}>
        {/*    
        <mesh name={`box${props.name}`} scale={props.boundingBox}>
            <boxGeometry></boxGeometry>
            <meshBasicMaterial color="gray" wireframe />
        </mesh>
  */}
        <primitive
          name={props.namePrimitive}
          object={scene.clone()}
          ref={meshRef}
        />
  
    </object3D>
  )
}

export default GenBasicObjRender;