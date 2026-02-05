declare module 'gsap' {
    export * from 'gsap/gsap-core';
    export { gsap as default } from 'gsap/gsap-core';
}

declare module 'gsap/ScrollTrigger' {
    export * from 'gsap/ScrollTrigger';
    export { ScrollTrigger as default } from 'gsap/ScrollTrigger';
}

declare module 'gsap/gsap-core' {
    // Basic shim to silence "implicitly has an 'any' type" errors
    // In a real env with internet, we would install @types/gsap
    export const gsap: any;
    export const ScrollTrigger: any;
    export interface TweenVars {
        [key: string]: any;
    }
}
