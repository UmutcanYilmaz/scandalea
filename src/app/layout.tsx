import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
    ssr: false,
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "Scandalea",
    description: "A sub-brand of luxury",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} bg-black text-white antialiased`}>
                <SmoothScroll>
                    <Scene />
                    {children}
                </SmoothScroll>
            </body>
        </html>
    );
}
