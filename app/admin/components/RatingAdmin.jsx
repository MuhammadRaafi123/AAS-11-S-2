"use client";

import { useEffect, useState } from "react";
import {
    HiStar,
    HiOutlineStar,
    HiOutlineSearch,
    HiOutlineClipboardList,
    HiOutlineCheckCircle,
    HiOutlineRefresh,
    HiOutlineChartBar,
    HiOutlineFilter,
} from "react-icons/hi";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";

export default function RatingAdmin() {
    // =====================
    // STATE
    // =====================
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterBintang, setFilterBintang] = useState("semua");

    // =====================
    // STATISTIK RATING
    // =====================
    const [ratingStats, setRatingStats] = useState({
        totalRating: 0,
        rataRata: 0,
        bintang5: 0,
        bintang4: 0,
        bintang3: 0,
        bintang2: 0,
        bintang1: 0,
    });

    // =====================
    // FETCH DATA
    // =====================
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/complaints", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (!res.ok) {
                console.error("Gagal fetch:", data.message);
                return;
            }

            const allData = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];

            // Hanya yang sudah selesai dan punya rating
            const ratedComplaints = allData.filter(
                (item) => item.status === "selesai" && item.rating != null
            );

            setComplaints(allData.filter((item) => item.status === "selesai"));

            // Hitung statistik
            const totalRating = ratedComplaints.length;
            const sumRating = ratedComplaints.reduce((acc, item) => acc + Number(item.rating), 0);
            const rataRata = totalRating > 0 ? (sumRating / totalRating).toFixed(1) : 0;

            const count = (bintang) =>
                ratedComplaints.filter((item) => Number(item.rating) === bintang).length;

            setRatingStats({
                totalRating,
                rataRata,
                bintang5: count(5),
                bintang4: count(4),
                bintang3: count(3),
                bintang2: count(2),
                bintang1: count(1),
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =====================
    // FILTER & SEARCH
    // =====================
    const filtered = complaints.filter((item) => {
        const matchSearch =
            (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
            (item.ticket_number || "").toLowerCase().includes(search.toLowerCase());

        const matchFilter =
            filterBintang === "semua"
                ? true
                : filterBintang === "belum"
                ? item.rating == null
                : Number(item.rating) === Number(filterBintang);

        return matchSearch && matchFilter;
    });

    // =====================
    // RENDER BINTANG
    // =====================
    const renderStars = (rating, size = 18) => {
        return [1, 2, 3, 4, 5].map((star) =>
            star <= rating ? (
                <HiStar key={star} size={size} className="text-amber-400" />
            ) : (
                <HiOutlineStar key={star} size={size} className="text-gray-600" />
            )
        );
    };

    // Persentase bar rating
    const persen = (jumlah) =>
        ratingStats.totalRating === 0 ? 0 : ((jumlah / ratingStats.totalRating) * 100).toFixed(0);

    return (
        <div className="space-y-6">

            {/* ============================================================ */}
            {/* HEADER HALAMAN */}
            {/* ============================================================ */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-5">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
                        <HiStar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                            Manajemen Rating & Penilaian
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Pantau kepuasan masyarakat terhadap penanganan laporan pengaduan.
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-amber-600/20 w-full md:w-auto"
                >
                    <HiOutlineRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh Data
                </button>
            </div>

            {/* ============================================================ */}
            {/* KARTU STATISTIK */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* TOTAL LAPORAN SELESAI */}
                <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <HiOutlineClipboardList className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Laporan Selesai</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                            {loading ? "..." : complaints.length}
                        </h3>
                    </div>
                </div>

                {/* TOTAL YANG SUDAH DI-RATING */}
                <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                        <HiOutlineCheckCircle className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Sudah Dinilai</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                            {loading ? "..." : ratingStats.totalRating}
                        </h3>
                    </div>
                </div>

                {/* RATA-RATA RATING */}
                <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <HiOutlineChartBar className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Rata-Rata Rating</p>
                        <div className="flex items-center gap-2 mt-1">
                            <h3 className="text-2xl font-bold text-amber-400">
                                {loading ? "..." : ratingStats.rataRata}
                            </h3>
                            <div className="flex">
                                {!loading && renderStars(Math.round(ratingStats.rataRata), 16)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================ */}
            {/* GRAFIK DISTRIBUSI BINTANG */}
            {/* ============================================================ */}
            <div className="bg-[#0d1424] rounded-2xl border border-white/5 p-4 md:p-6 shadow-xl shadow-black/20">
                <div className="flex items-center gap-2 mb-1">
                    <HiOutlineArrowTrendingUp className="text-amber-400 w-5 h-5" />
                    <h2 className="text-base font-bold text-white">Distribusi Rating Masyarakat</h2>
                </div>
                <p className="text-xs text-gray-400 mb-6">
                    Sebaran penilaian bintang dari seluruh laporan yang telah selesai ditangani.
                </p>

                {loading ? (
                    <div className="py-10 text-center text-sm text-gray-500 font-medium animate-pulse">
                        Menghitung distribusi rating...
                    </div>
                ) : ratingStats.totalRating === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-500">
                        Belum ada penilaian yang masuk.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((bintang) => {
                            const jumlah = ratingStats[`bintang${bintang}`];
                            const pct = persen(jumlah);
                            const colors = {
                                5: "bg-emerald-500",
                                4: "bg-blue-500",
                                3: "bg-amber-500",
                                2: "bg-orange-500",
                                1: "bg-red-500",
                            };
                            return (
                                <div key={bintang}>
                                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-0.5">
                                                {renderStars(bintang, 14)}
                                            </div>
                                            <span className="text-gray-400">({jumlah} ulasan)</span>
                                        </div>
                                        <span className="text-gray-400">{pct}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`${colors[bintang]} h-full rounded-full transition-all duration-700`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ============================================================ */}
            {/* FILTER & SEARCH */}
            {/* ============================================================ */}
            <div className="bg-[#0d1424] rounded-2xl border border-white/5 p-4 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Cari judul laporan atau nomor tiket..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-[#080d1a] text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                        />
                    </div>

                    {/* Filter Bintang */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <HiOutlineFilter className="text-gray-500 w-4 h-4" />
                        {["semua", "5", "4", "3", "2", "1", "belum"].map((val) => (
                            <button
                                key={val}
                                onClick={() => setFilterBintang(val)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                    filterBintang === val
                                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                        : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                                }`}
                            >
                                {val === "semua"
                                    ? "Semua"
                                    : val === "belum"
                                    ? "Belum Dinilai"
                                    : `⭐ ${val}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============================================================ */}
            {/* LIST LAPORAN DENGAN RATING */}
            {/* ============================================================ */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-16 text-gray-500 animate-pulse text-sm">
                        Memuat data laporan...
                    </div>
                ) : filtered.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1424] p-10 text-center shadow-xl">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <HiOutlineStar className="w-8 h-8 text-amber-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Tidak Ada Data</h3>
                        <p className="text-gray-500 text-sm">
                            Tidak ada laporan yang cocok dengan filter yang dipilih.
                        </p>
                    </div>
                ) : (
                    filtered.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 shadow-xl hover:border-amber-500/10 transition-all duration-300"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                                {/* INFO KIRI */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap mb-1">
                                        <h2 className="text-base font-bold text-white truncate">
                                            {item.title}
                                        </h2>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                            Selesai
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-6 line-clamp-2 mt-1">
                                        {item.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                                        <span>🎫 {item.ticket_number}</span>
                                        <span>📅 {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                                        {item.nama_pelapor && <span>👤 {item.nama_pelapor}</span>}
                                    </div>
                                </div>

                                {/* BOX RATING KANAN */}
                                <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
                                    {item.rating != null ? (
                                        /* SUDAH DINILAI */
                                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 min-w-[200px]">
                                            <p className="text-xs text-gray-400 font-medium mb-2">
                                                Penilaian Masyarakat
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-0.5">
                                                    {renderStars(Number(item.rating), 20)}
                                                </div>
                                                <span className="text-lg font-bold text-amber-400">
                                                    {item.rating}.0
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {Number(item.rating) === 5
                                                    ? "😍 Sangat Puas"
                                                    : Number(item.rating) === 4
                                                    ? "😊 Puas"
                                                    : Number(item.rating) === 3
                                                    ? "😐 Cukup"
                                                    : Number(item.rating) === 2
                                                    ? "😕 Kurang Puas"
                                                    : "😞 Tidak Puas"}
                                            </p>
                                        </div>
                                    ) : (
                                        /* BELUM DINILAI */
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-[200px]">
                                            <p className="text-xs text-gray-500 font-medium mb-2">
                                                Belum Dinilai
                                            </p>
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <HiOutlineStar key={star} size={20} className="text-gray-700" />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-2">
                                                Menunggu penilaian dari masyarakat
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
