/**
 * CAUSTIC LIGHTING
 * Complex lighting rig for the hero scene with prismatic sunlight,
 * golden point lights, and caustic effects.
 */

"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import * as THREE from 'three';

interface CausticLightingProps {
    intensity?: number;
    greyScale?: number;
}

export const CausticLighting: React.FC<CausticLightingProps> = ({
    intensity = 1.0,
    greyScale = 0,
}) => {
    const directionalRef = useRef<THREE.DirectionalLight>(null);
    const point1Ref = useRef<THREE.PointLight>(null);
    const point2Ref = useRef<THREE.PointLight>(null);
    const point3Ref = useRef<THREE.PointLight>(null);

    // Gold colors
    const GOLD_PURE = useMemo(() => new THREE.Color('#D4AF37'), []);
    const GOLD_LIGHT = useMemo(() => new THREE.Color('#F1DFA0'), []);
    const GOLD_WARM = useMemo(() => new THREE.Color('#BF953F'), []);
    const WHITE = useMemo(() => new THREE.Color('#FFFFFF'), []);

    // Animate lights
    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Directional light subtle movement (sun through prism)
        if (directionalRef.current) {
            directionalRef.current.position.x = Math.sin(time * 0.2) * 2 + 5;
            directionalRef.current.position.y = Math.cos(time * 0.15) * 0.5 + 8;

            // Intensity based on color mode
            const baseIntensity = 2.0 * intensity;
            directionalRef.current.intensity = baseIntensity * (1 - greyScale * 0.5);

            // Color shift
            const color = new THREE.Color().lerpColors(WHITE, GOLD_LIGHT, 1 - greyScale);
            directionalRef.current.color = color;
        }

        // Point lights orbiting (caustic simulation)
        if (point1Ref.current) {
            point1Ref.current.position.x = Math.sin(time * 0.5) * 3;
            point1Ref.current.position.z = Math.cos(time * 0.5) * 3;
            point1Ref.current.position.y = Math.sin(time * 0.3) * 0.5 + 2;

            point1Ref.current.intensity = (Math.sin(time * 2) * 0.3 + 0.7) * intensity * 2 * (1 - greyScale);

            const color = new THREE.Color().lerpColors(WHITE, GOLD_PURE, 1 - greyScale);
            point1Ref.current.color = color;
        }

        if (point2Ref.current) {
            point2Ref.current.position.x = Math.cos(time * 0.4 + Math.PI) * 2.5;
            point2Ref.current.position.z = Math.sin(time * 0.4 + Math.PI) * 2.5;
            point2Ref.current.position.y = Math.cos(time * 0.25) * 0.5 - 1;

            point2Ref.current.intensity = (Math.cos(time * 1.5) * 0.3 + 0.7) * intensity * 1.5 * (1 - greyScale);

            const color = new THREE.Color().lerpColors(WHITE, GOLD_WARM, 1 - greyScale);
            point2Ref.current.color = color;
        }

        if (point3Ref.current) {
            // Rim light from behind
            point3Ref.current.position.x = Math.sin(time * 0.3) * 0.5 - 3;
            point3Ref.current.position.y = Math.cos(time * 0.2) * 0.3 + 3;

            point3Ref.current.intensity = intensity * 3 * (1 - greyScale * 0.3);

            const color = new THREE.Color().lerpColors(WHITE, GOLD_LIGHT, 1 - greyScale);
            point3Ref.current.color = color;
        }
    });

    return (
        <>
            {/* Main directional light (sun through prism) */}
            <directionalLight
                ref={directionalRef}
                position={[5, 8, 5]}
                intensity={2 * intensity}
                color={GOLD_LIGHT}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            {/* Orbiting caustic lights */}
            <pointLight
                ref={point1Ref}
                position={[3, 2, 0]}
                intensity={2 * intensity}
                color={GOLD_PURE}
                distance={15}
                decay={2}
            />

            <pointLight
                ref={point2Ref}
                position={[-2.5, -1, 0]}
                intensity={1.5 * intensity}
                color={GOLD_WARM}
                distance={12}
                decay={2}
            />

            {/* Rim light */}
            <pointLight
                ref={point3Ref}
                position={[-3, 3, -4]}
                intensity={3 * intensity}
                color={GOLD_LIGHT}
                distance={20}
                decay={2}
            />

            {/* Fill light from below */}
            <pointLight
                position={[0, -3, 2]}
                intensity={0.5 * intensity * (1 - greyScale)}
                color={GOLD_WARM}
                distance={10}
                decay={2}
            />

            {/* Ambient for base illumination */}
            <ambientLight
                intensity={0.15 * intensity}
                color={greyScale > 0.5 ? '#888888' : '#F1DFA0'}
            />

            {/* Environment map for reflections */}
            <Environment resolution={256} background={false}>
                {/* Custom lightformers for golden reflections */}
                <Lightformer
                    intensity={2 * intensity * (1 - greyScale)}
                    rotation-x={Math.PI / 2}
                    position={[0, 4, -9]}
                    scale={[10, 1, 1]}
                    color={greyScale > 0.5 ? '#888888' : '#D4AF37'}
                />
                <Lightformer
                    intensity={1.5 * intensity * (1 - greyScale)}
                    rotation-y={Math.PI / 2}
                    position={[-5, 1, 0]}
                    scale={[20, 0.1, 1]}
                    color={greyScale > 0.5 ? '#666666' : '#F1DFA0'}
                />
                <Lightformer
                    intensity={1 * intensity}
                    rotation-y={-Math.PI / 2}
                    position={[5, 1, 0]}
                    scale={[20, 0.5, 1]}
                    color={greyScale > 0.5 ? '#999999' : '#FBF5B7'}
                />
                <Lightformer
                    intensity={3 * intensity * (1 - greyScale)}
                    form="ring"
                    position={[0, 0, -5]}
                    scale={[5, 5, 1]}
                    color={greyScale > 0.5 ? '#AAAAAA' : '#BF953F'}
                />
            </Environment>
        </>
    );
};

export default CausticLighting;
