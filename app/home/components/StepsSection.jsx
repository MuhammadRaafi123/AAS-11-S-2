    "use client";

    import {
    Wallet,
    Users,
    Trophy,
    } from "lucide-react";

    export default function StepsSection() {

    const steps = [
        {
        icon: <Wallet size={24} />,
        title: "Buat Laporan",
        desc: "Sampaikan aspirasi atau keluhan melalui formulir digital dengan mudah dan aman.",
        },
        {
        icon: <Users size={24} />,
        title: "Verifikasi",
        desc: "Laporan akan ditinjau dan diteruskan ke instansi terkait secara transparan.",
        },
        {
        icon: <Trophy size={24} />,
        title: "Pantau Hasil",
        desc: "Dapatkan notifikasi real-time hingga laporan selesai ditindaklanjuti.",
        },
    ];

    return (
        <section className="mt-14">

        {/* Heading */}
        <div className="mb-8">

            <h2
            className="
                text-2xl md:text-3xl
                font-bold
                text-white
            "
            >
            Langkah Mudah{" "}
            <span className="text-blue-400">
                Melapor
            </span>
            </h2>

            <p
            className="
                text-gray-400
                mt-2
                text-sm md:text-base
            "
            >
            Proses pelaporan yang cepat, transparan, dan mudah dipahami.
            </p>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {steps.map((step, index) => (

            <div
                key={index}
                className="
                bg-[#161b22]
                border border-gray-800
                rounded-2xl
                p-6
                hover:border-blue-500/30
                transition-all duration-300
                "
            >

                {/* Icon */}
                <div
                className="
                    w-12 h-12
                    rounded-xl
                    bg-blue-500/10
                    text-blue-400
                    flex items-center justify-center
                    mb-5
                "
                >
                {step.icon}
                </div>

                {/* Title */}
                <h3
                className="
                    text-lg
                    font-semibold
                    text-white
                    mb-3
                "
                >
                {step.title}
                </h3>

                {/* Description */}
                <p
                className="
                    text-gray-400
                    text-sm
                    leading-7
                "
                >
                {step.desc}
                </p>

            </div>

            ))}

        </div>

        </section>
    );
    }