// components/admin/Topbar.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    HiOutlineBell, 
    HiOutlineLogout, 
    HiOutlineExternalLink, 
    HiOutlineCheckCircle, 
    HiOutlineInformationCircle, 
    HiOutlineExclamation, 
    HiOutlineX 
} from "react-icons/hi";

const getNotifVisuals = (status) => {
    switch (status?.toLowerCase()) {
        case "selesai":
            return {
                icon: <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400" />,
                bg: "bg-emerald-500/10 border-emerald-500/20"
            };
        case "diproses":
            return {
                icon: <HiOutlineInformationCircle className="w-5 h-5 text-blue-400" />,
                bg: "bg-blue-500/10 border-blue-500/20"
            };
        case "perlu kelengkapan":
        case "ditolak":
            return {
                icon: <HiOutlineExclamation className="w-5 h-5 text-amber-400" />,
                bg: "bg-amber-500/10 border-amber-500/20"
            };
        default:
            return {
                icon: <HiOutlineInformationCircle className="w-5 h-5 text-indigo-400" />,
                bg: "bg-indigo-500/10 border-indigo-500/20"
            };
    }
};

// ⭐ Ekspor tinggi topbar (64px) agar bisa digunakan di halaman lain
export const TOPBAR_HEIGHT = 64;

export default function Topbar({ 
    title = "Dashboard", 
    subtitle = "Selamat datang kembali 👋",
    sidebarWidth = 260,
    sidebarCollapsed = false 
}) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [showNotif, setShowNotif] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [notifs, setNotifs] = useState([]);
    const [loadingNotif, setLoadingNotif] = useState(true);

    const notifRef = useRef(null);
    const profileRef = useRef(null);
    const unreadCount = notifs.filter((n) => !n.read).length;

    const fetchNotifications = async () => {
        try {
            setLoadingNotif(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/notifications", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Gagal mengambil data");
            const data = await response.json();
            const formattedNotifs = data.map((item) => {
                const visuals = getNotifVisuals(item.status_to);
                return {
                    id: item.id,
                    icon: visuals.icon,
                    bgClass: visuals.bg,
                    title: `Status: ${item.status_to}`,
                    message: `${item.title} (${item.ticket_number}) - ${item.note || "Tidak ada catatan"}`,
                    time: new Date(item.created_at).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                    read: false
                };
            });
            setNotifs(formattedNotifs);
        } catch (error) {
            console.error("Fetch notifications error:", error);
        } finally {
            setLoadingNotif(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchNotifications();
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    const markRead = (id) => setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const removeNotif = (id) => setNotifs((prev) => prev.filter((n) => n.id !== id));

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/landing/login");
    };

    const roleText = user?.role === "super_admin" ? "Super Administrator" : user?.role === "admin" ? "Administrator" : "Masyarakat";
    const namaUser = user?.name || user?.nama_lengkap || "Administrator";

    const leftMargin = sidebarCollapsed ? 80 : sidebarWidth;
    const topbarStyle = {
        marginLeft: `${leftMargin}px`,
        width: `calc(100% - ${leftMargin}px)`,
        transition: "margin-left 0.2s ease, width 0.2s ease",
        height: `${TOPBAR_HEIGHT}px`,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
    };

    return (
        <div 
            className="fixed bg-[#0d1424]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
            style={topbarStyle}
        >
            <div className="flex items-center justify-between px-6 h-full">
                <div>
                    <h1 className="text-xl font-extrabold text-white leading-none tracking-tight">{title}</h1>
                    <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Notifikasi */}
                    <div className="relative" ref={notifRef}>
                        <button 
                            onClick={() => { setShowNotif(!showNotif); setShowProfileMenu(false); }} 
                            className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition text-gray-400 hover:text-white"
                        >
                            <HiOutlineBell className="w-5 h-5" />
                            {unreadCount > 0 ? (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-violet-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center ring-2 ring-[#0d1424]">
                                    {unreadCount}
                                </span>
                            ) : notifs.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full ring-2 ring-[#0d1424]" />
                            )}
                        </button>
                        {showNotif && (
                            <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl bg-[#121b2e] border border-white/10 shadow-2xl shadow-black/50 z-50 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                    <h3 className="text-sm font-bold text-white">
                                        Notifikasi {unreadCount > 0 && <span className="ml-2 text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-full px-2 py-0.5">{unreadCount} baru</span>}
                                    </h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-xs text-violet-400 hover:text-violet-300 font-semibold">
                                            Baca semua
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {loadingNotif ? (
                                        <p className="text-center text-gray-400 text-sm py-8 animate-pulse">Memuat notifikasi...</p>
                                    ) : notifs.length === 0 ? (
                                        <p className="text-center text-gray-500 text-sm py-8">Tidak ada notifikasi baru</p>
                                    ) : (
                                        notifs.map((notif) => (
                                            <div 
                                                key={notif.id} 
                                                onClick={() => markRead(notif.id)} 
                                                className={`relative flex gap-3 px-4 py-3 border-b border-white/5 last:border-0 cursor-pointer transition hover:bg-white/5 ${!notif.read ? "bg-violet-500/5" : ""}`}
                                            >
                                                {!notif.read && <span className="absolute top-4 right-10 w-2 h-2 rounded-full bg-violet-400" />}
                                                <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center border ${notif.bgClass}`}>
                                                    {notif.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-white leading-snug">{notif.title}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-600 mt-1">{notif.time}</p>
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); removeNotif(notif.id); }} 
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

                    {/* Profile Menu */}
                    <div className="relative" ref={profileRef}>
                        <div 
                            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotif(false); }} 
                            className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition cursor-pointer"
                        >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <span className="text-[11px] font-bold text-white">{namaUser[0]?.toUpperCase() || "A"}</span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-semibold text-white leading-none">{namaUser}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{roleText}</p>
                            </div>
                        </div>
                        {showProfileMenu && (
                            <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl bg-[#121b2e] border border-white/10 shadow-2xl shadow-black/50 z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                                    <p className="text-sm font-bold text-white truncate">{namaUser}</p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || ""}</p>
                                </div>
                                <Link 
                                    href="/admin/profile" 
                                    onClick={() => setShowProfileMenu(false)} 
                                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition"
                                >
                                    <HiOutlineExternalLink className="w-4 h-4 text-violet-400" />
                                    <span className="text-sm font-medium">Lihat Profil</span>
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition border-t border-white/5"
                                >
                                    <HiOutlineLogout className="w-4 h-4" />
                                    <span className="text-sm font-medium">Keluar</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}