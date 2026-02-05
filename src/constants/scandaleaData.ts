export interface Product {
    id: string;
    name: string;
    image: string;
    color: string;
    tagline: string;
    notes: string;
}

export const SCANDALEA_PRODUCTS: Product[] = [
    {
        id: "ascension",
        name: "Ascension",
        image: "/parfum/scandalea/ascension.jpeg",
        color: "#D4AF37", // Gold
        tagline: "Rise Above",
        notes: "Amber • Celestial Musk"
    },
    {
        id: "gourmet",
        name: "Gourmet",
        image: "/parfum/scandalea/gourmet.jpeg",
        color: "#C68E17", // Amber
        tagline: "Forbidden Taste",
        notes: "Vanilla • Burnt Sugar"
    },
    {
        id: "misfit",
        name: "Misfit",
        image: "/parfum/scandalea/misfit.jpeg",
        color: "#E0E0E0", // Silver
        tagline: "Born Different",
        notes: "Metal • Cold Air"
    },
    {
        id: "redhanded",
        name: "Red Handed",
        image: "/parfum/scandalea/redhanded.jpeg",
        color: "#D70040", // Crimson
        tagline: "Caught in the Act",
        notes: "Cherry • Leather"
    },
    {
        id: "violet-moss",
        name: "Violet & Moss",
        image: "/parfum/scandalea/violet&moss.jpeg",
        color: "#4B0082", // Indigo/Violet
        tagline: "Dark Nature",
        notes: "Violet Leaf • Oakmoss"
    }
];
