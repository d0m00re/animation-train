import { OrbitControls, PerspectiveCamera, Stats, useAnimations, useGLTF } from '@react-three/drei'
import Lights from './components/Lights';
import TreeRealModel from './components/TreeRealModel';
import * as model from "./models";
import { useEffect } from 'react';
import MyCubeAnimation from './components/MyCubeAnimation';
import MainPlane from './components/MainPlane';
import KnightCaracter from './components/KnightCaracter';

const Minigame = () => {
    const testing = true;

    return (
        <>
            <PerspectiveCamera />

            {/* <Tree /> */}
            {/*}
            <TreeModel />
            <TreeModel position={[-2,0,0]}/>
            */}
            <TreeRealModel
                boundary={10}
                count={20}
            />
            <OrbitControls />
            <Lights />
            {/*}
            <MyCubeAnimation />
            */}
            <KnightCaracter animationType="Walking_A" />
            {/*<AnimateBox isTesting={testing}/> */}

            <MainPlane />

            {testing ?
                <>
                    <axesHelper args={[2]} />
                    <Stats />
                    <gridHelper args={[10, 10]} />
                </> : <></>
            }

        </>
    )
}

export default Minigame