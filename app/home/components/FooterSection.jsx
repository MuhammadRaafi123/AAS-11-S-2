    "use client";

    import {
    MapPin,
    Phone,
    Mail,
    ArrowUp,
    Globe,
    BadgeInfo,
    } from "lucide-react";

    export default function FooterSection() {

    return (
        <footer className="mt-16 pb-8">

        {/* Container */}
        <div
            className="
            bg-[#161b22]/40
            backdrop-blur-sm
            border border-gray-800/70
            rounded-3xl
            p-8 md:p-10
            "
        >

            {/* Grid */}
            <div className="grid md:grid-cols-4 gap-10">

            {/* Brand */}
            <div>

                <h2
                className="
                    text-2xl
                    font-bold
                    text-white
                "
                >
                LAPOR
                </h2>

                <p
                className="
                    text-gray-400
                    mt-4
                    text-sm
                    leading-7
                "
                >
                Platform pengaduan masyarakat modern
                untuk menciptakan pelayanan publik
                yang transparan dan responsif.
                </p>

            </div>

            {/* Links */}
            <div>

                <h3
                className="
                    text-lg
                    font-semibold
                    text-white
                    mb-5
                "
                >
                Tautan
                </h3>

                <ul className="space-y-4 text-sm">

                <li
                    className="
                    text-gray-400
                    hover:text-white
                    transition
                    cursor-pointer
                    "
                >
                    Pantau Laporan
                </li>

                <li
                    className="
                    text-gray-400
                    hover:text-white
                    transition
                    cursor-pointer
                    "
                >
                    Hubungi Kami
                </li>

                </ul>

            </div>

            {/* Contact */}
            <div>

                <h3
                className="
                    text-lg
                    font-semibold
                    text-white
                    mb-5
                "
                >
                Kontak
                </h3>

                <div className="space-y-5 text-sm">

                <div className="flex items-start gap-3">

                    <MapPin
                    size={18}
                    className="text-blue-400 mt-1"
                    />

                    <p className="text-gray-400 leading-6">
                    Jl. Gg.Masjid Cilasak Al Ishlah No.7,
                    Depok
                    </p>

                </div>

                <div className="flex items-center gap-3">

                    <Phone
                    size={18}
                    className="text-blue-400"
                    />

                    <p className="text-gray-400">
                    +62 852 8012 2758
                    </p>

                </div>

                <div className="flex items-center gap-3">

                    <Mail
                    size={18}
                    className="text-blue-400"
                    />

                    <p className="text-gray-400">
                    kontak@lapor.go.id
                    </p>

                </div>

                </div>

            </div>

            {/* Social */}
            <div>

                <h3
                className="
                    text-lg
                    font-semibold
                    text-white
                    mb-5
                "
                >
                Sosial Media
                </h3>

                <div className="flex gap-4">

                <button
                    className="
                    w-11 h-11
                    rounded-xl
                    border border-gray-700
                    flex items-center justify-center
                    text-gray-400
                    hover:text-white
                    hover:border-blue-500/40
                    hover:bg-blue-500/10
                    transition
                    "
                >
                    <Globe size={18} />
                </button>

                <button
                    className="
                    w-11 h-11
                    rounded-xl
                    border border-gray-700
                    flex items-center justify-center
                    text-gray-400
                    hover:text-white
                    hover:border-blue-500/40
                    hover:bg-blue-500/10
                    transition
                    "
                >
                    <BadgeInfo size={18} />
                </button>

                </div>

            </div>

            </div>

            {/* Bottom */}
            <div
            className="
                border-t border-gray-800
                mt-10 pt-6
                flex flex-col md:flex-row
                items-center justify-between
                gap-5
            "
            >

            <p className="text-gray-500 text-sm">
                © 2026 LAPOR. Sistem Pengaduan Masyarakat.
            </p>

            <button
                onClick={() =>
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                })
                }
                className="
                w-11 h-11
                rounded-xl
                border border-gray-700
                flex items-center justify-center
                text-gray-400
                hover:text-white
                hover:border-blue-500/40
                hover:bg-blue-500/10
                transition
                "
            >
                <ArrowUp size={18} />
            </button>

            </div>

        </div>

        </footer>
    );
    }