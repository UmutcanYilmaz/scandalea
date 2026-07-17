"use client";

import { Canvas } from "@react-three/fiber";
import { MemoryCore } from "./MemoryCore";
import { Suspense } from "react";

const Scene = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5], fov: 75 }}
            >
                <Suspense fallback={null}>
                    <MemoryCore />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene;
