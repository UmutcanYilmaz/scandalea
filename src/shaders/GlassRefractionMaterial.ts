/**
 * GLASS REFRACTION MATERIAL
 * Custom shader material for crystal-cut perfume bottle with realistic refraction,
 * caustics, and prismatic light effects.
 */

import * as THREE from 'three';

export const GlassRefractionVertexShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDirection = normalize(-mvPosition.xyz);
    
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const GlassRefractionFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uIOR;              // Index of Refraction (glass ~1.5)
uniform float uThickness;        // Glass thickness
uniform float uTransmission;     // How transparent
uniform float uChromaticAberration;
uniform vec3 uTint;              // Glass tint color
uniform float uFresnelPower;
uniform samplerCube uEnvMap;     // Environment map for reflections
uniform float uEnvMapIntensity;
uniform float uCausticIntensity;
uniform float uDispersion;       // Prismatic dispersion amount

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

// Fresnel calculation
float fresnel(vec3 viewDirection, vec3 normal, float power) {
    return pow(1.0 - abs(dot(viewDirection, normal)), power);
}

// Schlick's approximation for Fresnel
float schlickFresnel(float cosTheta, float n1, float n2) {
    float r0 = pow((n1 - n2) / (n1 + n2), 2.0);
    return r0 + (1.0 - r0) * pow(1.0 - cosTheta, 5.0);
}

// Refraction with chromatic aberration
vec3 refractChromatic(vec3 viewDir, vec3 normal, float ior, float aberration) {
    // Different IOR for each color channel
    float iorR = ior - aberration;
    float iorG = ior;
    float iorB = ior + aberration;
    
    vec3 refractedR = refract(-viewDir, normal, 1.0 / iorR);
    vec3 refractedG = refract(-viewDir, normal, 1.0 / iorG);
    vec3 refractedB = refract(-viewDir, normal, 1.0 / iorB);
    
    // Sample environment map with different directions
    vec3 colorR = textureCube(uEnvMap, refractedR).rgb;
    vec3 colorG = textureCube(uEnvMap, refractedG).rgb;
    vec3 colorB = textureCube(uEnvMap, refractedB).rgb;
    
    return vec3(colorR.r, colorG.g, colorB.b);
}

// Caustic pattern simulation
float causticPattern(vec3 pos, float time) {
    // Multi-layered caustic simulation
    float c1 = sin(pos.x * 10.0 + time) * cos(pos.y * 8.0 + time * 0.7);
    float c2 = sin(pos.y * 12.0 - time * 0.5) * cos(pos.z * 10.0 + time * 0.3);
    float c3 = sin((pos.x + pos.z) * 8.0 + time * 0.8);
    
    float caustic = (c1 + c2 + c3) / 3.0;
    caustic = pow(abs(caustic), 2.0);
    
    return caustic;
}

// Prismatic dispersion effect
vec3 dispersion(vec3 viewDir, vec3 normal, float amount) {
    vec3 dispersed = vec3(0.0);
    
    // Sample at multiple angles for rainbow effect
    for (float i = 0.0; i < 8.0; i++) {
        float offset = (i / 8.0 - 0.5) * amount;
        vec3 offsetNormal = normalize(normal + vec3(offset, offset * 0.5, offset * 0.3));
        vec3 refracted = refract(-viewDir, offsetNormal, 1.0 / (uIOR + offset * 0.1));
        vec3 envColor = textureCube(uEnvMap, refracted).rgb;
        
        // Map to rainbow colors
        vec3 rainbow;
        float t = i / 8.0;
        if (t < 0.33) {
            rainbow = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), t * 3.0);
        } else if (t < 0.66) {
            rainbow = mix(vec3(1.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0), (t - 0.33) * 3.0);
        } else {
            rainbow = mix(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0), (t - 0.66) * 3.0);
        }
        
        dispersed += envColor * rainbow;
    }
    
    return dispersed / 8.0;
}

// Crystal-cut facet highlights
float facetHighlight(vec3 normal, vec3 viewDir) {
    // Approximate crystal facet edges
    float edge = 1.0 - abs(dot(normal, viewDir));
    edge = smoothstep(0.7, 0.9, edge);
    
    // Add sparkle
    float sparkle = fract(sin(dot(normal.xy, vec2(12.9898, 78.233))) * 43758.5453);
    sparkle = pow(sparkle, 20.0);
    
    return edge + sparkle * 0.5;
}

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDirection);
    
    // Calculate Fresnel
    float fresnelValue = fresnel(viewDir, normal, uFresnelPower);
    float schlick = schlickFresnel(max(dot(viewDir, normal), 0.0), 1.0, uIOR);
    
    // Reflection
    vec3 reflected = reflect(-viewDir, normal);
    vec3 reflectionColor = textureCube(uEnvMap, reflected).rgb * uEnvMapIntensity;
    
    // Refraction with chromatic aberration
    vec3 refractionColor = refractChromatic(viewDir, normal, uIOR, uChromaticAberration);
    
    // Add dispersion for prismatic effect
    if (uDispersion > 0.0) {
        vec3 dispersedColor = dispersion(viewDir, normal, uDispersion);
        refractionColor = mix(refractionColor, dispersedColor, uDispersion);
    }
    
    // Apply glass tint
    refractionColor *= uTint;
    
    // Calculate caustics
    float caustic = causticPattern(vWorldPosition, uTime);
    vec3 causticColor = vec3(1.0, 0.95, 0.8) * caustic * uCausticIntensity;
    
    // Crystal facet highlights
    float facets = facetHighlight(normal, viewDir);
    vec3 facetColor = vec3(1.0, 0.98, 0.9) * facets;
    
    // Combine reflection and refraction using Fresnel
    float mixFactor = mix(schlick, fresnelValue, 0.5);
    vec3 color = mix(refractionColor, reflectionColor, mixFactor);
    
    // Add transmission
    color = mix(color, refractionColor, uTransmission);
    
    // Add caustics and facet highlights
    color += causticColor;
    color += facetColor * 0.3;
    
    // Edge glow
    float edgeGlow = fresnel(viewDir, normal, 3.0);
    color += vec3(1.0, 0.95, 0.85) * edgeGlow * 0.2;
    
    // Final alpha based on transmission
    float alpha = mix(1.0, 0.8, uTransmission);
    
    gl_FragColor = vec4(color, alpha);
}
`;

// Shader uniforms interface
export interface GlassRefractionUniforms {
    uTime: { value: number };
    uIOR: { value: number };
    uThickness: { value: number };
    uTransmission: { value: number };
    uChromaticAberration: { value: number };
    uTint: { value: THREE.Color };
    uFresnelPower: { value: number };
    uEnvMap: { value: THREE.CubeTexture | null };
    uEnvMapIntensity: { value: number };
    uCausticIntensity: { value: number };
    uDispersion: { value: number };
}

// Default uniform values
export const createGlassRefractionUniforms = (): GlassRefractionUniforms => ({
    uTime: { value: 0 },
    uIOR: { value: 1.52 },           // Crown glass
    uThickness: { value: 0.5 },
    uTransmission: { value: 0.9 },
    uChromaticAberration: { value: 0.02 },
    uTint: { value: new THREE.Color(1.0, 0.98, 0.95) }, // Slight warm tint
    uFresnelPower: { value: 2.5 },
    uEnvMap: { value: null },
    uEnvMapIntensity: { value: 1.0 },
    uCausticIntensity: { value: 0.3 },
    uDispersion: { value: 0.1 },
});

// Create the shader material
export const createGlassRefractionMaterial = (
    envMap: THREE.CubeTexture | null = null
): THREE.ShaderMaterial => {
    const uniforms = createGlassRefractionUniforms();
    if (envMap) {
        uniforms.uEnvMap.value = envMap;
    }

    return new THREE.ShaderMaterial({
        vertexShader: GlassRefractionVertexShader,
        fragmentShader: GlassRefractionFragmentShader,
        uniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: true,
    });
};
