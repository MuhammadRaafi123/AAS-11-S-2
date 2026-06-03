"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    HiOutlineHome,
    HiOutlineClipboardList,
    HiOutlineUsers,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineShieldCheck,
    HiOutlineChevronRight,
    HiOutlineChartBar,
    HiOutlineStar,
} from "react-icons/hi";

const navItems = [
    {
        id: "dashboard",
        icon: HiOutlineHome,
        label: "Dashboard",
        href: "/admin",
    },

    {
        id: "laporan",
        icon: HiOutlineClipboardList,
        label: "Kelola Laporan",
        href: "/admin/kelola-laporan",
    },

    {
        id: "rating",
        icon: HiOutlineStar,
        label: "Rating & Penilaian",
        href: "/admin/rating",
    },

];

export default function Sidebar({
    activeNav = "dashboard",
    setActiveNav = () => {},
}) {

    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState(null);

    // ======================================================
    // CEK LOGIN & ROLE
    // ======================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        const token =
            localStorage.getItem("token");

        // BELUM LOGIN
        if (!storedUser || !token) {

            router.push("/login");
            return;

        }

        try {

            const parsedUser =
                JSON.parse(storedUser);

            console.log("ADMIN USER:", parsedUser);

            const role = String(
                parsedUser?.role || ""
            )
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "_");

            console.log("ROLE ADMIN:", role);

            // ROLE BUKAN ADMIN
            if (
                role !== "admin" &&
                role !== "super_admin"
            ) {

                router.push("/home");
                return;

            }

            setUser({
                ...parsedUser,
                role,
            });

        } catch (err) {

            console.log("SIDEBAR ERROR:", err);

            router.push("/login");

        }

    }, [router]);

    // ======================================================
    // LOGOUT
    // ======================================================

    function handleLogout() {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        router.push("/login");

    }

    return (
        <>
            {/* ====================================================== */}
            {/* DESKTOP SIDEBAR */}
            {/* ====================================================== */}

            <aside
                className="
                    hidden md:flex
                    flex-col
                    h-screen
                    sticky top-0
                    bg-[#0d1424]
                    border-r border-white/5
                    w-64
                    flex-shrink-0
                "
            >

                {/* LOGO */}

                <div
                    className="
                        flex items-center gap-3
                        px-5 py-5
                        border-b border-white/5
                    "
                >

                    <div
                        className="
                            w-9 h-9
                            rounded-xl
                            bg-gradient-to-br
                            from-violet-500
                            to-indigo-600
                            flex items-center justify-center
                            shadow-lg
                            shadow-violet-600/30
                        "
                    >

                        <HiOutlineShieldCheck
                            className="
                                w-5 h-5 text-white
                            "
                        />

                    </div>

                    <div>

                        <span
                            className="
                                text-sm
                                font-extrabold
                                tracking-widest
                                text-white
                                uppercase
                            "
                        >
                            Admin
                        </span>

                        <p
                            className="
                                text-[10px]
                                text-violet-400
                                font-medium
                                tracking-wider
                                uppercase
                            "
                        >
                            Panel
                        </p>

                    </div>

                </div>

                {/* LABEL */}

                <div
                    className="
                        px-5 pt-5 pb-2
                    "
                >

                    <p
                        className="
                            text-[10px]
                            font-bold
                            tracking-widest
                            text-gray-600
                            uppercase
                        "
                    >
                        Menu Utama
                    </p>

                </div>

                {/* NAVIGATION */}

                <nav
                    className="
                        flex-1
                        px-3
                        space-y-1
                        overflow-y-auto
                    "
                >

                    {navItems.map(({
                        id,
                        icon: Icon,
                        label,
                        href,
                    }) => {

                        const isActive =
                            pathname === href;

                        return (
                            <Link
                                key={id}
                                href={href}
                                onClick={() =>
                                    setActiveNav(id)
                                }
                                className={`
                                    group
                                    flex items-center gap-3
                                    px-3 py-3
                                    rounded-xl
                                    transition-all duration-200

                                    ${
                                        isActive
                                            ? `
                                                bg-violet-500/10
                                                text-violet-400
                                                border border-violet-500/20
                                            `
                                            : `
                                                text-gray-500
                                                hover:text-gray-200
                                                hover:bg-white/5
                                            `
                                    }
                                `}
                            >

                                <Icon
                                    className="
                                        w-[18px]
                                        h-[18px]
                                        flex-shrink-0
                                    "
                                />

                                <span
                                    className="
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    {label}
                                </span>

                                {isActive && (
                                    <HiOutlineChevronRight
                                        className="
                                            w-3.5 h-3.5
                                            ml-auto
                                            text-violet-400
                                        "
                                    />
                                )}

                            </Link>
                        );
                    })}

                </nav>

                {/* ====================================================== */}
                {/* USER INFO */}
                {/* ====================================================== */}

                <div
                    className="
                        px-3 py-4
                        border-t border-white/5
                        space-y-2
                    "
                >

                    {/* USER */}

                    <div
                        className="
                            flex items-center gap-3
                            px-3 py-2.5
                            rounded-xl
                            bg-white/5
                        "
                    >

                        <div
                            className="
                                w-8 h-8
                                rounded-full
                                bg-gradient-to-br
                                from-violet-500
                                to-indigo-600
                                flex items-center justify-center
                                flex-shrink-0
                            "
                        >

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    text-white
                                "
                            >
                                {user?.nama_lengkap?.[0]?.toUpperCase() || "A"}
                            </span>

                        </div>

                        <div
                            className="
                                overflow-hidden flex-1
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-white
                                    truncate
                                "
                            >
                                {user?.nama_lengkap || "Admin"}
                            </p>

                            <p
                                className="
                                    text-[10px]
                                    text-gray-500
                                    capitalize
                                    truncate
                                "
                            >
                                {user?.role === "super_admin"
                                    ? "Super Administrator"
                                    : "Administrator"}
                            </p>

                        </div>

                    </div>

                    {/* LOGOUT */}

                    <button
                        onClick={handleLogout}
                        className="
                            w-full
                            flex items-center gap-3
                            px-3 py-2.5
                            rounded-xl

                            text-gray-500
                            hover:text-red-400
                            hover:bg-red-500/10

                            transition-all duration-200
                        "
                    >

                        <HiOutlineLogout
                            className="
                                w-[18px]
                                h-[18px]
                            "
                        />

                        <span
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            Keluar
                        </span>

                    </button>

                </div>

            </aside>
        </>
    );
}