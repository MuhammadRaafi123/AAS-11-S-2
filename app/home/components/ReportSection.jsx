"use client";

import { useEffect, useRef, useState } from "react";
import {
    HiOutlineClipboardList,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineSearch,
    HiOutlineXCircle,
    HiStar,
    HiOutlineStar,
    HiOutlineX,
    HiOutlineTicket,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineLocationMarker,
    HiOutlineDocumentText,
    HiOutlinePhotograph,
    HiOutlineChevronRight,
    HiOutlineRefresh,
    HiOutlineTrash,
} from "react-icons/hi";
import Sidebar from "./Sidebar";
import Link from "next/link";

// Konfigurasi API (gunakan environment variable)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Mapping status ────────────────────────────────────────────────────────────
const STATUS_STYLE = {
    menunggu_verifikasi: "bg-red-500/10 text-red-400 border-red-500/20",
    diproses: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    selesai: "bg-green-500/10 text-green-400 border-green-500/20",
    diverifikasi: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    ditolak: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const STATUS_LABEL = {
    menunggu_verifikasi: "Menunggu Verifikasi",
    diproses: "Sedang Diproses",
    selesai: "Selesai",
    diverifikasi: "Diverifikasi",
    ditolak: "Ditolak",
};

const STATUS_ICON = {
    menunggu_verifikasi: <HiOutlineClock className="w-5 h-5" />,
    diproses: <HiOutlineRefresh className="w-5 h-5" />,
    selesai: <HiOutlineCheckCircle className="w-5 h-5" />,
    diverifikasi: <HiOutlineCheckCircle className="w-5 h-5" />,
    ditolak: <HiOutlineXCircle className="w-5 h-5" />,
};

// ─── Komponen bintang kecil (read-only) ────────────────────────────────────────
function StarDisplay({ rating, size = 18 }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) =>
                s <= rating ? (
                    <HiStar key={s} size={size} className="text-amber-400" />
                ) : (
                    <HiOutlineStar key={s} size={size} className="text-gray-600" />
                )
            )}
        </div>
    );
}

// ─── Modal Detail Laporan ──────────────────────────────────────────────────────
function DetailModal({ item, user, onClose, onRatingSubmit, onDelete }) {
    const overlayRef = useRef(null);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedStar, setSelectedStar] = useState(item?.rating || 0);
    const [submitting, setSubmitting] = useState(false);
    const [rated, setRated] = useState(item?.rating != null);
    const [currentRating, setCurrentRating] = useState(item?.rating || 0);

    function handleOverlayClick(e) {
        if (e.target === overlayRef.current) onClose();
    }

    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    async function handleSubmitRating() {
        if (!selectedStar) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/complaints/${item.id}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating: selectedStar }),
            });
            if (res.ok) {
                setRated(true);
                setCurrentRating(selectedStar);
                onRatingSubmit(item.id, selectedStar);
            } else {
                const error = await res.json();
                alert(error.message || "Gagal mengirim rating.");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat mengirim rating.");
        } finally {
            setSubmitting(false);
        }
    }

    if (!item) return null;

    const statusStyle = STATUS_STYLE[item.status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
    const statusLabel = STATUS_LABEL[item.status] || item.status;



    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f1629] border border-white/10 rounded-3xl shadow-2xl shadow-black/50">
                {/* HEADER MODAL */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0f1629]/95 backdrop-blur-sm border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <HiOutlineDocumentText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white leading-tight line-clamp-1">
                                {item.title}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">Detail Laporan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onDelete(item.id)}
                            className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition"
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
                        >
                            <HiOutlineX className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* BODY MODAL */}
                <div className="p-6 space-y-5">
                    {/* STATUS BADGE */}
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyle}`}>
                            {STATUS_ICON[item.status]}
                            {statusLabel}
                        </span>
                    </div>

                    {/* INFO TIKET */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-3.5">
                            <HiOutlineTicket className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Nomor Tiket</p>
                                <p className="text-sm font-bold text-white mt-0.5">{item.ticket_number || "-"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-3.5">
                            <HiOutlineCalendar className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Tanggal Lapor</p>
                                <p className="text-sm font-bold text-white mt-0.5">
                                    {item.created_at
                                        ? new Date(item.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })
                                        : "-"}
                                </p>
                            </div>
                        </div>
                        {item.nama_pelapor && (
                            <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-3.5">
                                <HiOutlineUser className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Pelapor</p>
                                    <p className="text-sm font-bold text-white mt-0.5">{item.nama_pelapor}</p>
                                </div>
                            </div>
                        )}
                        {item.location && (
                            <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-3.5">
                                <HiOutlineLocationMarker className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Lokasi</p>
                                    <p className="text-sm font-bold text-white mt-0.5">{item.location}</p>
                                </div>
                            </div>
                        )}
                        {item.category && (
                            <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-3.5">
                                <HiOutlineClipboardList className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Kategori</p>
                                    <p className="text-sm font-bold text-white mt-0.5 capitalize">{item.category}</p>
                                </div>
                            </div>
                        )}
                        {item.updated_at && (
                            <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-3.5">
                                <HiOutlineRefresh className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Diperbarui</p>
                                    <p className="text-sm font-bold text-white mt-0.5">
                                        {new Date(item.updated_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DESKRIPSI */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">
                            Deskripsi Laporan
                        </p>
                        <p className="text-sm text-gray-300 leading-7">
                            {item.description || "Tidak ada deskripsi."}
                        </p>
                    </div>

                    {/* ALASAN PENOLAKAN */}
                    {item.status === "ditolak" && item.rejection_reason && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                            <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider mb-2">
                                Alasan Penolakan
                            </p>
                            <p className="text-sm text-red-300 leading-7">{item.rejection_reason}</p>
                        </div>
                    )}

                    {/* FOTO BUKTI */}
                    {item.image_url && (
                        <div>
                            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <HiOutlinePhotograph className="w-4 h-4" />
                                Foto Bukti
                            </p>
                            <div className="rounded-xl overflow-hidden border border-white/10">
                                <img
                                    src={item.image_url.startsWith("http") ? item.image_url : `${API_URL.replace('/api', '')}${item.image_url}`}
                                    alt="Bukti laporan"
                                    className="w-full max-h-64 object-cover"
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            </div>
                        </div>
                    )}

                    {/* RATING SECTION (hanya jika status selesai dan milik user) */}
                    {item.status === "selesai" && item.user_id === user?.id && user && (
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                            <p className="text-sm font-bold text-amber-400 mb-1">
                                {rated ? "Penilaian Anda" : "Berikan Penilaian Layanan"}
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                {rated
                                    ? "Terima kasih sudah memberikan penilaian!"
                                    : "Laporan ini telah selesai ditangani. Bagaimana pengalaman Anda?"}
                            </p>

                            {rated ? (
                                <div className="flex items-center gap-3">
                                    <StarDisplay rating={currentRating} size={28} />
                                    <span className="text-2xl font-black text-amber-400">{currentRating}.0</span>
                                    <span className="text-sm text-gray-400">
                                        {currentRating === 5
                                            ? "😍 Sangat Puas"
                                            : currentRating === 4
                                                ? "😊 Puas"
                                                : currentRating === 3
                                                    ? "😐 Cukup"
                                                    : currentRating === 2
                                                        ? "😕 Kurang Puas"
                                                        : "😞 Tidak Puas"}
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isLit = star <= (hoveredStar || selectedStar);
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setSelectedStar(star)}
                                                    onMouseEnter={() => setHoveredStar(star)}
                                                    onMouseLeave={() => setHoveredStar(0)}
                                                    className="transition-transform hover:scale-125 active:scale-110"
                                                >
                                                    {isLit ? (
                                                        <HiStar size={32} className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                                                    ) : (
                                                        <HiOutlineStar size={32} className="text-gray-600 hover:text-amber-400" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                        {selectedStar > 0 && (
                                            <span className="ml-2 text-sm text-gray-400">
                                                {selectedStar === 5
                                                    ? "😍 Sangat Puas"
                                                    : selectedStar === 4
                                                        ? "😊 Puas"
                                                        : selectedStar === 3
                                                            ? "😐 Cukup"
                                                            : selectedStar === 2
                                                                ? "😕 Kurang Puas"
                                                                : "😞 Tidak Puas"}
                                            </span>
                                        )}
                                    </div>
                                    {selectedStar > 0 && (
                                        <button
                                            onClick={handleSubmitRating}
                                            disabled={submitting}
                                            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 text-slate-900 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
                                        >
                                            {submitting ? "Mengirim..." : `Kirim Rating ${selectedStar} Bintang`}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────
export default function PantauLaporan() {
    const [activeNav, setActiveNav] = useState("pantau-laporan");
    const [user, setUser] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, diproses: 0, selesai: 0, ditolak: 0 });
    const [search, setSearch] = useState("");
    const [hoveredStars, setHoveredStars] = useState({});
    const [selectedStars, setSelectedStars] = useState({});
    const [loadingRating, setLoadingRating] = useState({});
    const [detailItem, setDetailItem] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Ambil data user dari token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUser({ id: payload.id, role: payload.role });
            } catch (err) {
                console.error("Gagal parse token:", err);
            }
        }
    }, []);

    // Ambil daftar laporan dari API
    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setComplaints([]);
                return;
            }
            const res = await fetch(`${API_URL}/complaints`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Gagal fetch laporan");
            const data = await res.json();
            const list = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
            setComplaints(list);
            setStats({
                total: list.length,
                diproses: list.filter((i) => i.status === "diproses").length,
                selesai: list.filter((i) => i.status === "selesai").length,
                ditolak: list.filter((i) => i.status === "ditolak").length,
            });
        } catch (err) {
            console.error(err);
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Kirim rating dari card (tanpa modal)
    const handleSendRating = async (complaintId) => {
        const ratingValue = selectedStars[complaintId];
        if (!ratingValue) return alert("Pilih jumlah bintang terlebih dahulu!");
        setLoadingRating((prev) => ({ ...prev, [complaintId]: true }));
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/complaints/${complaintId}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating: ratingValue }),
            });
            if (res.ok) {
                await fetchComplaints(); // refresh ulang
            } else {
                const error = await res.json();
                alert(error.message || "Gagal mengirim rating.");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan.");
        } finally {
            setLoadingRating((prev) => ({ ...prev, [complaintId]: false }));
        }
    };

    // Hapus laporan
    const handleDeleteComplaint = async (id) => {
        if (deletingId) return;

        if (!window.confirm("Yakin ingin menghapus laporan ini?")) return;

        setDeletingId(id);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/complaints/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Gagal menghapus laporan");
            }

            // update UI tanpa refresh
            setComplaints((prev) => prev.filter((item) => item.id !== id));

            // tutup modal jika sedang dibuka
            if (detailItem?.id === id) {
                setDetailItem(null);
            }

        } catch (err) {
            console.error(err);
            alert(err.message || "Terjadi kesalahan");
        } finally {
            setDeletingId(null);
        }
    };

    // Callback rating dari modal
    const handleRatingFromModal = (complaintId, ratingValue) => {
        setComplaints((prev) =>
            prev.map((c) => (c.id === complaintId ? { ...c, rating: ratingValue } : c))
        );
        setDetailItem((prev) => (prev ? { ...prev, rating: ratingValue } : prev));
    };

    // Filter pencarian
    const filtered = complaints.filter((item) =>
        (item?.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (item?.ticket_number || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0B1120] flex">
            <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

            <main className="flex-1 overflow-y-auto">
                <section className="px-5 md:px-7 py-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* HERO */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/70 backdrop-blur-sm p-6 md:p-8">
                            <div className="absolute -top-16 right-0 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full" />
                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black leading-tight text-white">
                                        Pantau Status{" "}
                                        <span className="block text-blue-400">Laporan Masyarakat</span>
                                    </h1>
                                    <p className="text-gray-400 mt-4 text-sm md:text-base leading-7 max-w-xl">
                                        Pantau perkembangan laporan masyarakat secara cepat, transparan, dan real-time.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3 justify-end">
                                    <Link
                                        href="/home/lapor"
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <HiOutlineClipboardList className="w-4 h-4" />
                                        Lapor Sekarang
                                    </Link>
                                    <button
                                        onClick={fetchComplaints}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <HiOutlineRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* STATISTIK */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Total Laporan", value: stats.total, icon: <HiOutlineClipboardList size={24} />, color: "blue" },
                                { label: "Diproses", value: stats.diproses, icon: <HiOutlineClock size={24} />, color: "yellow" },
                                { label: "Selesai", value: stats.selesai, icon: <HiOutlineCheckCircle size={24} />, color: "green" },
                                { label: "Ditolak", value: stats.ditolak, icon: <HiOutlineXCircle size={24} />, color: "red" },
                            ].map(({ label, value, icon, color }) => (
                                <div key={label} className="bg-[#111827]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">{label}</p>
                                            <h2 className={`text-3xl font-black mt-2 text-${color}-400`}>
                                                {loading ? "..." : value}
                                            </h2>
                                        </div>
                                        <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 text-${color}-400 flex items-center justify-center`}>
                                            {icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SEARCH */}
                        <div className="rounded-3xl border border-white/10 bg-[#111827]/60 backdrop-blur-sm p-4">
                            <div className="relative w-full max-w-md">
                                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari laporan atau nomor tiket..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-[#0F172A] text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                        </div>

                        {/* DAFTAR LAPORAN */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-16 text-gray-500 animate-pulse text-sm">
                                    Memuat data laporan...
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-white/10 bg-[#111827]/50 backdrop-blur-sm p-10 md:p-14 text-center">
                                    <div className="flex justify-center mb-5">
                                        <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                            <HiOutlineClipboardList size={36} />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-white mb-3">Belum Ada Laporan</h2>
                                    <p className="text-gray-400 text-sm leading-7">
                                        Saat ini belum ada laporan yang cocok.
                                    </p>
                                </div>
                            ) : (
                                filtered.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-[#111827]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300 group"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                                            {/* INFO KIRI */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h2 className="text-lg font-bold text-white">{item.title}</h2>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLE[item.status]}`}>
                                                        {STATUS_LABEL[item.status] || item.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 mt-2 text-sm leading-6 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                                                    <span>🎫 {item.ticket_number}</span>
                                                    <span>📅 {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                    {item.category && <span>📂 {item.category}</span>}
                                                    {item.location && <span>📍 {item.location}</span>}
                                                </div>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <button
                                                        onClick={() => setDetailItem(item)}
                                                        className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-semibold transition"
                                                    >
                                                        Lihat Detail
                                                        <HiOutlineChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                    {item.user_id === user?.id && (
                                                        <button
                                                            onClick={() => handleDeleteComplaint(item.id)}
                                                            disabled={deletingId === item.id}
                                                            className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-semibold transition disabled:opacity-50"
                                                        >
                                                            <HiOutlineTrash className="w-4 h-4" />
                                                            {deletingId === item.id ? "Menghapus..." : "Hapus"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* RATING (hanya jika selesai dan milik user) */}
                                            {item.status === "selesai" && item.user_id === user?.id && (
                                                <div className="flex flex-col items-start lg:items-end gap-2 bg-white/5 border border-white/5 p-4 rounded-xl shrink-0 min-w-[230px]">
                                                    <span className="text-xs font-medium text-gray-300">
                                                        {item.rating != null ? "Penilaian Anda:" : "Berikan Penilaian:"}
                                                    </span>
                                                    {item.rating != null ? (
                                                        <div className="flex items-center gap-2">
                                                            <StarDisplay rating={Number(item.rating)} size={22} />
                                                            <span className="text-sm font-bold text-amber-400">{item.rating}.0</span>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full space-y-2">
                                                            <div className="flex items-center gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => {
                                                                    const isLit = star <= ((hoveredStars[item.id] || 0) || (selectedStars[item.id] || 0));
                                                                    return (
                                                                        <button
                                                                            key={star}
                                                                            type="button"
                                                                            onClick={() => setSelectedStars((prev) => ({ ...prev, [item.id]: star }))}
                                                                            onMouseEnter={() => setHoveredStars((prev) => ({ ...prev, [item.id]: star }))}
                                                                            onMouseLeave={() => setHoveredStars((prev) => ({ ...prev, [item.id]: 0 }))}
                                                                            className="transition-transform hover:scale-110"
                                                                        >
                                                                            {isLit ? (
                                                                                <HiStar size={24} className="text-amber-400" />
                                                                            ) : (
                                                                                <HiOutlineStar size={24} className="text-gray-500 hover:text-amber-400" />
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                            {selectedStars[item.id] > 0 && (
                                                                <button
                                                                    onClick={() => handleSendRating(item.id)}
                                                                    disabled={loadingRating[item.id]}
                                                                    className="w-full text-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 text-xs font-bold rounded-lg transition"
                                                                >
                                                                    {loadingRating[item.id] ? "Mengirim..." : "Kirim Rating"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* MODAL DETAIL */}
            {detailItem && (
                <DetailModal
                    item={detailItem}
                    user={user}
                    onClose={() => setDetailItem(null)}
                    onRatingSubmit={handleRatingFromModal}
                    onDelete={handleDeleteComplaint}
                />
            )}
        </div>
    );
}