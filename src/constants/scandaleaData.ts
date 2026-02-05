export interface Product {
    id: string;
    name: string;
    tagline: string;
    description: string;
    notes: {
        top: string;
        heart: string;
        base: string;
    };
    color: string;
    gradient: string;
    image: string;
    vibe: string;
}

export const SCANDALEA_PRODUCTS: Product[] = [
    {
        id: "ascension",
        name: "ASCENSION",
        tagline: "THE MYTH & THE SPIRIT",
        description: "Özel Seri. Mitolojik bir yükseliş hikayesi. Altın ve siyahın kutsal uyumu.",
        notes: {
            top: "Nar • Pembe Biber",
            heart: "Siyah Gül • Şakayık",
            base: "Paçuli • Kehribar • Misk"
        },
        color: "#D4AF37", // Gold
        gradient: "radial-gradient(circle at center, #3a2e05 0%, #000000 70%)",
        image: "/parfum/scandalea/ascension.jpeg",
        vibe: "Divine"
    },
    {
        id: "red-handed",
        name: "RED HANDED",
        tagline: "CAUGHT IN THE ACT",
        description: "Suçüstü yakalanmış bir tutku. Kiraz ve ruj akorunun kışkırtıcı dansı.",
        notes: {
            top: "Kiraz • Frambuaz • Kan Portakalı",
            heart: "Pembe Şakayık • Ruj Akoru",
            base: "Pamuk Şeker • Vanilya"
        },
        color: "#D70040", // Crimson/Pink
        gradient: "radial-gradient(circle at center, #4a0016 0%, #000000 70%)",
        image: "/parfum/scandalea/redhanded.jpeg",
        vibe: "Flirtatious"
    },
    {
        id: "violet-moss",
        name: "VIOLET & MOSS",
        tagline: "WILD CHAMOMILE & SOIL",
        description: "Yağmur sonrası toprak ve yabani papatyalar. Doğanın en saf hali.",
        notes: {
            top: "Roman Papatyası • Yeşil Armut",
            heart: "Menekşe Yaprağı • Geosmin (Toprak)",
            base: "Sandal Ağacı • Meşe Yosunu"
        },
        color: "#78866B", // Sage Green
        gradient: "radial-gradient(circle at center, #1a2615 0%, #000000 70%)",
        image: "/parfum/scandalea/violet&moss.jpeg",
        vibe: "Natural"
    },
    {
        id: "misfit",
        name: "MISFIT",
        tagline: "THE OUTSIDER",
        description: "Gotik bir başkaldırı. Siyah kiraz ve derinin karanlık uyumu.",
        notes: {
            top: "Siyah Kiraz",
            heart: "Deri • Tütsü",
            base: "Paçuli • Karanlık Reçine"
        },
        color: "#4B0082", // Deep Indigo/Black
        gradient: "radial-gradient(circle at center, #180029 0%, #000000 70%)",
        image: "/parfum/scandalea/misfit.jpeg",
        vibe: "Gothic"
    },
    {
        id: "gourmet",
        name: "BURNT VANILLA",
        tagline: "GOURMET SERIES",
        description: "Fırından yeni çıkmış bir brioche ve konyak. Sıcak, yenilebilir, bağımlılık yapıcı.",
        notes: {
            top: "Acı Badem • Konyak",
            heart: "Kızarmış Brioche • Tarçın",
            base: "Sandal • Vanilya • Misk"
        },
        color: "#C68E17", // Burnt Amber
        gradient: "radial-gradient(circle at center, #3d2b05 0%, #000000 70%)",
        image: "/parfum/scandalea/gourmet.jpeg",
        vibe: "Warm"
    }
];
