"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
    HiOutlineBell,
    HiOutlineUser,
    HiOutlineLogout,
    HiOutlineExternalLink,
    HiOutlineCheckCircle,
    HiOutlineInformationCircle,
    HiOutlineExclamation,
    HiOutlineX,
} from "react-icons/hi";

// Fungsi helper untuk menentukan tipe visual berdasarkan status_to dari database
const getNotifType = (status) => {
    switch (status?.toLowerCase()) {
        case "selesai":
            return "success";
        case "diproses":
            return "info";
        case "perlu kelengkapan":
        case "ditolak":
            return "warning";
        default:
            return "info";
    }
};

const notifIcon = {
    success: <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400" />,
    info: <HiOutlineInformationCircle className="w-5 h-5 text-blue-400" />,
    warning: <HiOutlineExclamation className="w-5 h-5 text-amber-400" />,
};

const notifBg = {
    success: "bg-emerald-500/10 border-emerald-500/20",
    info: "bg-blue-500/10 border-blue-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
};

export default function Topbar({
    title = "Dashboard",
    subtitle = "Selamat datang kembali 👋",
}) {
    const router = useRouter();

    const [user, setUser] = useState(null);

    // State dropdown
    const [showNotif, setShowNotif] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // State data notifikasi API
    const [notifs, setNotifs] = useState([]);
    const [loadingNotif, setLoadingNotif] = useState(true);

    // Refs untuk detect klik di luar
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    // Hitung notif belum dibaca (Karena API Anda belum mengembalikan kolom status 'read', 
    // semua data baru default diset false atau Anda bisa menyimpannya secara lokal)
    const unreadCount = notifs.filter((n) => !n.read).length;

    // ── FETCH NOTIFIKASI DARI API ─────────────────────────────────────────────
    const fetchNotifications = async () => {
        try {
            setLoadingNotif(true);
            const token = localStorage.getItem("token");
            
            // Sesuaikan URL endpoint ini dengan konfigurasi rute backend Anda
            const response = await fetch("http://localhost:5000/api/notifications", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Sertakan token JWT untuk identifikasi role req.user
                }
            });

            if (!response.ok) throw new Error("Gagal mengambil data notifikasi");

            const data = await response.json();

            // Mapping format database ke format UI Component Anda
            const formattedNotifs = data.map((item) => ({
                id: item.id,
                type: getNotifType(item.status_to),
                title: `Status: ${item.status_to}`,
                message: `${item.title} (${item.ticket_number}) - ${item.note || "Tidak ada catatan"}`,
                // Mengubah timestamp database menjadi format bacaan ringan
                time: new Date(item.created_at).toLocaleDateString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit"
                }),
                read: false // Default false karena tabel backend belum mencatat status read/unread per-user
            }));

            setNotifs(formattedNotifs);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoadingNotif(false);
        }
    };

    // Ambil data user & trigger fetch notifications
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        
        fetchNotifications();
    }, []);

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(e) {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotif(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Tandai semua sudah dibaca (Lokal)
    function markAllRead() {
        setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    }

    // Tandai satu notif sudah dibaca (Lokal)
    function markRead(id) {
        setNotifs((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }

    // Hapus satu notif (Lokal)
    function removeNotif(id) {
        setNotifs((prev) => prev.filter((n) => n.id !== id));
    }

    // Logout
    function handleLogout() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/landing/login");
    }

    // Data user info
    const nama = user?.nama_lengkap || "Pengguna";
    const role = user?.role || "masyarakat";
    const roleText =
        role === "super_admin"
            ? "Super Administrator"
            : role === "admin"
            ? "Administrator"
            : "Masyarakat";

    return (
        <div className="flex items-center justify-between">
            {/* LEFT */}
            <div>
                <h1 className="text-xl font-extrabold text-white leading-none">
                    {title}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    {subtitle}
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
                {/* ── NOTIFIKASI ── */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => {
                            setShowNotif((v) => !v);
                            setShowProfileMenu(false);
                        }}
                        className="
                            relative w-9 h-9 rounded-xl
                            bg-gray-900 hover:bg-gray-800
                            border border-gray-700/50
                            flex items-center justify-center
                            transition text-gray-400 hover:text-white
                        "
                    >
                        <HiOutlineBell className="w-5 h-5" />

                        {/* Badge hitung jumlah baru */}
                        {unreadCount > 0 && (
                            <span className="
                                absolute -top-1 -right-1
                                min-w-[18px] h-[18px] px-1
                                bg-red-500 rounded-full
                                text-[10px] text-white font-bold
                                flex items-center justify-center
                                ring-2 ring-[#0d1117]
                            ">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Dropdown Notifikasi */}
                    {showNotif && (
                        <div className="
                            absolute top-full right-0 mt-2
                            w-80 rounded-2xl
                            bg-[#1a2236] border border-white/10
                            shadow-2xl shadow-black/40
                            z-50 overflow-hidden
                        ">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                <h3 className="text-sm font-bold text-white">
                                    Notifikasi
                                    {unreadCount > 0 && (
                                        <span className="ml-2 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5">
                                            {unreadCount} baru
                                        </span>
                                    )}
                                </h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition"
                                    >
                                        Baca semua
                                    </button>
                                )}
                            </div>

                            {/* List Notifikasi */}
                            <div className="max-h-72 overflow-y-auto">
                                {loadingNotif ? (
                                    <p className="text-center text-gray-400 text-sm py-8 animate-pulse">
                                        Memuat notifikasi...
                                    </p>
                                ) : notifs.length === 0 ? (
                                    <p className="text-center text-gray-500 text-sm py-8">
                                        Tidak ada notifikasi baru
                                    </p>
                                ) : (
                                    notifs.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markRead(notif.id)}
                                            className={`
                                                relative flex gap-3 px-4 py-3
                                                border-b border-white/5 last:border-0
                                                cursor-pointer transition hover:bg-white/5
                                                ${!notif.read ? "bg-blue-500/5" : ""}
                                            `}
                                        >
                                            {/* Dot indikator unread */}
                                            {!notif.read && (
                                                <span className="absolute top-4 right-10 w-2 h-2 rounded-full bg-blue-400" />
                                            )}

                                            {/* Icon Berdasarkan Status */}
                                            <div className={`
                                                w-9 h-9 rounded-xl flex-shrink-0
                                                flex items-center justify-center
                                                border ${notifBg[notif.type]}
                                            `}>
                                                {notifIcon[notif.type]}
                                            </div>

                                            {/* Konten Notifikasi */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white leading-snug">
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-gray-600 mt-1">
                                                    {notif.time}
                                                </p>
                                            </div>

                                            {/* Tombol Hapus Semenetara */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNotif(notif.id);
                                                }}
                                                className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition mt-1"
                                            >
                                                <HiOutlineX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── PROFIL ── */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => {
                            setShowProfileMenu((v) => !v);
                            setShowNotif(false);
                        }}
                        className="
                            flex items-center gap-2.5
                            bg-gray-900 hover:bg-gray-800
                            border border-gray-700/50
                            rounded-xl px-3 py-2
                            cursor-pointer transition
                        "
                    >
                        <div className="
                            w-7 h-7 rounded-full
                            bg-gradient-to-br from-blue-500 to-violet-600
                            flex items-center justify-center shadow-md
                        ">
                            <HiOutlineUser className="w-4 h-4 text-white" />
                        </div>

                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-semibold text-white leading-none">
                                {nama}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                                {roleText}
                            </p>
                        </div>
                    </button>

                    {/* Dropdown Menu Profil */}
                    {showProfileMenu && (
                        <div className="
                            absolute top-full right-0 mt-2
                            w-56 rounded-2xl
                            bg-[#1a2236] border border-white/10
                            shadow-2xl shadow-black/40
                            z-50 overflow-hidden
                        ">
                            <div className="px-4 py-3 border-b border-white/10">
                                <p className="text-sm font-bold text-white truncate">
                                    {nama}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || ""}
                                </p>
                                <span className="
                                    inline-block mt-1.5
                                    text-[10px] font-semibold
                                    bg-blue-500/10 text-blue-400
                                    border border-blue-500/20
                                    rounded-full px-2 py-0.5 capitalize
                                ">
                                    {roleText}
                                </span>
                            </div>

                            <Link
                                href="/profil"
                                onClick={() => setShowProfileMenu(false)}
                                className="
                                    flex items-center gap-3 px-4 py-3
                                    text-gray-300 hover:text-white hover:bg-white/5
                                    transition-all duration-150
                                "
                            >
                                <HiOutlineExternalLink className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium">Lihat Profil</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="
                                    w-full flex items-center gap-3 px-4 py-3
                                    text-red-400 hover:text-red-300 hover:bg-red-500/10
                                    transition-all duration-150
                                "
                            >
                                <HiOutlineLogout className="w-4 h-4" />
                                <span className="text-sm font-medium">Keluar</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}