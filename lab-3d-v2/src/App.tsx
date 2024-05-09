import { Suspense } from "react";
import * as THREE from "@react-three/fiber";

import { Torus } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";

const Fdf = () => {
  return (

        <Physics debug>
          <RigidBody colliders={"hull"} restitution={2}>
            <Torus />
          </RigidBody>

          <CuboidCollider position={[0, -2, 0]} args={[20, 0.5, 20]} />
        </Physics>
  );
};

function App() {
  return (
    <THREE.Canvas>
      <Suspense>
        <Fdf />
      </Suspense>
    </THREE.Canvas>
  )
}

export default App
