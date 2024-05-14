import { Stats } from '@react-three/drei'
import Lights from './components/Lights';
import Tree from './components/Tree';
import MainPlane from './components/MainPlane';
import MyPlayer from './components/MyPlayer';
import { useState } from 'react';
import { treeType } from './components/Tree/tree.types';
import { IPlayer } from './components/MyPlayer/MyPlayer.types';
import { IObjectInfo, makeEmptyObjectInfo } from './components/MainObject/mainObject';

const Minigame = () => {
    //const [trees, setTrees] = useState<treeType[]>([]);
    const [objectInfo, setObjectInfo] = useState<IObjectInfo>(makeEmptyObjectInfo());

    const testing = true; 

    const setTrees = (trees : treeType[]) => {
        setObjectInfo(old => ({
            ...old,
            trees : trees
        }));
    }

    const setPlayer = (player : IPlayer) => {
        setObjectInfo(old => ({
            ...old,
            player : player
        }));
    }

    return (
        <>
            <Tree
                boundary={10}
                count={5}
                trees={objectInfo.trees}
                setTrees={setTrees}
                globalObject={objectInfo}
            />
            <Lights />
            <MyPlayer
                animationType="Walking_A"
                player={objectInfo.player}
                setPlayer={setPlayer}
                globalObject={objectInfo}
            />
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