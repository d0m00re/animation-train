import { MyVect3d } from "../../../components/minigame/components/MyPlayer/MyPlayer.types";

//[ d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2} ]
export function euclideanDistance(vector1 : MyVect3d, vector2 : MyVect3d, abs ?: boolean) {
    let dist = Math.hypot(
      vector2[0] - vector1[0],
      vector2[1] - vector1[1],
      vector2[2] - vector1[2]
    );
    return (abs) ? Math.abs(dist) : dist; 
  }