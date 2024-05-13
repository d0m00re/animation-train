interface IDirectionOffset {
    forward : boolean;
    backward : boolean;
    left : boolean;
    right : boolean;
}

const directionOffset = (props : IDirectionOffset) => {
    let directionOffset = 0; // w

    if (props.forward) {
        if (props.left) {
            directionOffset = Math.PI / 4; // w + a
        } else if (props.right) {
            directionOffset = -Math.PI / 4; // w + d
        }
    } else if (props.backward) {
        if (props.left) {
            directionOffset = Math.PI / 4 + Math.PI / 2; // s + a
        } else if (props.right) {
            directionOffset = -Math.PI / 4 - Math.PI / 2; // s + d
        } else {
            directionOffset = Math.PI; // s
        }
    } else if (props.left) {
        directionOffset = Math.PI / 2; // a
    } else if (props.right) {
        directionOffset = -Math.PI / 2; // d
    }
    return directionOffset;
}

export {
    directionOffset
}