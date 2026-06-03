const statusConfig = {
    menunggu_verifikasi: {
        label: "Menunggu",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        dot: "bg-amber-400",
    },
    diverifikasi: {
        label: "Diverifikasi",
        className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        dot: "bg-blue-400",
    },
    diproses: {
        label: "Diproses",
        className: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        dot: "bg-violet-400",
    },
    selesai: {
        label: "Selesai",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-400",
    },
    ditolak: {
        label: "Ditolak",
        className: "bg-red-500/10 text-red-400 border-red-500/20",
        dot: "bg-red-400",
    },
};

export default function TableRow({
    ticketNumber,
    name,
    title,
    category,
    status,
    date,
    onUpdateStatus,
}) {
    const s = statusConfig[status] || {
        label: status,
        className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        dot: "bg-gray-400",
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/3 transition-colors group">

            {/* No. Tiket */}
            <td className="py-3.5 px-4">
                <span className="text-xs font-mono font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-lg">
                    {ticketNumber || "-"}
                </span>
            </td>

            {/* Pelapor */}
            <td className="py-3.5 px-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-white">
                            {name?.[0]?.toUpperCase() || "?"}
                        </span>
                    </div>
                    <span className="text-sm text-gray-200 font-medium">{name || "-"}</span>
                </div>
            </td>

            {/* Judul */}
            <td className="py-3.5 px-4 max-w-[200px]">
                <p className="text-sm text-gray-300 truncate" title={title}>
                    {title || "-"}
                </p>
            </td>

            {/* Kategori */}
            <td className="py-3.5 px-4">
                <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                    {category || "-"}
                </span>
            </td>

            {/* Status */}
            <td className="py-3.5 px-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.className}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                </span>
            </td>

            {/* Tanggal */}
            <td className="py-3.5 px-4">
                <span className="text-xs text-gray-500">{date || "-"}</span>
            </td>

            {/* Aksi */}
            <td className="py-3.5 px-4">
                <button
                    onClick={() => onUpdateStatus && onUpdateStatus()}
                    className="
                        text-xs font-semibold px-3 py-1.5 rounded-lg
                        bg-violet-500/10 text-violet-400 border border-violet-500/20
                        hover:bg-violet-500/20 hover:text-violet-300
                        transition-all duration-150
                        opacity-0 group-hover:opacity-100
                    "
                >
                    Update
                </button>
            </td>
        </tr>
    );
}