interface IDirectionOffset {
    forward : boolean;
    backward : boolean;
    left : boolean;
    right : boolean;
}

const directionOffset = (props : IDirectionOffset) => {
    let directionOffset = 0;//Math.PI;//0; // w
    let baseRot = 0;
//    let baseRot = 0;

    if (props.forward) {
        if (props.left) {
            directionOffset = baseRot + Math.PI / 4; // w + a
        } else if (props.right) {
            directionOffset = baseRot  -Math.PI / 4; // w + d
        }
    } else if (props.backward) {
        if (props.left) {
            directionOffset = baseRot +  Math.PI / 4 + Math.PI / 2; // s + a
        } else if (props.right) {
            directionOffset = baseRot +  -Math.PI / 4 - Math.PI / 2; // s + d
        } else {
            directionOffset = baseRot +  Math.PI; // s
        }
    } else if (props.left) {
        directionOffset = baseRot +  Math.PI / 2; // a
    } else if (props.right) {
        directionOffset = baseRot +  -Math.PI / 2; // d
    }
    return directionOffset;
}

export {
    directionOffset
}