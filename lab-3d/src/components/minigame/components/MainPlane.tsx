const MainPlane = () => {
    return (
            <mesh name="boxGround" position={[0, 0, 0]} rotation-x={Math.PI * -0.5} receiveShadow>
                <planeGeometry
                    args={[500, 500]}
                />
                <meshStandardMaterial color={"#458745"} />
            </mesh>
    )
}

export default MainPlane;