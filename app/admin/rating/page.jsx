"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RatingAdmin from "../components/RatingAdmin";

export default function RatingPage() {
    const [activeNav, setActiveNav] = useState("rating");

    return (
        <div className="flex min-h-screen bg-[#080d1a] text-gray-100 antialiased">
            {/* 1. SIDEBAR COMPONENT */}
            <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* TOPBAR */}
                <Topbar
                    title="Rating & Penilaian"
                    subtitle="Pantau kepuasan masyarakat terhadap penanganan laporan 🌟"
                />

                {/* WRAPPER KONTEN UTAMA */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 md:pb-6">
                    <RatingAdmin />
                </main>
            </div>
        </div>
    );
}
