    import { Wallet, Users, Trophy } from "lucide-react";

    export default function StepsSection() {
    const steps = [
        { icon: <Wallet size={28} />, title: "Buat Laporan", desc: "Sampaikan aspirasi atau keluhan Anda melalui formulir digital yang aman dan mudah." },
        { icon: <Users size={28} />, title: "Proses Verifikasi", desc: "Tim kami akan meninjau dan meneruskan laporan Anda ke instansi terkait secara transparan." },
        { icon: <Trophy size={28} />, title: "Pantau Hasil", desc: "Dapatkan notifikasi real-time hingga laporan Anda dinyatakan selesai ditindaklanjuti." },
    ];

    return (
        <section className="bg-gray-900 pt-4 pb-20 px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-blue-400 mb-16">
            Langkah Mudah Melapor
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
            <div key={index} className="bg-gray-800 rounded-3xl shadow-md p-10 text-center hover:shadow-lg transition-all duration-300 border border-gray-700/50">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-blue-900/40 text-blue-400 rounded-full mb-6">
                {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
            ))}
        </div>
        </section>
    );
    }