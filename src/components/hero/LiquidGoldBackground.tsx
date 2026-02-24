/**
 * LIQUID GOLD BACKGROUND
 * Fullscreen shader plane with viscous, flowing gold liquid effect.
 * Reacts to mouse movement like molten metal.
 */

"use client";

import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
    LiquidGoldVertexShader,
    LiquidGoldFragmentShader,
    createLiquidGoldUniforms,
    LiquidGoldUniforms
} from '@/shaders/LiquidGoldShader';

interface LiquidGoldBackgroundProps {
    intensity?: number;
    viscosity?: number;
    greyScale?: number;
    onMouseMove?: (x: number, y: number) => void;
}

export const LiquidGoldBackground: React.FC<LiquidGoldBackgroundProps> = ({
    intensity = 1.0,
    viscosity = 0.8,
    greyScale = 1.0,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { viewport, size } = useThree();

    // Create uniforms
    const uniforms = useMemo<LiquidGoldUniforms>(() => {
        const u = createLiquidGoldUniforms();
        u.uIntensity.value = intensity;
        u.uViscosity.value = viscosity;
        u.uGreyScale.value = greyScale;
        u.uResolution.value = [size.width, size.height];
        return u;
    }, []);

    // Update uniforms when props change
    React.useEffect(() => {
        if (materialRef.current) {
            const mat = materialRef.current;
            mat.uniforms.uIntensity.value = intensity;
            mat.uniforms.uViscosity.value = viscosity;
            mat.uniforms.uGreyScale.value = greyScale;
            mat.uniforms.uResolution.value = [size.width, size.height];
        }
    }, [intensity, viscosity, greyScale, size]);

    // Mouse tracking with smoothing
    const mouseTarget = useRef<[number, number]>([0.5, 0.5]);
    const mouseCurrent = useRef<[number, number]>([0.5, 0.5]);

    // Handle mouse move
    const handlePointerMove = useCallback((event: THREE.Event) => {
        if (!event.uv) return;
        mouseTarget.current = [event.uv.x, event.uv.y];
    }, []);

    // Animation loop
    useFrame((state, delta) => {
        if (!materialRef.current) return;

        const mat = materialRef.current;

        // Update time
        mat.uniforms.uTime.value = state.clock.elapsedTime;

        // Smooth mouse movement (viscous feel)
        const smoothing = 0.03; // Slow, heavy response
        mouseCurrent.current[0] += (mouseTarget.current[0] - mouseCurrent.current[0]) * smoothing;
        mouseCurrent.current[1] += (mouseTarget.current[1] - mouseCurrent.current[1]) * smoothing;

        mat.uniforms.uMouse.value = [...mouseCurrent.current];
    });

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, -5]}
            onPointerMove={handlePointerMove}
        >
            <planeGeometry args={[viewport.width * 2, viewport.height * 2, 1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={LiquidGoldVertexShader}
                fragmentShader={LiquidGoldFragmentShader}
                uniforms={uniforms}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
};

export default LiquidGoldBackground;
