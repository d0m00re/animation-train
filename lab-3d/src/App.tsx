import { Suspense } from "react";
import * as THREE from "@react-three/fiber";

import Fdf from "./components/fdf/fdfV2";
import Minigame from "./components/minigame/Minigame";

function App() {
  return (
    <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>

    <THREE.Canvas shadows>
      <Minigame />
    </THREE.Canvas>
    </div>
  )
}

export default App