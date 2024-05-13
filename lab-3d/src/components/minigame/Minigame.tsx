import { OrbitControls, PerspectiveCamera, Stats, useAnimations, useGLTF } from '@react-three/drei'
import Lights from './components/Lights';
import TreeRealModel from './components/TreeRealModel';
import MainPlane from './components/MainPlane';
import MyPlayer from './components/MyPlayer';

const Minigame = () => {
    const testing = true;

    return (
        <>
            <PerspectiveCamera />

            <TreeRealModel
                boundary={10}
                count={20}
            />

            <Lights />

            <MyPlayer animationType="Walking_A" />

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