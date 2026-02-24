/**
 * CRYSTAL BOTTLE
 * Procedurally generated perfume bottle with crystal-cut facets,
 * glass refraction material, and idle floating animation.
 */

"use client";

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
    GlassRefractionVertexShader,
    GlassRefractionFragmentShader,
    createGlassRefractionUniforms,
} from '@/shaders/GlassRefractionMaterial';

interface CrystalBottleProps {
    position?: [number, number, number];
    scale?: number;
    visible?: boolean;
    greyScale?: number;
}

// Generate procedural crystal-cut bottle geometry
const createBottleGeometry = (): THREE.BufferGeometry => {
    const geometry = new THREE.BufferGeometry();

    // Bottle parameters
    const bodyHeight = 2.0;
    const bodyWidth = 0.8;
    const neckHeight = 0.6;
    const neckWidth = 0.25;
    const shoulderHeight = 0.3;
    const capHeight = 0.25;
    const capWidth = 0.35;

    // Crystal-cut parameters
    const bodySides = 8; // Octagonal
    const bodyFacets = 4; // Vertical facet divisions

    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    let vertexIndex = 0;

    // Helper function to add a quad
    const addQuad = (
        v1: THREE.Vector3, v2: THREE.Vector3,
        v3: THREE.Vector3, v4: THREE.Vector3,
        normal?: THREE.Vector3
    ) => {
        const n = normal || new THREE.Vector3()
            .crossVectors(
                new THREE.Vector3().subVectors(v2, v1),
                new THREE.Vector3().subVectors(v3, v1)
            )
            .normalize();

        // First triangle
        vertices.push(v1.x, v1.y, v1.z);
        vertices.push(v2.x, v2.y, v2.z);
        vertices.push(v3.x, v3.y, v3.z);

        // Second triangle
        vertices.push(v1.x, v1.y, v1.z);
        vertices.push(v3.x, v3.y, v3.z);
        vertices.push(v4.x, v4.y, v4.z);

        // Normals
        for (let i = 0; i < 6; i++) {
            normals.push(n.x, n.y, n.z);
        }

        // UVs (simple planar mapping)
        uvs.push(0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1);

        vertexIndex += 6;
    };

    // Generate body with crystal-cut facets
    for (let side = 0; side < bodySides; side++) {
        const angle1 = (side / bodySides) * Math.PI * 2;
        const angle2 = ((side + 1) / bodySides) * Math.PI * 2;

        // Main facet with slight inset for crystal effect
        const facetInset = 0.02;
        const midAngle = (angle1 + angle2) / 2;

        for (let facet = 0; facet < bodyFacets; facet++) {
            const y1 = -bodyHeight / 2 + (facet / bodyFacets) * bodyHeight;
            const y2 = -bodyHeight / 2 + ((facet + 1) / bodyFacets) * bodyHeight;

            // Slightly vary width along height for organic feel
            const widthMod = 1.0 - Math.abs((facet + 0.5) / bodyFacets - 0.5) * 0.1;
            const w = bodyWidth * widthMod;

            const v1 = new THREE.Vector3(Math.cos(angle1) * w, y1, Math.sin(angle1) * w);
            const v2 = new THREE.Vector3(Math.cos(angle2) * w, y1, Math.sin(angle2) * w);
            const v3 = new THREE.Vector3(Math.cos(angle2) * w, y2, Math.sin(angle2) * w);
            const v4 = new THREE.Vector3(Math.cos(angle1) * w, y2, Math.sin(angle1) * w);

            // Add main facet
            addQuad(v1, v2, v3, v4);

            // Add beveled edge (crystal cut)
            if (facet < bodyFacets - 1) {
                const bevelWidth = 0.03;
                const nextWidthMod = 1.0 - Math.abs((facet + 1.5) / bodyFacets - 0.5) * 0.1;
                const nextW = bodyWidth * nextWidthMod;

                const b1 = new THREE.Vector3(Math.cos(angle1) * w, y2, Math.sin(angle1) * w);
                const b2 = new THREE.Vector3(Math.cos(angle2) * w, y2, Math.sin(angle2) * w);
                const b3 = new THREE.Vector3(Math.cos(angle2) * nextW, y2 + bevelWidth, Math.sin(angle2) * nextW);
                const b4 = new THREE.Vector3(Math.cos(angle1) * nextW, y2 + bevelWidth, Math.sin(angle1) * nextW);

                addQuad(b1, b2, b3, b4);
            }
        }

        // Edge bevels between sides (vertical crystal cuts)
        const bevelDepth = 0.04;
        const bevelV1 = new THREE.Vector3(
            Math.cos(angle1) * (bodyWidth + bevelDepth),
            -bodyHeight / 2,
            Math.sin(angle1) * (bodyWidth + bevelDepth)
        );
        const bevelV2 = new THREE.Vector3(
            Math.cos(angle1) * bodyWidth,
            -bodyHeight / 2,
            Math.sin(angle1) * bodyWidth
        );
        const bevelV3 = new THREE.Vector3(
            Math.cos(angle1) * bodyWidth,
            bodyHeight / 2,
            Math.sin(angle1) * bodyWidth
        );
        const bevelV4 = new THREE.Vector3(
            Math.cos(angle1) * (bodyWidth + bevelDepth),
            bodyHeight / 2,
            Math.sin(angle1) * (bodyWidth + bevelDepth)
        );
    }

    // Generate shoulder (transition to neck)
    const shoulderStart = bodyHeight / 2;
    const shoulderEnd = shoulderStart + shoulderHeight;

    for (let side = 0; side < bodySides; side++) {
        const angle1 = (side / bodySides) * Math.PI * 2;
        const angle2 = ((side + 1) / bodySides) * Math.PI * 2;

        const v1 = new THREE.Vector3(Math.cos(angle1) * bodyWidth, shoulderStart, Math.sin(angle1) * bodyWidth);
        const v2 = new THREE.Vector3(Math.cos(angle2) * bodyWidth, shoulderStart, Math.sin(angle2) * bodyWidth);
        const v3 = new THREE.Vector3(Math.cos(angle2) * neckWidth, shoulderEnd, Math.sin(angle2) * neckWidth);
        const v4 = new THREE.Vector3(Math.cos(angle1) * neckWidth, shoulderEnd, Math.sin(angle1) * neckWidth);

        addQuad(v1, v2, v3, v4);
    }

    // Generate neck
    const neckStart = shoulderEnd;
    const neckEnd = neckStart + neckHeight;

    for (let side = 0; side < bodySides; side++) {
        const angle1 = (side / bodySides) * Math.PI * 2;
        const angle2 = ((side + 1) / bodySides) * Math.PI * 2;

        const v1 = new THREE.Vector3(Math.cos(angle1) * neckWidth, neckStart, Math.sin(angle1) * neckWidth);
        const v2 = new THREE.Vector3(Math.cos(angle2) * neckWidth, neckStart, Math.sin(angle2) * neckWidth);
        const v3 = new THREE.Vector3(Math.cos(angle2) * neckWidth, neckEnd, Math.sin(angle2) * neckWidth);
        const v4 = new THREE.Vector3(Math.cos(angle1) * neckWidth, neckEnd, Math.sin(angle1) * neckWidth);

        addQuad(v1, v2, v3, v4);
    }

    // Generate cap (faceted)
    const capStart = neckEnd;
    const capEnd = capStart + capHeight;
    const capSides = 12;

    for (let side = 0; side < capSides; side++) {
        const angle1 = (side / capSides) * Math.PI * 2;
        const angle2 = ((side + 1) / capSides) * Math.PI * 2;

        // Cap side
        const v1 = new THREE.Vector3(Math.cos(angle1) * capWidth, capStart, Math.sin(angle1) * capWidth);
        const v2 = new THREE.Vector3(Math.cos(angle2) * capWidth, capStart, Math.sin(angle2) * capWidth);
        const v3 = new THREE.Vector3(Math.cos(angle2) * capWidth, capEnd, Math.sin(angle2) * capWidth);
        const v4 = new THREE.Vector3(Math.cos(angle1) * capWidth, capEnd, Math.sin(angle1) * capWidth);

        addQuad(v1, v2, v3, v4);

        // Cap top (faceted)
        const center = new THREE.Vector3(0, capEnd, 0);
        const topInset = 0.05;
        const innerCenter = new THREE.Vector3(0, capEnd + topInset, 0);

        const t1 = new THREE.Vector3(Math.cos(angle1) * capWidth, capEnd, Math.sin(angle1) * capWidth);
        const t2 = new THREE.Vector3(Math.cos(angle2) * capWidth, capEnd, Math.sin(angle2) * capWidth);
        const t3 = new THREE.Vector3(Math.cos(angle2) * capWidth * 0.5, capEnd + topInset, Math.sin(angle2) * capWidth * 0.5);
        const t4 = new THREE.Vector3(Math.cos(angle1) * capWidth * 0.5, capEnd + topInset, Math.sin(angle1) * capWidth * 0.5);

        addQuad(t1, t2, t3, t4);
    }

    // Generate bottom
    const bottomY = -bodyHeight / 2;
    for (let side = 0; side < bodySides; side++) {
        const angle1 = (side / bodySides) * Math.PI * 2;
        const angle2 = ((side + 1) / bodySides) * Math.PI * 2;

        const v1 = new THREE.Vector3(0, bottomY, 0);
        const v2 = new THREE.Vector3(Math.cos(angle2) * bodyWidth, bottomY, Math.sin(angle2) * bodyWidth);
        const v3 = new THREE.Vector3(Math.cos(angle1) * bodyWidth, bottomY, Math.sin(angle1) * bodyWidth);

        vertices.push(v1.x, v1.y, v1.z);
        vertices.push(v2.x, v2.y, v2.z);
        vertices.push(v3.x, v3.y, v3.z);

        const normal = new THREE.Vector3(0, -1, 0);
        normals.push(normal.x, normal.y, normal.z);
        normals.push(normal.x, normal.y, normal.z);
        normals.push(normal.x, normal.y, normal.z);

        uvs.push(0.5, 0.5);
        uvs.push(Math.cos(angle2) * 0.5 + 0.5, Math.sin(angle2) * 0.5 + 0.5);
        uvs.push(Math.cos(angle1) * 0.5 + 0.5, Math.sin(angle1) * 0.5 + 0.5);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    geometry.computeVertexNormals();

    return geometry;
};

export const CrystalBottle: React.FC<CrystalBottleProps> = ({
    position = [0, 0, 0],
    scale = 1,
    visible = true,
    greyScale = 0,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Generate bottle geometry
    const geometry = useMemo(() => createBottleGeometry(), []);

    // Create shader uniforms
    const uniforms = useMemo(() => createGlassRefractionUniforms(), []);

    // Mouse tracking for parallax
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseCurrent = useRef({ x: 0, y: 0 });

    // Float animation parameters
    const floatPhase = useRef(Math.random() * Math.PI * 2);
    const floatAmplitude = 0.08;
    const floatSpeed = 0.8;

    // Rotation animation
    const rotationSpeed = 0.15;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseTarget.current = {
                x: (e.clientX / window.innerWidth - 0.5) * 0.1,
                y: (e.clientY / window.innerHeight - 0.5) * 0.1,
            };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current || !materialRef.current) return;

        const time = state.clock.elapsedTime;

        // Update shader time
        materialRef.current.uniforms.uTime.value = time;

        // Floating animation
        const floatY = Math.sin(time * floatSpeed + floatPhase.current) * floatAmplitude;
        const floatX = Math.cos(time * floatSpeed * 0.7 + floatPhase.current) * floatAmplitude * 0.3;

        groupRef.current.position.y = position[1] + floatY;
        groupRef.current.position.x = position[0] + floatX;

        // Gentle rotation
        groupRef.current.rotation.y += delta * rotationSpeed;

        // Mouse parallax (smooth)
        mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.02;
        mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.02;

        groupRef.current.rotation.x = -mouseCurrent.current.y * 0.5;
        groupRef.current.rotation.z = mouseCurrent.current.x * 0.3;

        // Apply greyscale effect
        // This would modify the environment map or tint
        const tintValue = 1 - greyScale * 0.7;
        materialRef.current.uniforms.uTint.value.setRGB(tintValue, tintValue * 0.98, tintValue * 0.95);
    });

    if (!visible) return null;

    return (
        <group ref={groupRef} position={position}>
            <mesh ref={meshRef} geometry={geometry} scale={scale}>
                <shaderMaterial
                    ref={materialRef}
                    vertexShader={GlassRefractionVertexShader}
                    fragmentShader={GlassRefractionFragmentShader}
                    uniforms={uniforms}
                    transparent
                    side={THREE.DoubleSide}
                    depthWrite
                />
            </mesh>

            {/* Inner liquid */}
            <mesh scale={[scale * 0.95, scale * 0.6, scale * 0.95]} position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.7, 0.75, 1.5, 8]} />
                <meshStandardMaterial
                    color="#D4AF37"
                    roughness={0.1}
                    metalness={0.9}
                    transparent
                    opacity={0.8}
                    envMapIntensity={2}
                />
            </mesh>
        </group>
    );
};

export default CrystalBottle;
