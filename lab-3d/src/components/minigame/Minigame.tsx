import { Stats } from '@react-three/drei'
import Lights from './components/Lights';
import Tree from './components/Tree';
import MainPlane from './components/MainPlane';
import MyPlayer from './components/MyPlayer';
import { useState } from 'react';
import { treeType } from './components/Tree/tree.types';
import { IPlayer } from './components/MyPlayer/MyPlayer.types';
import { IObjectInfo, makeEmptyObjectInfo } from './components/MainObject/mainObject';
import Door from './components/Door/Door';
import { IDoorObject } from './components/Door/door.entity';

const Minigame = () => {
    const [objectInfo, setObjectInfo] = useState<IObjectInfo>(makeEmptyObjectInfo());

    const testing = false;

    const setTrees = (trees: treeType[]) => {
        setObjectInfo(old => ({
            ...old,
            trees: trees
        }));
    }

    const setPlayer = (player: IPlayer) => {
        setObjectInfo(old => ({
            ...old,
            player: player
        }));
    }

    const setDoor = (door: IDoorObject) => {
        setObjectInfo(old => ({
            ...old,
            door: door
        }))
    }

    return (
        <>
            <MainPlane />
            <Lights />
            <MyPlayer
                animationType="Walking_A"
                player={objectInfo.player}
                setPlayer={setPlayer}
                globalObject={objectInfo}
            />

            <Tree
                boundary={10}
                count={5}
                trees={objectInfo.trees}
                setTrees={setTrees}
                globalObject={objectInfo}
            />

            <Door
                onClick={() => { console.log("click") }}
                door={objectInfo.door}
                setDoor={setDoor}
            />
           
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