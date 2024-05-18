import React, { useRef, useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import * as SimplexNoise from 'simplex-noise';

const noise2D = SimplexNoise.createNoise2D();//new SimplexNoise();

function generateHeight(x: number, y: number): number {
    return noise2D(x / 100, y / 100) * 10; // Adjust scale and multiplier
}

interface ITerrain {
    terrainRef: React.RefObject<THREE.Mesh>;
}

//const Terrain = forwardRef((props, ref) => {
const Terrain = (props : ITerrain) => {
    const width = 500;
    const height = 500;
    const segments = 100;

    const geometry = useMemo(() => new THREE.PlaneGeometry(width, height, segments, segments), [width, height, segments]);

    useMemo(() => {
        const vertices = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            vertices[i + 2] = generateHeight(x, y);
        }
    //    geometry.computeVertexNormals();
    }, [geometry]);

    return (
        <mesh ref={props.terrainRef} rotation-x={-Math.PI / 2} receiveShadow>
            <primitive attach="geometry" object={geometry} />
            <meshStandardMaterial color="#458745" wireframe={false} />
        </mesh>
    );
};

export function getTerrainHeight(x: number, z: number, terrainRef: React.RefObject<THREE.Mesh>): number {
    if (!terrainRef.current) return 0;

    const geometry = terrainRef.current.geometry as THREE.PlaneGeometry;
    const vertices = geometry.attributes.position.array as Float32Array;

    const segments = 100; // Same as used for the terrain generation
    const width = 500;
    const height = 500;

    const stepX = width / segments;
    const stepZ = height / segments;

    const i = Math.floor((x + width / 2) / stepX);
    const j = Math.floor((z + height / 2) / stepZ);

    const index = (j * (segments + 1) + i) * 3 + 2;

    return vertices[index];
}

export function getTerrainHeightBilineareInterpolation(
    x: number,
    z: number,
    terrainRef: React.RefObject<THREE.Mesh>
  ): number {
    if (!terrainRef.current) return 0;
  
    const geometry = terrainRef.current.geometry as THREE.PlaneGeometry;
    const vertices = geometry.attributes.position.array as Float32Array;
  
    const segments = 100; // Same as used for the terrain generation
    const width = 500;
    const height = 500;
  
    const stepX = width / segments;
    const stepZ = height / segments;
  
    // Calculate the indices of the four corners of the cell that contains the point (x, z)
    const i = Math.floor((x + width / 2) / stepX);
    const j = Math.floor((z + height / 2) / stepZ);
  
    // Ensure we're within bounds
    if (i >= 0 && i < segments && j >= 0 && j < segments) {
      // Get the four corner vertices
      const height00 = vertices[(j * (segments + 1) + i) * 3 + 2];
      const height01 = vertices[(j * (segments + 1) + i + 1) * 3 + 2];
      const height10 = vertices[((j + 1) * (segments + 1) + i) * 3 + 2];
      const height11 = vertices[((j + 1) * (segments + 1) + i + 1) * 3 + 2];
  
      // Perform bilinear interpolation
      const u = ((x + width / 2) % stepX) / stepX;
      const v = ((z + height / 2) % stepZ) / stepZ;
  
      const interpolatedHeight =
        height00 * (1 - u) * (1 - v) +
        height01 * u * (1 - v) +
        height10 * (1 - u) * v +
        height11 * u * v;
  
      return interpolatedHeight;
    }
  
    // If out of bounds, return 0 or some default value
    return 0;
  }

export function getTerrainHeightBilineareInterpolationOld(x: number, z: number, terrainRef: React.RefObject<THREE.Mesh>): number {
    if (!terrainRef.current) return 0;

    const geometry = terrainRef.current.geometry as THREE.PlaneGeometry;
    const vertices = geometry.attributes.position.array as Float32Array;

    const segments = 100; // Same as used for the terrain generation
    const width = 500;
    const height = 500;

    const stepX = width / segments;
    const stepZ = height / segments;

    // Calculate the indices of the four corners of the cell that contains the point (x, z)
    const i = Math.floor((x + width / 2) / stepX);
    const j = Math.floor((z + height / 2) / stepZ);

    // Ensure we're within bounds
    if (i >= 0 && i < segments - 1 && j >= 0 && j < segments - 1) {
        // Get the four corner vertices
        const v00 = vertices[(j * (segments + 1) + i) * 3];
        const v01 = vertices[(j * (segments + 1) + i + 1) * 3];
        const v11 = vertices[((j + 1) * (segments + 1) + i + 1) * 3];
        const v10 = vertices[((j + 1) * (segments + 1) + i) * 3];

        // Perform bilinear interpolation
        const u = (x % stepX) / stepX;
        const v = (z % stepZ) / stepZ;

        const height00 = vertices[(j * (segments + 1) + i) * 3 + 2];
        const height01 = vertices[(j * (segments + 1) + i + 1) * 3 + 2];
        const height11 = vertices[((j + 1) * (segments + 1) + i + 1) * 3 + 2];
        const height10 = vertices[((j + 1) * (segments + 1) + i) * 3 + 2];

        const interpolatedHeight = height00 * (1 - u) * (1 - v) +
                                  height01 * (1 - u) * v +
                                  height11 * u * (1 - v) +
                                  height10 * u * v;

        return interpolatedHeight;
    }

    // Return 0 if outside bounds
    return 0;
}

export default Terrain;