// components/admin/Table.jsx
"use client";

import { useState } from "react";
import { HiOutlineSearch, HiOutlineFilter, HiOutlineRefresh } from "react-icons/hi";
import TableRow from "./TableRow";

const STATUS_FILTERS = [
    { value: "semua", label: "Semua" },
    { value: "menunggu_verifikasi", label: "Menunggu" },
    { value: "diverifikasi", label: "Diverifikasi" },
    { value: "diproses", label: "Diproses" },
    { value: "selesai", label: "Selesai" },
    { value: "ditolak", label: "Ditolak" },
];

const CATEGORY_MAP = {
    1: "Infrastruktur Jalan",
    2: "Kesehatan",
    3: "Pendidikan",
    4: "Pelayanan Publik",
    5: "Lingkungan Hidup"
};

export default function Table({
    data = [],
    loading = false,
    onUpdateStatus,
    onRefresh,
}) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("semua");

    // Filter data
    const filtered = data.filter((item) => {
        const matchSearch =
            item.title?.toLowerCase().includes(search.toLowerCase()) ||
            item.reporter?.toLowerCase().includes(search.toLowerCase()) ||
            item.ticket_number?.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            filterStatus === "semua" || item.status === filterStatus;

        return matchSearch && matchStatus;
    });

    return (
        <div className="bg-[#111827]/80 border border-white/5 rounded-2xl overflow-hidden">

            {/* Header tabel */}
            <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center gap-3">
                <div>
                    <h3 className="font-bold text-white text-base">
                        Data Laporan Terbaru
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {filtered.length} laporan ditemukan
                    </p>
                </div>

                <div className="sm:ml-auto flex items-center gap-2 flex-wrap">

                    {/* Search */}
                    <div className="relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Cari laporan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="
                                pl-9 pr-4 py-2 text-sm
                                bg-white/5 border border-white/10
                                rounded-xl text-gray-200
                                placeholder:text-gray-600
                                focus:outline-none focus:border-violet-500/50 focus:bg-white/8
                                transition w-48
                            "
                        />
                    </div>

                    {/* Filter status */}
                    <div className="relative">
                        <HiOutlineFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="
                                pl-9 pr-4 py-2 text-sm
                                bg-white/5 border border-white/10
                                rounded-xl text-gray-200
                                focus:outline-none focus:border-violet-500/50
                                transition appearance-none cursor-pointer
                            "
                        >
                            {STATUS_FILTERS.map((f) => (
                                <option key={f.value} value={f.value} className="bg-[#111827]">
                                    {f.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Refresh */}
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="
                                w-9 h-9 flex items-center justify-center rounded-xl
                                bg-white/5 border border-white/10 text-gray-400
                                hover:text-white hover:bg-white/10
                                transition
                            "
                        >
                            <HiOutlineRefresh className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            {["No. Tiket", "Pelapor", "Judul", "Kategori", "Status", "Tanggal", "Aksi"].map((h) => (
                                <th
                                    key={h}
                                    className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            // Skeleton loading
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-white/5">
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <td key={j} className="py-3.5 px-4">
                                            <div className="h-4 bg-white/5 rounded-lg animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center">
                                    <p className="text-gray-600 text-sm">
                                        {search || filterStatus !== "semua"
                                            ? "Tidak ada laporan yang sesuai filter"
                                            : "Belum ada data laporan"}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((item) => (
                                <TableRow
                                    key={item.id}
                                    ticketNumber={item.ticket_number}
                                    name={item.reporter || item.nama_lengkap}
                                    title={item.title}
                                    category={CATEGORY_MAP[item.category_id] || item.category_name || item.category_id || "-"}
                                    status={item.status}
                                    date={
                                        item.created_at
                                            ? new Date(item.created_at).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "-"
                                    }
                                    onUpdateStatus={() => onUpdateStatus && onUpdateStatus(item)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}