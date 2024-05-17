import { Stats } from '@react-three/drei'
import Lights from './components/Lights';
import Tree from './components/Tree';
import MainPlane from './components/MainPlane';
import MyPlayer from './components/MyPlayer';
import { useEffect, useState } from 'react';
import { treeType } from './components/Tree/tree.types';
import { IPlayer } from './components/MyPlayer/MyPlayer.types';
import { IObjectInfo, makeEmptyObjectInfo } from './components/MainObject/mainObject';
import Door from './components/Door/Door';
import { IDoorObject } from './components/Door/door.entity';
import Wall from './components/Wall/Wall';
import Tower from './components/Tower/Tower';

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

    const revOpenDoor = () => {
        setObjectInfo(old => ({
            ...old,
            door: {
                ...old.door,
                data: {
                    open: !old.door.data.open,
                    renderCount: old.door.data.renderCount + 1
                }
            }
        }))
    }

    useEffect(() => {

    }, [objectInfo])


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

            {/*
            <Tree
                boundary={10}
                count={5}
                trees={objectInfo.trees}
                setTrees={setTrees}
                globalObject={objectInfo}
            />
            */}

            <Door
                onClick={() => { }}
                door={objectInfo.door}
                globalObject={objectInfo}
                revOpenDoor={() => setObjectInfo(old => ({
                    ...old,
                    door: {
                        ...old.door,
                        data: {
                            renderCount: old.door.data.renderCount + 1,
                            open: !old.door.data.open
                        }
                    }
                }))}
            />

            {objectInfo.walls.map(wall => <Wall
                key={`wall-${wall.id}`}
                globalObject={objectInfo}
                wall={wall}
            />)
            }

            {objectInfo.towers.map(tower => <Tower
                key={`tower-${tower.id}`}
                globalObject={objectInfo}
                wall={tower}
            />)
            }

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