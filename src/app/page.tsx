import Link from "next/link";

export default function Home() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white space-y-8">
            <h1 className="text-4xl font-serif">Welcome to the Collection.</h1>
            <Link
                href="/scandalea"
                className="px-8 py-3 border border-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm"
            >
                Enter Scandalea
            </Link>
        </div>
    );
}
