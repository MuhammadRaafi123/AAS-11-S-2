// app/components/admin/StatusModal.jsx

"use client";

import { useState } from "react";

import {
    HiOutlineX,
    HiOutlineCheckCircle,
} from "react-icons/hi";

const STATUS_OPTIONS = [
    {
        value: "menunggu_verifikasi",
        label: "Menunggu Verifikasi",
        color:
            "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
        value: "diverifikasi",
        label: "Diverifikasi",
        color:
            "text-blue-400 border-blue-500/30 bg-blue-500/10",
    },
    {
        value: "diproses",
        label: "Sedang Diproses",
        color:
            "text-violet-400 border-violet-500/30 bg-violet-500/10",
    },
    {
        value: "selesai",
        label: "Selesai",
        color:
            "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
        value: "ditolak",
        label: "Ditolak",
        color:
            "text-red-400 border-red-500/30 bg-red-500/10",
    },
];

export default function StatusModal({
    complaint,
    onClose,
    refreshComplaints,
}) {

    const [selectedStatus, setSelectedStatus] =
        useState(complaint?.status || "");

    const [rejectionReason, setRejectionReason] =
        useState(
            complaint?.rejection_reason || ""
        );

    const [loading, setLoading] = useState(false);

    // ======================================================
    // UPDATE STATUS
    // ======================================================

    async function handleSubmit() {

        if (!selectedStatus) return;

        // VALIDASI PENOLAKAN
        if (
            selectedStatus === "ditolak" &&
            !rejectionReason.trim()
        ) {
            alert("Alasan penolakan wajib diisi");
            return;
        }

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:5000/api/complaints/${complaint.id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: selectedStatus,
                        rejection_reason:
                            selectedStatus === "ditolak"
                                ? rejectionReason
                                : null,
                    }),
                }
            );

            const data = await res.json();

            // ERROR
            if (!res.ok) {

                alert(
                    data.message ||
                    "Gagal update status"
                );

                setLoading(false);
                return;
            }

            alert("Status berhasil diupdate");

            // REFRESH DATA
            if (refreshComplaints) {
                refreshComplaints();
            }

            onClose();

        } catch (err) {

            console.log(err);

            alert(
                "Terjadi kesalahan server"
            );

        } finally {

            setLoading(false);

        }
    }

    if (!complaint) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* OVERLAY */}
            <div
                className="
                    absolute inset-0
                    bg-black/60
                    backdrop-blur-sm
                "
                onClick={onClose}
            />

            {/* MODAL */}
            <div
                className="
                    relative z-10
                    w-full max-w-md
                    rounded-2xl
                    border border-white/10
                    bg-[#111827]
                    shadow-2xl shadow-black/50
                "
            >

                {/* HEADER */}
                <div
                    className="
                        flex items-center justify-between
                        px-5 py-4
                        border-b border-white/5
                    "
                >

                    <div>

                        <h3
                            className="
                                text-base font-bold text-white
                            "
                        >
                            Update Status
                        </h3>

                        <p
                            className="
                                mt-0.5
                                text-xs text-gray-500
                                font-mono
                            "
                        >
                            {complaint.ticket_number}
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="
                            w-8 h-8
                            flex items-center justify-center
                            rounded-xl
                            text-gray-500
                            hover:text-white
                            hover:bg-white/10
                            transition
                        "
                    >
                        <HiOutlineX className="w-4 h-4" />
                    </button>

                </div>

                {/* BODY */}
                <div className="px-5 py-4 space-y-4">

                    {/* JUDUL */}
                    <div
                        className="
                            rounded-xl
                            border border-white/5
                            bg-white/5
                            px-4 py-3
                        "
                    >

                        <p
                            className="
                                text-xs text-gray-500
                                mb-1
                            "
                        >
                            Judul Laporan
                        </p>

                        <p
                            className="
                                text-sm font-semibold text-white
                            "
                        >
                            {complaint.title}
                        </p>

                    </div>

                    {/* STATUS */}
                    <div>

                        <p
                            className="
                                mb-2
                                text-xs font-bold
                                uppercase tracking-wider
                                text-gray-500
                            "
                        >
                            Pilih Status Baru
                        </p>

                        <div className="space-y-2">

                            {STATUS_OPTIONS.map(
                                (opt) => (
                                    <label
                                        key={opt.value}
                                        className={`
                                            flex items-center gap-3
                                            px-4 py-3
                                            rounded-xl
                                            border
                                            cursor-pointer
                                            transition-all

                                            ${
                                                selectedStatus ===
                                                opt.value
                                                    ? opt.color
                                                    : `
                                                        border-white/5
                                                        bg-white/5
                                                        text-gray-400
                                                        hover:bg-white/10
                                                    `
                                            }
                                        `}
                                    >

                                        <input
                                            type="radio"
                                            name="status"
                                            value={opt.value}
                                            checked={
                                                selectedStatus ===
                                                opt.value
                                            }
                                            onChange={() =>
                                                setSelectedStatus(
                                                    opt.value
                                                )
                                            }
                                            className="
                                                accent-violet-500
                                            "
                                        />

                                        <span
                                            className="
                                                text-sm font-semibold
                                            "
                                        >
                                            {opt.label}
                                        </span>

                                        {complaint.status ===
                                            opt.value && (
                                            <span
                                                className="
                                                    ml-auto
                                                    text-[10px]
                                                    font-bold
                                                    opacity-60
                                                "
                                            >
                                                Status saat ini
                                            </span>
                                        )}

                                    </label>
                                )
                            )}

                        </div>

                    </div>

                    {/* PENOLAKAN */}
                    {selectedStatus === "ditolak" && (
                        <div>

                            <p
                                className="
                                    mb-2
                                    text-xs font-bold
                                    uppercase tracking-wider
                                    text-gray-500
                                "
                            >
                                Alasan Penolakan{" "}
                                <span className="text-red-400">
                                    *
                                </span>
                            </p>

                            <textarea
                                rows={3}
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(
                                        e.target.value
                                    )
                                }
                                placeholder="Jelaskan alasan penolakan laporan ini..."
                                className="
                                    w-full
                                    rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4 py-3
                                    text-sm text-gray-200
                                    placeholder:text-gray-600
                                    resize-none
                                    focus:outline-none
                                    focus:border-red-500/50
                                    transition
                                "
                            />

                        </div>
                    )}

                </div>

                {/* FOOTER */}
                <div
                    className="
                        flex gap-3
                        px-5 py-4
                        border-t border-white/5
                    "
                >

                    <button
                        onClick={onClose}
                        className="
                            flex-1
                            py-2.5
                            rounded-xl
                            border border-white/10
                            text-sm font-semibold
                            text-gray-400
                            hover:text-white
                            hover:bg-white/5
                            transition
                        "
                    >
                        Batal
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            !selectedStatus ||
                            (
                                selectedStatus === "ditolak" &&
                                !rejectionReason.trim()
                            )
                        }
                        className="
                            flex-1
                            flex items-center justify-center gap-2
                            py-2.5
                            rounded-xl
                            bg-violet-600
                            hover:bg-violet-700
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                            text-sm font-semibold text-white
                            transition
                        "
                    >

                        {loading ? (
                            <span
                                className="
                                    w-4 h-4
                                    rounded-full
                                    border-2
                                    border-white/30
                                    border-t-white
                                    animate-spin
                                "
                            />
                        ) : (
                            <HiOutlineCheckCircle className="w-4 h-4" />
                        )}

                        Simpan

                    </button>

                </div>

            </div>

        </div>
    );
}