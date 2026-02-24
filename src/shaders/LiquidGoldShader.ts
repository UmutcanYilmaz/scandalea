/**
 * LIQUID GOLD SHADER
 * A viscous, flowing metallic liquid simulation that reacts to mouse movement.
 * Creates the "Aurea" (Golden/Radiant) atmosphere for SCANDALÉA.
 */

export const LiquidGoldVertexShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const LiquidGoldFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uViscosity;
uniform float uIntensity;
uniform float uGreyScale; // 0.0 = full color, 1.0 = monochrome

varying vec2 vUv;
varying vec3 vPosition;

// Aurea Color Palette
const vec3 GOLD_PURE = vec3(0.831, 0.686, 0.216);      // #D4AF37
const vec3 GOLD_LIGHT = vec3(0.945, 0.875, 0.627);     // #F1DFA0
const vec3 GOLD_DARK = vec3(0.667, 0.510, 0.094);      // #AA8218
const vec3 GOLD_AMBER = vec3(0.984, 0.961, 0.718);     // #FBF5B7
const vec3 GOLD_WARM = vec3(0.749, 0.584, 0.192);      // #BF953F

// Simplex noise helper functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

// Simplex 3D Noise
float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Fractal Brownian Motion for organic flow
float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    float lacunarity = 2.0;
    float persistence = 0.5;
    
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise(p * frequency);
        frequency *= lacunarity;
        amplitude *= persistence;
    }
    return value;
}

// Metaball distance function
float metaball(vec2 p, vec2 center, float radius) {
    float dist = length(p - center);
    return radius / (dist * dist + 0.001);
}

// Viscous fluid simulation
float viscousFlow(vec2 uv, float time, vec2 mouse) {
    float viscosity = uViscosity;
    
    // Multiple flow layers at different speeds (heavy, molten metal)
    float slowTime = time * 0.15;
    float mediumTime = time * 0.25;
    float fastTime = time * 0.4;
    
    // Base heavy flow
    vec3 p1 = vec3(uv * 2.0, slowTime);
    float flow1 = fbm(p1, 6) * 0.6;
    
    // Medium undulation
    vec3 p2 = vec3(uv * 3.0 + 0.5, mediumTime);
    float flow2 = fbm(p2, 4) * 0.3;
    
    // Fast surface ripples
    vec3 p3 = vec3(uv * 5.0, fastTime);
    float flow3 = fbm(p3, 3) * 0.1;
    
    // Mouse interaction - creates a distortion wave
    float mouseInfluence = 0.0;
    if (mouse.x > 0.0 || mouse.y > 0.0) {
        vec2 mousePos = mouse;
        float distToMouse = length(uv - mousePos);
        
        // Viscous displacement - slow, heavy response
        float waveRadius = 0.4;
        float waveFalloff = smoothstep(waveRadius, 0.0, distToMouse);
        
        // Concentric waves emanating from mouse
        float waves = sin(distToMouse * 15.0 - time * 2.0) * 0.5 + 0.5;
        waves *= waveFalloff;
        waves *= viscosity;
        
        mouseInfluence = waves * 0.4;
    }
    
    // Combine all flows
    float totalFlow = flow1 + flow2 + flow3 + mouseInfluence;
    
    // Add metallic specular highlights
    float specular = pow(max(0.0, totalFlow), 3.0) * 0.5;
    
    return totalFlow + specular;
}

// Caustic light pattern
float caustics(vec2 uv, float time) {
    float c1 = snoise(vec3(uv * 8.0, time * 0.5));
    float c2 = snoise(vec3(uv * 12.0 + 5.0, time * 0.7));
    float c3 = snoise(vec3(uv * 16.0 - 3.0, time * 0.3));
    
    float caustic = (c1 + c2 + c3) / 3.0;
    caustic = pow(abs(caustic), 2.0);
    return caustic;
}

// Color mixing for liquid gold palette
vec3 liquidGoldColor(float value, float causticValue) {
    // Gradient through gold spectrum based on flow value
    vec3 color;
    
    if (value < 0.3) {
        color = mix(GOLD_DARK, GOLD_PURE, value / 0.3);
    } else if (value < 0.6) {
        color = mix(GOLD_PURE, GOLD_WARM, (value - 0.3) / 0.3);
    } else if (value < 0.8) {
        color = mix(GOLD_WARM, GOLD_LIGHT, (value - 0.6) / 0.2);
    } else {
        color = mix(GOLD_LIGHT, GOLD_AMBER, (value - 0.8) / 0.2);
    }
    
    // Add caustic highlights
    color += causticValue * GOLD_AMBER * 0.4;
    
    // Metallic sheen
    float fresnel = pow(1.0 - abs(value - 0.5) * 2.0, 2.0);
    color += fresnel * GOLD_LIGHT * 0.2;
    
    return color;
}

// Convert to greyscale with luminance preservation
vec3 toGreyscale(vec3 color) {
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(luminance);
}

void main() {
    vec2 uv = vUv;
    
    // Aspect ratio correction
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 centeredUv = (uv - 0.5) * aspect + 0.5;
    
    // Calculate viscous flow
    float flow = viscousFlow(centeredUv, uTime, uMouse);
    
    // Normalize to 0-1 range
    float normalizedFlow = flow * 0.5 + 0.5;
    normalizedFlow = clamp(normalizedFlow, 0.0, 1.0);
    
    // Calculate caustics
    float causticValue = caustics(centeredUv, uTime);
    
    // Get liquid gold color
    vec3 color = liquidGoldColor(normalizedFlow, causticValue);
    
    // Apply intensity
    color *= uIntensity;
    
    // Vignette for depth
    float vignette = 1.0 - length((uv - 0.5) * 1.2);
    vignette = smoothstep(0.0, 0.7, vignette);
    color *= vignette * 0.8 + 0.2;
    
    // Add subtle glow to bright areas
    float glow = pow(normalizedFlow, 4.0) * 0.3;
    color += glow * GOLD_AMBER;
    
    // Apply greyscale transition
    vec3 grey = toGreyscale(color);
    color = mix(color, grey, uGreyScale);
    
    // Reduce saturation in grey mode
    color *= mix(1.0, 0.3, uGreyScale);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Shader uniforms interface
export interface LiquidGoldUniforms {
    uTime: { value: number };
    uMouse: { value: [number, number] };
    uResolution: { value: [number, number] };
    uViscosity: { value: number };
    uIntensity: { value: number };
    uGreyScale: { value: number };
}

// Default uniform values
export const createLiquidGoldUniforms = (): LiquidGoldUniforms => ({
    uTime: { value: 0 },
    uMouse: { value: [0.5, 0.5] },
    uResolution: { value: [1920, 1080] },
    uViscosity: { value: 0.8 },
    uIntensity: { value: 1.0 },
    uGreyScale: { value: 1.0 }, // Start in grey world
});
