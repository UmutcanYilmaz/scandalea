"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
// Removed unused imports

export const MemoryCore = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = 2000;
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate random particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;
            temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    // Mouse interaction
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, []);


    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Get scroll progress (0 to 1 approximate)
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;

            // Time evolution
            t = particle.t += speed / 2;

            // Mouse Influence (The "Sector 32" ripple)
            const a = particle.mx += (mouse.current.x * 100 - particle.mx) * 0.02;
            const b = particle.my += (mouse.current.y * 100 - particle.my) * 0.02;

            // Update position - A swirling vortex based on scroll
            const rx = (Math.sin(t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
            const ry = (Math.sin(t) * factor) + (Math.cos(t / 2) * factor) / 10;
            const rz = (Math.sin(t) * factor) + (Math.cos(t * 2) * factor) / 10;

            // Scroll twist
            const scrollTwist = scrollProgress * Math.PI * 4;

            dummy.position.set(
                (particle.x + rx / 50) + mouse.current.x * 2,
                (particle.y + ry / 50) + mouse.current.y * 2 - (scrollProgress * 10), // Move up as we scroll
                (particle.z + rz / 50)
            );

            // Rotation responding to scroll
            dummy.rotation.set(
                Math.sin(t) + scrollTwist,
                Math.cos(t) + scrollTwist,
                Math.sin(t)
            );

            // Scale pulsing
            const s = Math.cos(t) * 0.5 + 0.5;
            dummy.scale.set(s, s, s);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color="#D4AF37" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </instancedMesh>
    );
};
