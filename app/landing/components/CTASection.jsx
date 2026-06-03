    import { ShieldCheck, ArrowRight } from "lucide-react";

    export default function CTASection() {
    return (
        <section className="bg-gray-950 py-24 px-6">
        <div className="max-w-6xl mx-auto rounded-[50px] bg-gradient-to-r from-blue-800 via-blue-700 to-cyan-700 p-16 text-center text-white shadow-2xl shadow-blue-950/60 relative overflow-hidden">
            <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-100px] right-[-100px] w-72 h-72 bg-cyan-900/30 rounded-full blur-3xl"></div>
            <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md mb-10">
            <ShieldCheck size={40} />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Suara Anda, Langkah Awal<br />Perubahan.
            </h2>
            <p className="max-w-4xl mx-auto mt-10 text-lg md:text-2xl text-white/90 leading-relaxed">
            Laporkan kendala layanan publik di sekitar Anda dengan aman dan transparan.
            Kami hadir untuk memastikan setiap aspirasi masyarakat didengar dan ditindaklanjuti secara profesional.
            </p>
            <button className="mt-14 inline-flex items-center gap-4 bg-gray-900 text-blue-400 px-10 py-5 rounded-full text-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300">
            Laporkan Sekarang <ArrowRight size={26} />
            </button>
        </div>
        </section>
    );
    }