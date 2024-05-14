const boxIntersect = (
    minAx: number,
    minAz: number,
    maxAx: number,
    maxAz: number,
    minBx: number,
    minBz: number,
    maxBx: number,
    maxBz: number
  ) => {
    let aLeftOfB = maxAx < minBx;
    let aRightOfB = minAx > maxBx;
    let aAboveB = minAz > maxBz;
    let aBelowB = maxAz < minBz;
  
    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
  }

  export default boxIntersect;