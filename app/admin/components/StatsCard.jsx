// components/admin/StatsCard.jsx

export default function StatsCard({
    title,
    value,
    icon: Icon,
    color = "violet",
    trend = null,     
    trendLabel = "",  
    loading = false,
}) {
    const palette = {
        violet: {
            icon: "bg-violet-500/10 border-violet-500/20 text-violet-400",
            value: "text-violet-400",
            glow: "shadow-violet-500/10",
            trend: "bg-violet-500/10 text-violet-400",
        },
        blue: {
            icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",
            value: "text-blue-400",
            glow: "shadow-blue-500/10",
            trend: "bg-blue-500/10 text-blue-400",
        },
        emerald: {
            icon: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            value: "text-emerald-400",
            glow: "shadow-emerald-500/10",
            trend: "bg-emerald-500/10 text-emerald-400",
        },
        amber: {
            icon: "bg-amber-500/10 border-amber-500/20 text-amber-400",
            value: "text-amber-400",
            glow: "shadow-amber-500/10",
            trend: "bg-amber-500/10 text-amber-400",
        },
        red: {
            icon: "bg-red-500/10 border-red-500/20 text-red-400",
            value: "text-red-400",
            glow: "shadow-red-500/10",
            trend: "bg-red-500/10 text-red-400",
        },
    };

    const c = palette[color] || palette.violet;

    return (
        <div className={`
            relative overflow-hidden
            bg-[#111827]/80 border border-white/5
            rounded-2xl p-5
            shadow-xl ${c.glow}
            transition-all duration-300
            hover:border-white/10 hover:-translate-y-0.5
        `}>
            {/* Glow latar */}
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current ${c.value}`} />

            <div className="relative z-10">
                {/* Header: icon + title */}
                <div className="flex items-start justify-between mb-4">
                    <p className="text-sm font-semibold text-gray-400 leading-snug">
                        {title}
                    </p>
                    {Icon && (
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${c.icon}`}>
                            <Icon className="w-[18px] h-[18px]" />
                        </div>
                    )}
                </div>

                {/* Nilai */}
                {loading ? (
                    <div className="h-9 w-20 bg-white/5 rounded-lg animate-pulse" />
                ) : (
                    <p className={`text-3xl font-black tracking-tight ${c.value}`}>
                        {value ?? "—"}
                    </p>
                )}

                {/* Trend */}
                {trend && (
                    <div className="flex items-center gap-2 mt-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.trend}`}>
                            {trend}
                        </span>
                        {trendLabel && (
                            <span className="text-xs text-gray-600">{trendLabel}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}