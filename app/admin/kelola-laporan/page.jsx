"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KelolaLaporan from "../components/KelolaLaporan";

export default function KelolaLaporanPage() {
    const [activeNav, setActiveNav] = useState("laporan");

    return (
        <div className="flex min-h-screen bg-[#080d1a] text-gray-100 antialiased">
            {/* 1. SIDEBAR COMPONENT */}
            <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* TOPBAR */}
                <Topbar title="Kelola Laporan" />

                {/* WRAPPER KONTEN UTAMA */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 md:pb-6">
                    <KelolaLaporan />
                </main>
            </div>
        </div>
    );
}