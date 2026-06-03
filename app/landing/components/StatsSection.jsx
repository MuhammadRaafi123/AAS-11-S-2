    "use client";

    import { useEffect, useState } from "react";
    import { BiSolidReport } from "react-icons/bi";

    export default function StatsSection() {
    const stats = [
        { icon: <BiSolidReport size={28} />, value: 12450, label: "TOTAL LAPORAN", suffix: "" },
        { icon: "🔄", value: 842, label: "DALAM PROSES", suffix: "" },
        { icon: "📍", value: 11200, label: "LAPORAN SELESAI", suffix: "+" },
    ];

    const [counts, setCounts] = useState(stats.map(() => 0));

    useEffect(() => {
        stats.forEach((stat, index) => {
        let start = 0;
        const end = stat.value;
        const duration = 2000;
        const increment = end / (duration / 20);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { start = end; clearInterval(timer); }
            setCounts((prev) => { const updated = [...prev]; updated[index] = Math.floor(start); return updated; });
        }, 20);
        });
    }, []);

    return (
        <section className="bg-gradient-to-b from-[#020617] to-[#0f172a] text-white py-24 px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
            STATISTIK <span className="text-blue-500">DAMPAK NYATA</span>
            </h2>
            <p className="text-gray-400 mt-6">Transparansi data pelayanan publik untuk membangun kepercayaan masyarakat yang lebih kuat.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {stats.map((item, index) => (
            <div key={index} className="bg-[#0b1220] border border-gray-800 rounded-3xl p-10 text-center shadow-lg hover:scale-105 transition duration-300">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-full mb-6 text-2xl">
                {item.icon}
                </div>
                <h3 className="text-4xl font-bold">{counts[index].toLocaleString()}{item.suffix}</h3>
                <p className="text-gray-400 mt-3 tracking-widest text-sm">{item.label}</p>
                <div className="mt-6 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
    }