import { Stats } from '@react-three/drei'
import Lights from './components/Lights';
import Tree from './components/Tree';
import MainPlane from './components/MainPlane';
import MyPlayer from './components/MyPlayer';

const Minigame = () => {
    const testing = true;

    return (
        <>
            <Tree
                boundary={10}
                count={1}
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