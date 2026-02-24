/**
 * KINTSUGI CRACK SHADER
 * Creates the "breaking seal" effect - golden cracks spreading across a grey world,
 * revealing the Golden Age beneath. Inspired by Japanese Kintsugi art.
 */

export const KintsugiVertexShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const KintsugiFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uProgress;        // 0.0 = no cracks, 1.0 = fully cracked
uniform vec2 uResolution;
uniform vec2 uCrackOrigin;      // Where the first crack appears
uniform sampler2D uSceneTexture; // The scene behind the cracks

varying vec2 vUv;

// Gold colors for the cracks
const vec3 GOLD_BRIGHT = vec3(0.984, 0.961, 0.718);   // #FBF5B7
const vec3 GOLD_PURE = vec3(0.831, 0.686, 0.216);     // #D4AF37
const vec3 GOLD_WARM = vec3(0.749, 0.584, 0.192);     // #BF953F

// Hash functions for pseudo-random
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

// Voronoi distance for crack patterns
vec2 voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    
    vec2 mg, mr;
    float md = 8.0;
    
    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash2(n + g);
            vec2 r = g + o - f;
            float d = dot(r, r);
            
            if (d < md) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }
    
    md = 8.0;
    for (int j = -2; j <= 2; j++) {
        for (int i = -2; i <= 2; i++) {
            vec2 g = mg + vec2(float(i), float(j));
            vec2 o = hash2(n + g);
            vec2 r = g + o - f;
            
            if (dot(mr - r, mr - r) > 0.00001) {
                float d = dot(0.5 * (mr + r), normalize(r - mr));
                md = min(md, d);
            }
        }
    }
    
    return vec2(md, hash(n + mg));
}

// Multi-scale crack pattern
float crackPattern(vec2 uv, float scale, float time) {
    vec2 v1 = voronoi(uv * scale);
    vec2 v2 = voronoi(uv * scale * 2.0 + 100.0);
    vec2 v3 = voronoi(uv * scale * 4.0 + 200.0);
    
    // Combine different scales
    float crack = v1.x * 0.5 + v2.x * 0.3 + v3.x * 0.2;
    
    return crack;
}

// Animated crack propagation
float animatedCrack(vec2 uv, float progress, vec2 origin) {
    // Distance from crack origin
    float distFromOrigin = length(uv - origin);
    
    // Crack propagation wave
    float propagationRadius = progress * 2.0;
    float propagationEdge = smoothstep(propagationRadius, propagationRadius - 0.3, distFromOrigin);
    
    // Base crack pattern
    float crack = crackPattern(uv, 8.0, uTime);
    
    // Threshold for crack visibility
    float crackThreshold = 0.08;
    float crackLine = smoothstep(crackThreshold, crackThreshold * 0.5, crack);
    
    // Combine with propagation
    crackLine *= propagationEdge;
    
    // Add secondary cracks that appear slightly later
    float secondaryCrack = crackPattern(uv + vec2(50.0), 12.0, uTime);
    float secondaryThreshold = 0.06;
    float secondaryLine = smoothstep(secondaryThreshold, secondaryThreshold * 0.3, secondaryCrack);
    secondaryLine *= smoothstep(propagationRadius * 0.7, propagationRadius * 0.7 - 0.2, distFromOrigin);
    
    // Tertiary micro-cracks
    float tertiaryCrack = crackPattern(uv * 1.5 + vec2(100.0), 20.0, uTime);
    float tertiaryThreshold = 0.04;
    float tertiaryLine = smoothstep(tertiaryThreshold, tertiaryThreshold * 0.2, tertiaryCrack);
    tertiaryLine *= smoothstep(propagationRadius * 0.5, propagationRadius * 0.5 - 0.15, distFromOrigin);
    
    return max(max(crackLine, secondaryLine * 0.7), tertiaryLine * 0.4);
}

// Golden glow emanating from cracks
vec3 crackGlow(float crackValue, float progress) {
    // Core bright gold
    vec3 core = GOLD_BRIGHT * crackValue;
    
    // Warm glow falloff
    float glowIntensity = pow(crackValue, 0.5) * progress;
    vec3 glow = GOLD_PURE * glowIntensity * 0.5;
    
    // Pulsing effect
    float pulse = sin(uTime * 3.0) * 0.1 + 0.9;
    
    // Combine
    vec3 totalGlow = (core + glow) * pulse;
    
    // Add brightness boost at high progress
    totalGlow *= 1.0 + progress * 0.5;
    
    return totalGlow;
}

// Displacement based on cracks for scene distortion
float crackDisplacement(vec2 uv, float crackValue) {
    return crackValue * 0.02;
}

void main() {
    vec2 uv = vUv;
    
    // Aspect ratio correction
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 centeredUv = (uv - 0.5) * aspect + 0.5;
    
    // Get crack value
    float crackValue = animatedCrack(centeredUv, uProgress, uCrackOrigin);
    
    // Calculate displacement for scene texture
    float displacement = crackDisplacement(centeredUv, crackValue);
    vec2 displacedUv = uv + vec2(displacement, displacement * 0.5);
    
    // Sample scene texture (would be the grey/color world)
    // For now, we output the crack pattern itself
    
    // Calculate golden glow
    vec3 glowColor = crackGlow(crackValue, uProgress);
    
    // Sharp crack edges
    float crackEdge = smoothstep(0.0, 0.1, crackValue);
    
    // Crack width variation
    float crackWidth = crackValue * (1.0 + sin(uTime * 2.0 + uv.x * 20.0) * 0.2);
    
    // Output: crack mask with glow
    // Alpha channel contains crack mask for compositing
    float alpha = crackEdge;
    
    // Add bloom effect around cracks
    float bloom = pow(crackValue, 0.3) * uProgress * 0.5;
    glowColor += GOLD_WARM * bloom;
    
    gl_FragColor = vec4(glowColor, alpha);
}
`;

// Shader uniforms interface
export interface KintsugiUniforms {
    uTime: { value: number };
    uProgress: { value: number };
    uResolution: { value: [number, number] };
    uCrackOrigin: { value: [number, number] };
    uSceneTexture: { value: THREE.Texture | null };
}

// Default uniform values
export const createKintsugiUniforms = (): Omit<KintsugiUniforms, 'uSceneTexture'> & { uSceneTexture: { value: null } } => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uCrackOrigin: { value: [0.5, 0.5] },
    uSceneTexture: { value: null },
});

// Import THREE for type reference
import * as THREE from 'three';
