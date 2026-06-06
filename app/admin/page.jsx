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

// Import helper penarik data (hanya getAktivitas)
import { getAktivitas } from "../super_admin/dashboard/data";

// --- SKELETON LOADING (tetap sama) ---
function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-white/10"></div>
                    <div className="flex-1">
                        <div className="h-3 bg-white/10 rounded w-20 mb-2"></div>
                        <div className="h-6 bg-white/10 rounded w-12"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function BarSkeleton() {
    return (
        <div className="bg-[#0d1424] rounded-2xl border border-white/5 p-5 shadow-xl animate-pulse">
            <div className="h-5 bg-white/10 rounded w-40 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-64 mb-6"></div>
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i}>
                        <div className="flex justify-between mb-1">
                            <div className="h-3 bg-white/10 rounded w-32"></div>
                            <div className="h-3 bg-white/10 rounded w-10"></div>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-white/10 h-full w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ActivitySkeleton() {
    return (
        <div className="bg-[#0d1424] rounded-2xl border border-white/5 p-5 shadow-xl animate-pulse">
            <div className="h-5 bg-white/10 rounded w-32 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-48 mb-6"></div>
            <div className="space-y-4 pl-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-white/10 mt-1"></div>
                        <div className="flex-1">
                            <div className="h-3 bg-white/10 rounded w-full mb-1"></div>
                            <div className="h-2 bg-white/10 rounded w-32"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- KOMPONEN PEMBANTU ---
function StatCard({ icon, label, value, bgIcon }) {
    return (
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl hover:shadow-2xl transition">
            <div className={`w-12 h-12 rounded-xl ${bgIcon} flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
        </div>
    );
}

function ProgressItem({ label, count, percent, color, icon }) {
    return (
        <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
                <span>
                    {icon} {label} ({count})
                </span>
                <span className="text-gray-400">{percent}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                <div className={`${color} h-full transition-all duration-500`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}

// --- KOMPONEN UTAMA DASHBOARD ---
export default function AdminDashboardPage() {
    const [activeNav, setActiveNav] = useState("dashboard");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [logAktivitas, setLogAktivitas] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        menunggu: 0,
        diproses: 0,
        selesai: 0,
        ditolak: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchDashboardData(parsedUser?.role || "masyarakat");
        } else {
            fetchDashboardData("masyarakat");
        }
    }, []);

    async function fetchDashboardData(role) {
        setLoading(true);
        await Promise.all([
            fetchStatistikData(),
            fetchLogAktivitasData(role)
        ]);
        setLoading(false);
    }

    async function fetchLogAktivitasData(role) {
        try {
            const dataRes = await getAktivitas(role);
            if (Array.isArray(dataRes)) {
                setLogAktivitas(dataRes);
            } else if (dataRes && Array.isArray(dataRes.data)) {
                setLogAktivitas(dataRes.data);
            } else {
                setLogAktivitas([]);
            }
        } catch (error) {
            console.error("Gagal memuat log aktivitas:", error);
            setLogAktivitas([]);
        }
    }

    async function fetchStatistikData() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/complaints", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal mengambil data");

            if (Array.isArray(data)) {
                const hitung = data.reduce((acc, item) => {
                    acc.total += 1;
                    if (item.status === "menunggu_verifikasi") acc.menunggu += 1;
                    if (item.status === "diproses" || item.status === "diverifikasi") acc.diproses += 1;
                    if (item.status === "selesai") acc.selesai += 1;
                    if (item.status === "ditolak") acc.ditolak += 1;
                    return acc;
                }, { total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0 });
                setStats(hitung);
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan server saat memuat statistik");
        }
    }

    const hitungPersen = (jumlah) => {
        if (stats.total === 0) return 0;
        return ((jumlah / stats.total) * 100).toFixed(1);
    };

    return (

        

        <div className="flex min-h-screen bg-[#080d1a] text-gray-100 antialiased">
            <Sidebar 
                activeNav={activeNav} 
                setActiveNav={setActiveNav}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar 
                    title="Statistik" 
                    subtitle="Analisis Laporan Pengaduan"
                    sidebarWidth={260}
                    sidebarCollapsed={sidebarCollapsed}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-20 pb-24 md:pb-6 space-y-6">
                    {/* ===== HEADER + TOMBOL REFRESH (DIPERBAIKI) ===== */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-5"></div>

                    {/* Kartu Statistik */}
                    {loading ? (
                        <StatsSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <StatCard 
                                icon={<HiOutlineDocumentText className="w-6 h-6 text-blue-400" />}
                                label="TOTAL MASUK"
                                value={stats.total}
                                bgIcon="bg-blue-500/10"
                            />
                            <StatCard 
                                icon={<HiOutlineClock className="w-6 h-6 text-amber-400" />}
                                label="MENUNGGU"
                                value={stats.menunggu}
                                bgIcon="bg-amber-500/10"
                            />
                            <StatCard 
                                icon={<HiOutlineClipboardCheck className="w-6 h-6 text-violet-400" />}
                                label="DIPROSES"
                                value={stats.diproses}
                                bgIcon="bg-violet-500/10"
                            />
                            <StatCard 
                                icon={<HiOutlineCheckCircle className="w-6 h-6 text-emerald-400" />}
                                label="SELESAI"
                                value={stats.selesai}
                                bgIcon="bg-emerald-500/10"
                            />
                            <StatCard 
                                icon={<HiOutlineXCircle className="w-6 h-6 text-red-400" />}
                                label="DITOLAK"
                                value={stats.ditolak}
                                bgIcon="bg-red-500/10"
                            />
                        </div>
                    )}

                    {/* Layout dua kolom: Rasio Status + Aktivitas Terkini */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Rasio Status Penyelesaian */}
                        {loading ? (
                            <BarSkeleton />
                        ) : (
                            <div className="bg-[#0d1424] rounded-2xl border border-white/5 p-5 shadow-xl">
                                <h2 className="text-base font-bold text-white mb-1">Rasio Status Penyelesaian</h2>
                                <p className="text-xs text-gray-400 mb-6">Persentase pembagian status tindak lanjut dari seluruh laporan masuk.</p>
                                <div className="space-y-5">
                                    <ProgressItem 
                                        label="Menunggu Verifikasi" 
                                        count={stats.menunggu} 
                                        percent={hitungPersen(stats.menunggu)} 
                                        color="bg-amber-500" 
                                        icon="🟡"
                                    />
                                    <ProgressItem 
                                        label="Sedang Diproses" 
                                        count={stats.diproses} 
                                        percent={hitungPersen(stats.diproses)} 
                                        color="bg-violet-500" 
                                        icon="🟣"
                                    />
                                    <ProgressItem 
                                        label="Selesai" 
                                        count={stats.selesai} 
                                        percent={hitungPersen(stats.selesai)} 
                                        color="bg-emerald-500" 
                                        icon="🟢"
                                    />
                                    <ProgressItem 
                                        label="Ditolak" 
                                        count={stats.ditolak} 
                                        percent={hitungPersen(stats.ditolak)} 
                                        color="bg-red-500" 
                                        icon="🔴"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Aktivitas Terkini */}
                        {loading ? (
                            <ActivitySkeleton />
                        ) : (
                            <div className="bg-[#0d1424] rounded-2xl border border-white/5 p-5 shadow-xl">
                                <h2 className="text-base font-bold text-white mb-1">Aktivitas Terkini</h2>
                                <p className="text-xs text-gray-400 mb-4">Log aktivitas sistem dan penanganan laporan terbaru.</p>
                                <div className="relative border-l-2 border-white/5 pl-4 ml-2 max-h-[320px] overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                                    {Array.isArray(logAktivitas) && logAktivitas.length > 0 ? (
                                        logAktivitas.map((log, index) => (
                                            <div key={index} className="relative group">
                                                <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-violet-500 ring-4 ring-[#0d1424] transition-transform group-hover:scale-125" />
                                                <div>
                                                    <p className="text-xs text-gray-200 font-medium leading-relaxed">
                                                        {log.aksi}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 mt-1">
                                                        Oleh: <span className="text-gray-400 font-semibold">{log.pengguna}</span> • {log.waktu}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500 py-4 text-center">Tidak ada log aktivitas terbaru.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(139,92,246,0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139,92,246,0.8);
                }
            `}</style>
        </div>
    );
}