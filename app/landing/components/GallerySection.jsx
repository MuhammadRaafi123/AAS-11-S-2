    "use client";

    export default function GallerySection() {
    const images = [
        { image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3", title: "Jalan Rusak", desc: "Laporan jalan rusak di Bekasi Timur yang membahayakan pengendara." },
        { image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", title: "Lampu Jalan Mati", desc: "Lampu penerangan umum mati selama beberapa hari." },
        { image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a", title: "Sampah Menumpuk", desc: "Sampah menumpuk di area pasar dan mengganggu warga." },
        { image: "https://images.unsplash.com/photo-1494526585095-c41746248156", title: "Drainase Tersumbat", desc: "Saluran air tersumbat dan menyebabkan banjir." },
    ];

    return (
        <section className="bg-[#050816] py-24 px-6 overflow-hidden">
        <div className="text-center mb-16">
            <span className="px-5 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold">Gallery Laporan</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-6">Laporan Masyarakat</h1>
            <p className="text-gray-400 mt-5 max-w-2xl mx-auto text-lg">Dokumentasi laporan masyarakat yang dikirim melalui sistem pengaduan online.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {images.map((item, index) => (
            <div key={index} className="relative h-[650px] rounded-[40px] overflow-hidden group border border-gray-700">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-blue-900/60"></div>
                <div className="absolute left-0 top-0 h-full w-28 bg-white/10 backdrop-blur-md flex items-center justify-center z-20">
                <span className="rotate-[-90deg] tracking-[10px] text-white text-sm font-semibold">SUCCESS</span>
                </div>
                <div className="absolute inset-0 flex items-end p-7 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-30">
                <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5">
                    <h2 className="text-2xl font-black text-white">{item.title}</h2>
                    <p className="text-gray-200 mt-3 leading-relaxed text-sm">{item.desc}</p>
                </div>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
    }