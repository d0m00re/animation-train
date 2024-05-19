import { Stats } from '@react-three/drei'
import Lights from './components/Lights';
import MainPlane from './components/MainPlane';
import MyPlayer from './components/MyPlayer';
import { useEffect, useState } from 'react';
import { treeType } from './components/Tree/tree.types';
import { IPlayer } from './components/MyPlayer/MyPlayer.types';
import { IObjectInfo, makeEmptyObjectInfo } from './components/MainObject/mainObject';
import Door from './components/Door/Door';
import { IDoorObject } from './components/Door/door.entity';
import * as model from "./models";
import GenBasicObjRender from './components/GenBasicObjRender/GenBasicObjRender';

const Main = () => {
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
            {objectInfo.walls.map(wall => <GenBasicObjRender
                id={wall.id}
                key={`wall-${wall.id}`}
                globalObject={objectInfo}
                pos={wall.pos}
                rot={wall.rot}
                boundingBox={wall.boundingBox}
                objPath={model.wall}
                name={"Wall"}
                namePrimitive='WallPrime'
            />)
            }

            {objectInfo.rampage.map(rampage => <GenBasicObjRender
                id={rampage.id}
                key={`rampage-${rampage.id}`}
                globalObject={objectInfo}
                pos={rampage.pos}
                rot={rampage.rot}
                boundingBox={rampage.boundingBox}
                objPath={model.rampage}
                name={"Rampage"}
                namePrimitive='RampagePrime'
            />)
            }

            {objectInfo.towers.map(tower => <GenBasicObjRender
                id={tower.id}
                key={`wall-${tower.id}`}
                globalObject={objectInfo}
                pos={tower.pos}
                rot={tower.rot}
                boundingBox={tower.boundingBox}
                objPath={model.tower}
                name={"Tower"}
                namePrimitive='TowerPrime'
            />)
            }

            {objectInfo.platform.map(platform => <GenBasicObjRender
                id={platform.id}
                key={`platform-${platform.id}`}
                globalObject={objectInfo}
                pos={platform.pos}
                rot={platform.rot}
                boundingBox={platform.boundingBox}
                objPath={model.platform}
                name={"Platform"}
                namePrimitive='PlatformPrime'
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

export default Main;