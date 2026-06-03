"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import {
    HiOutlineChartBar,
    HiOutlineRefresh,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineDocumentText,
    HiOutlineClipboardCheck
} from "react-icons/hi";

export default function AdminDashboardPage() {
    // State untuk mengontrol menu aktif di sidebar
    const [activeNav, setActiveNav] = useState("dashboard");

    // State untuk menampung data hitungan statistik
    const [stats, setStats] = useState({
        total: 0,
        menunggu: 0,
        diproses: 0,
        selesai: 0,
        ditolak: 0
    });
    const [loading, setLoading] = useState(true);

    // ======================================================
    // GET DATA & HITUNG STATISTIK (Langsung dari API Laporan)
    // ======================================================
    async function fetchStatistikData() {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            const res = await fetch("http://localhost:5000/api/complaints", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            
            if (!res.ok) {
                alert(data.message || "Gagal mengambil data statistik");
                return;
            }

            // Proses hitung otomatis berdasarkan status dari database
            const hitung = data.reduce((acc, item) => {
                acc.total += 1;
                if (item.status === "menunggu_verifikasi") acc.menunggu += 1;
                if (item.status === "diproses" || item.status === "diverifikasi") acc.diproses += 1;
                if (item.status === "selesai") acc.selesai += 1;
                if (item.status === "ditolak") acc.ditolak += 1;
                return acc;
            }, { total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0 });

            setStats(hitung);

        } catch (err) {
            console.log(err);
            alert("Terjadi kesalahan server saat memuat statistik");
        } finally {
            setLoading(false);
        }
    }

    // Load data pertama kali saat halaman dibuka
    useEffect(() => {
        fetchStatistikData();
    }, []);

    // Fungsi pembantu menghitung persentase grafik batang
    const hitungPersen = (jumlah) => {
        if (stats.total === 0) return 0;
        return ((jumlah / stats.total) * 100).toFixed(1);
    };

    return (
        <div className="flex min-h-screen bg-[#080d1a] text-gray-100 antialiased">
            {/* 1. SIDEBAR COMPONENT */}
            <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* TOPBAR */}
                <Topbar />

                {/* WRAPPER KONTEN UTAMA */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 md:pb-6">
                    
                    {/* HEADER HALAMAN */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
                                <HiOutlineChartBar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                                    Statistik & Analisis Laporan
                                </h1>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Pantau grafik perkembangan dan performa penanganan pengaduan masyarakat.
                                </p>
                            </div>
                        </div>

                        {/* Tombol Refresh */}
                        <button 
                            onClick={fetchStatistikData}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-violet-600/20 w-full md:w-auto"
                        >
                            <HiOutlineRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh Data
                        </button>
                    </div>

                    {/* KARTU RINGKASAN UTAMA (GRID CARDS) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        
                        {/* TOTAL */}
                        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                <HiOutlineDocumentText className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Masuk</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{loading ? "..." : stats.total}</h3>
                            </div>
                        </div>

                        {/* MENUNGGU VERIFIKASI */}
                        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                                <HiOutlineClock className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Menunggu</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{loading ? "..." : stats.menunggu}</h3>
                            </div>
                        </div>

                        {/* DIPROSES */}
                        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                                <HiOutlineClipboardCheck className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Diproses</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{loading ? "..." : stats.diproses}</h3>
                            </div>
                        </div>

                        {/* SELESAI */}
                        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                <HiOutlineCheckCircle className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Selesai</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{loading ? "..." : stats.selesai}</h3>
                            </div>
                        </div>

                        {/* DITOLAK */}
                        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                                <HiOutlineXCircle className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Ditolak</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{loading ? "..." : stats.ditolak}</h3>
                            </div>
                        </div>

                    </div>

                    {/* GRAPHIC CONTAINER */}
                    <div className="bg-[#0d1424] rounded-2xl border border-white/5 p-4 md:p-6 shadow-xl shadow-black/20">
                        <h2 className="text-base font-bold text-white mb-1">Rasio Status Penyelesaian</h2>
                        <p className="text-xs text-gray-400 mb-6">Persentase pembagian status tindak lanjut dari seluruh laporan masyarakat.</p>

                        {loading ? (
                            <div className="py-12 text-center text-sm text-gray-500 font-medium animate-pulse">
                                Menghitung matriks laporan...
                            </div>
                        ) : (
                            <div className="space-y-5">
                                
                                {/* BAR MENUNGGU */}
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-2">
                                        <span className="text-amber-400">🟡 Menunggu Verifikasi ({stats.menunggu})</span>
                                        <span className="text-gray-400">{hitungPersen(stats.menunggu)}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${hitungPersen(stats.menunggu)}%` }}></div>
                                    </div>
                                </div>

                                {/* BAR DIPROSES */}
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-2">
                                        <span className="text-violet-400">🟣 Sedang Diproses / Diverifikasi ({stats.diproses})</span>
                                        <span className="text-gray-400">{hitungPersen(stats.diproses)}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-violet-500 h-full transition-all duration-500" style={{ width: `${hitungPersen(stats.diproses)}%` }}></div>
                                    </div>
                                </div>

                                {/* BAR SELESAI */}
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-2">
                                        <span className="text-emerald-400">🟢 Selesai Ditangani ({stats.selesai})</span>
                                        <span className="text-gray-400">{hitungPersen(stats.selesai)}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${hitungPersen(stats.selesai)}%` }}></div>
                                    </div>
                                </div>

                                {/* BAR DITOLAK */}
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-2">
                                        <span className="text-red-400">🔴 Laporan Ditolak ({stats.ditolak})</span>
                                        <span className="text-gray-400">{hitungPersen(stats.ditolak)}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${hitungPersen(stats.ditolak)}%` }}></div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
}