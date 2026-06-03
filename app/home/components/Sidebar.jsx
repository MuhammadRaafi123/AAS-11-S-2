"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
    HiOutlineHome,
    HiOutlineClipboardList,
    HiOutlineSpeakerphone,
    HiOutlineUser,
    HiOutlineShieldCheck,
    HiOutlineChevronRight,
} from "react-icons/hi";

const navItems = [
    {
        id: "dashboard",
        icon: HiOutlineHome,
        label: "Dashboard",
        href: "/home",
    },
    {
        id: "pantau-laporan",
        icon: HiOutlineClipboardList,
        label: "Pantau Laporan",
        href: "/home/pantau-laporan-home",
    },
    {
        id: "lapor",
        icon: HiOutlineSpeakerphone,
        label: "Lapor Sekarang",
        href: "/home/lapor",
        highlight: true,
    },
];

export default function Sidebar({
    activeNav = "dashboard",
    setActiveNav = () => {},
}) {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

    }, []);

    return (
        <>
            {/* ── Desktop Sidebar ── */}
            <aside
                className="
                    hidden md:flex flex-col h-screen sticky top-0
                    bg-[#111827] border-r border-gray-700/50
                    w-64
                "
            >

                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700/40">

                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <HiOutlineShieldCheck className="w-5 h-5 text-white" />
                    </div>

                    <span className="text-lg font-extrabold tracking-wide text-white whitespace-nowrap">
                        LAPOR <span className="text-blue-400">NIH</span>
                    </span>

                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">

                    {navItems.map(({ id, icon: Icon, label, href, highlight }) => {

                        const isActive = activeNav === id;

                        return (
                            <Link
                                key={id}
                                href={href}
                                onClick={() => setActiveNav(id)}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-xl
                                    transition-all duration-200
                                    ${
                                        highlight
                                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                                            : isActive
                                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                                    }
                                `}
                            >

                                <Icon className="w-5 h-5 flex-shrink-0" />

                                <span className="text-sm font-semibold whitespace-nowrap">
                                    {label}
                                </span>

                                {isActive && !highlight && (
                                    <HiOutlineChevronRight className="w-4 h-4 ml-auto text-blue-400" />
                                )}

                            </Link>
                        );
                    })}

                </nav>

                {/* Profile */}
                <div className="px-3 py-4 border-t border-gray-700/40">

                    <Link
                        href="/home/profil"
                        onClick={() => setActiveNav("profil")}
                        className="
                            flex items-center gap-3 px-3 py-3 rounded-xl
                            text-gray-400 hover:text-white hover:bg-gray-800/60
                            transition-all duration-200
                        "
                    >

                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md">
                            <HiOutlineUser className="w-4 h-4 text-white" />
                        </div>

                        <div className="overflow-hidden">

                            {/* NAMA USER LOGIN */}
                            <p className="text-sm font-semibold text-white whitespace-nowrap">
                                {user?.nama_lengkap || "Guest"}
                            </p>

                            {/* ROLE USER */}
                            <p className="text-xs text-gray-500 whitespace-nowrap capitalize">
                                {user?.role || "Masyarakat"}
                            </p>

                        </div>

                    </Link>

                </div>

            </aside>

            {/* ── Mobile Bottom Nav ── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111827] border-t border-gray-700/50 flex items-center justify-around px-2 py-2">

                {[
                    ...navItems,
                    {
                        id: "profil",
                        icon: HiOutlineUser,
                        label: "Profil",
                        href: "/home/profil",
                    },
                ].map(({ id, icon: Icon, label, href, highlight }) => {

                    const isActive = activeNav === id;

                    return (
                        <Link
                            key={id}
                            href={href}
                            onClick={() => setActiveNav(id)}
                            className={`
                                flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                                transition-all duration-200 flex-1
                                ${
                                    highlight
                                        ? "text-white bg-blue-600 shadow-lg shadow-blue-600/30"
                                        : isActive
                                        ? "text-blue-400"
                                        : "text-gray-500 hover:text-gray-300"
                                }
                            `}
                        >

                            <Icon className="w-5 h-5" />

                            <span className="text-[10px] font-semibold">
                                {label}
                            </span>

                        </Link>
                    );
                })}

            </nav>
        </>
    );
}