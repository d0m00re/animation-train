import * as THREE from "@react-three/fiber";

import Main from "./components/minigame/Main";

function App() {
  return (
    <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>

    <THREE.Canvas shadows>
      <Main />
    </THREE.Canvas>
    </div>
  )
}

export default App