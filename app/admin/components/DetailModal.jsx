"use client";

import { useState, useEffect } from "react";
import {
    HiOutlineX,
    HiOutlinePhotograph,
} from "react-icons/hi";

const statusConfig = {
    menunggu_verifikasi: {
        label: "Menunggu Verifikasi",
        color: "amber",
    },
    diverifikasi: {
        label: "Diverifikasi",
        color: "blue",
    },
    diproses: {
        label: "Diproses",
        color: "violet",
    },
    selesai: {
        label: "Selesai",
        color: "emerald",
    },
    ditolak: {
        label: "Ditolak",
        color: "red",
    },
};

const statusColorClasses = {
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const dotColorClasses = {
    amber: "bg-amber-400",
    blue: "bg-blue-400",
    violet: "bg-violet-400",
    emerald: "bg-emerald-400",
    red: "bg-red-400",
    gray: "bg-gray-400",
};

const CATEGORY_MAP = {
    1: "Infrastruktur Jalan",
    2: "Kesehatan",
    3: "Pendidikan",
    4: "Pelayanan Publik",
    5: "Lingkungan Hidup",
};

export default function DetailModal({
    complaint,
    onClose,
}) {
    const [selectedImage, setSelectedImage] =
        useState(null);

    if (!complaint || typeof complaint !== "object") {
        return null;
    }

    const reporterName =
        complaint.reporter ??
        complaint.nama_lengkap ??
        complaint.user?.name ??
        "-";

    const ticketNumber =
        complaint.ticket_number ?? "-";

    const title = complaint.title ?? "-";

    const categoryId =
        complaint.category_id;

    const categoryName =
        complaint.category_name;

    const description =
        complaint.description ??
        "Tidak ada deskripsi";

    const statusRaw =
        complaint.status ?? "unknown";

    const createdAt =
        complaint.created_at;

    const BASE_URL =
        process.env
            .NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:5000";

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const fetchComments = async () => {
  try {
    setLoadingComments(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/complaints/${complaint.id}/comments`,
      {
        headers: {
          Authorization: token
            ? `Bearer ${token}`
            : "",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setComments(data);
    } else {
      setComments([]);
    }
  } catch (err) {
    console.error("Load comments error:", err);
    setComments([]);
  } finally {
    setLoadingComments(false);
  }
};

    let images = [];

    if (Array.isArray(complaint.images)) {
        images = complaint.images;
    } else if (
        Array.isArray(complaint.attachments)
    ) {
        images = complaint.attachments;
    } else if (
        typeof complaint.image_url ===
        "string"
    ) {
        images = [
            complaint.image_url.startsWith(
                "http"
            )
                ? complaint.image_url
                : `${BASE_URL}${complaint.image_url}`,
        ];
    } else if (
        typeof complaint.image === "string"
    ) {
        images = [complaint.image];
    } else if (
        typeof complaint.foto === "string"
    ) {
        images = [complaint.foto];
    }

    useEffect(() => {
  if (complaint?.id) {
    fetchComments();
  }
}, [complaint]);

    const formattedDate = createdAt
        ? new Date(
              createdAt
          ).toLocaleString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "-";

    const status =
        statusConfig[statusRaw] || {
            label: statusRaw,
            color: "gray",
        };

    const statusClass =
        statusColorClasses[
            status.color
        ] ||
        statusColorClasses.gray;

    const dotClass =
        dotColorClasses[
            status.color
        ] || dotColorClasses.gray;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0F172A] shadow-2xl">

                    {/* HEADER */}
                    <div className="sticky top-0 z-10 bg-[#0F172A]/95 backdrop-blur border-b border-white/10 px-5 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Detail Laporan
                            </h2>

                            <p className="mt-1 text-sm font-mono text-violet-400">
                                #{ticketNumber}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition"
                        >
                            <HiOutlineX className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="p-6 space-y-6">

                        {/* INFO CARD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                    Pelapor
                                </p>

                                <div className="flex items-center gap-4 mt-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                        <span className="font-bold text-white">
                                            {reporterName?.[0]?.toUpperCase() ||
                                                "?"}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-white">
                                            {reporterName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                    Status Laporan
                                </p>

                                <div className="mt-3">
                                    <span
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusClass}`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${dotClass}`}
                                        />
                                        {status.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* JUDUL */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Judul Laporan
                            </p>

                            <h3 className="mt-2 text-lg font-semibold text-white leading-relaxed">
                                {title}
                            </h3>
                        </div>

                        {/* KATEGORI & TANGGAL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                    Kategori
                                </p>

                                <p className="mt-2 text-white font-medium">
                                    {CATEGORY_MAP[
                                        categoryId
                                    ] ||
                                        categoryName ||
                                        "-"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                    Tanggal Laporan
                                </p>

                                <p className="mt-2 text-white font-medium">
                                    {formattedDate}
                                </p>
                            </div>
                        </div>

                        {/* DESKRIPSI */}
                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Deskripsi Lengkap
                            </p>

                            <div className="mt-2 rounded-xl border border-white/10 bg-[#111827]/80 p-4">
                                <p className="text-gray-300 whitespace-pre-wrap leading-7">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* GALERI */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <HiOutlinePhotograph className="w-5 h-5" />
                                <span className="text-xs uppercase tracking-wider">
                                    Lampiran Gambar (
                                    {images.length})
                                </span>
                            </div>

                            {images.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                                    {images.map(
                                        (
                                            img,
                                            idx
                                        ) => {
                                            let imageUrl =
                                                "";

                                            if (
                                                typeof img ===
                                                "string"
                                            ) {
                                                imageUrl =
                                                    img;
                                            } else if (
                                                img?.url
                                            ) {
                                                imageUrl =
                                                    img.url;
                                            } else if (
                                                img?.path
                                            ) {
                                                imageUrl =
                                                    img.path;
                                            } else if (
                                                img?.file_path
                                            ) {
                                                imageUrl =
                                                    img.file_path;
                                            }

                                            if (
                                                !imageUrl
                                            )
                                                return null;

                                            return (
                                                <div
                                                    key={
                                                        idx
                                                    }
                                                    onClick={() =>
                                                        setSelectedImage(
                                                            imageUrl
                                                        )
                                                    }
                                                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 cursor-pointer group hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
                                                >
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={`lampiran-${idx}`}
                                                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(
                                                            e
                                                        ) => {
                                                            e.target.src =
                                                                "/placeholder-image.png";
                                                        }}
                                                    />

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center pb-4">
                                                        <span className="text-xs text-white bg-black/50 px-3 py-1 rounded-full">
                                                            Klik untuk memperbesar
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
                                    <HiOutlinePhotograph className="w-10 h-10 text-gray-600 mx-auto mb-3" />

                                    <p className="text-gray-500">
                                        Tidak ada gambar
                                        lampiran
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KOMENTAR MASYARAKAT */}
<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
    <div className="flex items-center justify-between mb-4">
        <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
                Komentar Masyarakat
            </p>
            <h4 className="text-white font-semibold mt-1">
                Diskusi & Tanggapan Warga
            </h4>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium">
            {comments.length} Komentar
        </span>
    </div>

    {loadingComments ? (
        <div className="flex justify-center py-8">
            <p className="text-gray-400">
                Memuat komentar...
            </p>
        </div>
    ) : comments.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
            <p className="text-gray-500">
                Belum ada komentar pada laporan ini.
            </p>
        </div>
    ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className="rounded-xl border border-white/10 bg-[#111827]/80 p-4"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h5 className="font-medium text-cyan-400">
                                {comment.user_name || "Pengguna"}
                            </h5>

                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(
                                    comment.created_at
                                ).toLocaleString(
                                    "id-ID",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        </div>
                    </div>

                    <p className="mt-3 text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {comment.comment}
                    </p>
                </div>
            ))}
        </div>
    )}
</div>

                    {/* FOOTER */}
                    <div className="border-t border-white/10 px-5 py-3 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>

            {/* IMAGE PREVIEW */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
                    onClick={() =>
                        setSelectedImage(null)
                    }
                >
                    <img
                        src={selectedImage}
                        alt="preview"
                        className="max-w-[80vw] max-h-[80vh] object-contain rounded-xl shadow-2xl"
                    />

                    <button
                        onClick={() =>
                            setSelectedImage(null)
                        }
                        className="absolute top-5 right-5 w-12 h-12 rounded-xl bg-black/50 border border-white/10 text-white flex items-center justify-center"
                    >
                        <HiOutlineX className="w-6 h-6" />
                    </button>
                </div>

                
            )}
        </>
    );
}