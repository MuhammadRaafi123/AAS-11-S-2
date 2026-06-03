    "use client";

    import { MapPin, Phone, Mail, ArrowUp, Globe, BadgeInfo } from "lucide-react";

    export default function FooterSection() {
    return (
        <footer className="bg-[#020817] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-14">
            <div>
                <h2 className="text-3xl font-bold mb-6">LAPOR</h2>
                <p className="text-gray-400 leading-relaxed">Berkomitmen untuk menciptakan transparansi dan pelayanan publik yang responsif bagi seluruh masyarakat Indonesia.</p>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-6">Tautan Cepat</h3>
                <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white transition cursor-pointer">Pantau Laporan</li>
                <li className="hover:text-white transition cursor-pointer">Hubungi Kami</li>
                </ul>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-6">Hubungi Kami</h3>
                <div className="space-y-5 text-gray-400">
                <div className="flex items-start gap-4"><MapPin className="text-blue-500 mt-1" /><p>Jl. Gg.Masjid Cilasak Al Ishlah. 7, Depok</p></div>
                <div className="flex items-center gap-4"><Phone className="text-blue-500" /><p>+62 852 8012 2758</p></div>
                <div className="flex items-center gap-4"><Mail className="text-blue-500" /><p>kontak@lapor.go.id</p></div>
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-6">Media Sosial</h3>
                <div className="flex gap-5">
                <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center hover:bg-blue-600 transition cursor-pointer"><Globe /></div>
                <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center hover:bg-blue-600 transition cursor-pointer"><BadgeInfo /></div>
                </div>
            </div>
            </div>
            <div className="border-t border-gray-800 my-14"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-400 text-center md:text-left">© 2026 LAPOR. Sistem Pengaduan Masyarakat Terpadu.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center hover:bg-blue-600 transition">
                <ArrowUp />
            </button>
            </div>
        </div>
        </footer>
    );
    }