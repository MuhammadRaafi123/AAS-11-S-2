"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    HiOutlineHome,
    HiOutlineClipboardList,
    HiOutlineLogout,
    HiOutlineShieldCheck,
    HiOutlineChevronRight,
    HiOutlineStar,
    HiOutlineMenuAlt2,
} from "react-icons/hi";

const navItems = [
    { id: "dashboard", icon: HiOutlineHome, label: "Dashboard", href: "/admin" },
    { id: "laporan", icon: HiOutlineClipboardList, label: "Kelola Laporan", href: "/admin/kelola-laporan" },
    { id: "rating", icon: HiOutlineStar, label: "Rating & Penilaian", href: "/admin/rating" },
];

export default function Sidebar({
    activeNav = "dashboard",
    setActiveNav = () => {},
    collapsed = false,
    setCollapsed = () => {},
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            router.push("/landing/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            const role = String(parsedUser?.role || "").trim().toLowerCase().replace(/\s+/g, "_");
            if (role !== "admin" && role !== "super_admin") {
                router.push("/home");
                return;
            }
            setUser({ ...parsedUser, role });
        } catch (err) {
            console.log("SIDEBAR ERROR:", err);
            router.push("/landing/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/landing/login");
    };

    const sidebarWidth = collapsed ? "w-20" : "w-64";

    return (
        <aside
            className={`
                hidden md:flex flex-col h-screen sticky top-0
                bg-[#0d1424] border-r border-white/5
                ${sidebarWidth} flex-shrink-0 transition-all duration-200
            `}
        >
            {/* Header + Toggle Button */}
            <div className="flex items-center justify-between px-3 py-4 border-b border-white/5">
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <HiOutlineShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <div>
                            <span className="text-sm font-extrabold tracking-widest text-white uppercase">Admin</span>
                            <p className="text-[10px] text-violet-400 font-medium uppercase">Panel</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-lg hover:bg-white/10 transition text-gray-400"
                    title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
                >
                    <HiOutlineMenuAlt2 className="w-5 h-5" />
                </button>
            </div>

            {/* Label Menu Utama (sembunyi jika collapsed) */}
            {!collapsed && (
                <div className="px-5 pt-5 pb-2">
                    <p className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">Menu Utama</p>
                </div>
            )}

            {/* Navigasi */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map(({ id, icon: Icon, label, href }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={id}
                            href={href}
                            onClick={() => setActiveNav(id)}
                            className={`
                                group flex items-center gap-3 px-3 py-3 rounded-xl
                                transition-all duration-200
                                ${
                                    isActive
                                        ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                                        : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                                }
                                ${collapsed ? "justify-center" : ""}
                            `}
                            title={collapsed ? label : ""}
                        >
                            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="text-sm font-semibold">{label}</span>
                                    {isActive && (
                                        <HiOutlineChevronRight className="w-3.5 h-3.5 ml-auto text-violet-400" />
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="px-3 py-4 border-t border-white/5 space-y-2">
                <div
                    className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5
                        ${collapsed ? "justify-center" : ""}
                    `}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">
                            {user?.nama_lengkap?.[0]?.toUpperCase() || "A"}
                        </span>
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-semibold text-white truncate">
                                {user?.nama_lengkap || "Admin"}
                            </p>
                            <p className="text-[10px] text-gray-500 capitalize truncate">
                                {user?.role === "super_admin" ? "Super Administrator" : "Administrator"}
                            </p>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                        text-gray-500 hover:text-red-400 hover:bg-red-500/10
                        transition-all duration-200
                        ${collapsed ? "justify-center" : ""}
                    `}
                    title={collapsed ? "Keluar" : ""}
                >
                    <HiOutlineLogout className="w-[18px] h-[18px]" />
                    {!collapsed && <span className="text-sm font-semibold">Keluar</span>}
                </button>
            </div>
        </aside>
    );
}