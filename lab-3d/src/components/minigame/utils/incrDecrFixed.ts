//-------- precision
export function incrementByPointOne(value: number, incr: number) {
    return (parseFloat((value + incr).toFixed(10)));
}

export function decrementByPointOne(value: number, decr: number) {
    return (parseFloat((value - decr).toFixed(10)));
}