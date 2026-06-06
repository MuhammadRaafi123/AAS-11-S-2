    "use client";

    import Link from "next/link";
    import {
    HiOutlineArrowRight,
    HiOutlinePlay,
    } from "react-icons/hi";

    export default function HeroSection() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">

        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-700/60">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">

            {/* Logo */}
            <h1 className="text-2xl font-extrabold tracking-wide text-white">
                LAPORAN <span className="text-blue-500">KUH</span>
            </h1>

            {/* Auth Button */}
            <div className="hidden md:flex items-center gap-4">

                <Link href="/landing/register">
                <button
                    className="
                    border border-gray-600
                    hover:border-blue-500
                    hover:bg-blue-900/20
                    transition-all duration-300
                    text-white
                    px-6 py-3
                    rounded-full
                    font-semibold
                    "
                >
                    Register
                </button>
                </Link>

                <Link href="/landing/login">
                <button
                    className="
                    bg-blue-600
                    hover:bg-blue-700
                    transition-all duration-300
                    text-white
                    px-6 py-3
                    rounded-full
                    shadow-lg
                    font-semibold
                    "
                >
                    Login
                </button>
                </Link>

            </div>
            </div>
        </nav>

        {/* Hero */}
        <section className="relative pt-40 pb-24 px-6 md:px-10">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
                Platform Pengaduan Modern
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
                <span className="text-blue-400">
                    Suara Anda,
                </span>
                <br />
                Perubahan Kita
                </h1>

                <p className="mt-7 text-lg text-gray-400 leading-relaxed max-w-xl">
                Sampaikan aspirasi, kritik, maupun pengaduan secara cepat
                dan transparan kepada instansi terkait.
                Bersama masyarakat, kita ciptakan pelayanan publik
                yang lebih modern, responsif, dan terpercaya.
                </p>

                {/* Button */}
                <div className="flex flex-wrap items-center gap-4 mt-10">

                <Link
                    href="/landing/login"
                    className="
                    flex items-center gap-2
                    bg-blue-600 hover:bg-blue-700
                    transition-all duration-300
                    text-white
                    px-7 py-4
                    rounded-full
                    shadow-xl
                    font-semibold
                    "
                >
                    Buat Laporan
                    <HiOutlineArrowRight size={20} />
                </Link>

                <button
                    className="
                    flex items-center gap-3
                    border border-gray-600
                    hover:border-blue-500
                    hover:bg-blue-900/20
                    transition-all duration-300
                    px-7 py-4
                    rounded-full
                    text-gray-300
                    font-medium
                    "
                >
                    <span className="w-10 h-10 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400">
                    <HiOutlinePlay size={18} />
                    </span>

                    Cara Melapor
                </button>

                </div>
            </div>

            {/* Right */}
            <div className="relative flex justify-center">

                {/* Glow */}
                <div className="absolute w-[420px] h-[420px] bg-blue-800/20 blur-3xl rounded-full"></div>

                {/* Image */}
                <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop"
                alt="Aspirasi Masyarakat"
                className="
                    relative z-10
                    w-[340px] md:w-[450px]
                    h-[500px]
                    object-cover
                    rounded-[2rem]
                    shadow-2xl
                    border-8 border-gray-800
                "
                />

                {/* Floating Card */}
                <div
                className="
                    absolute bottom-8 -right-5
                    bg-gray-800
                    shadow-xl
                    rounded-2xl
                    p-4
                    z-20
                    border border-gray-700
                "
                >
                
                </div>

            </div>
            </div>
        </section>
        </div>
    );
    }