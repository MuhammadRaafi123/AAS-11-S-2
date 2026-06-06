"use client";

import Link from "next/link";
import {
    HiOutlineArrowRight,
    HiOutlinePlay,
} from "react-icons/hi";

export default function HeaderSection() {
    return (
        <section className="mt-5 mb-20">

            <div
                className="
            flex flex-col lg:flex-row
            lg:items-center
            lg:justify-between
            gap-10
            "
            >

                {/* Left Content */}
                <div className="max-w-3xl">

                    {/* Badge */}
                    <div
                        className="
                inline-flex items-center gap-2
                bg-blue-500/10
                border border-blue-500/20
                text-blue-400
                px-4 py-2
                rounded-full
                text-xs
                font-semibold
                tracking-wide
                mb-6
                "
                    >
                        Platform Pengaduan Modern
                    </div>

                    {/* Title */}
                    <h1
                        className="
                text-4xl
                md:text-5xl
                xl:text-6xl
                font-black
                leading-[1.1]
                tracking-tight
                text-white
                "
                    >
                        <span className="text-blue-400">
                            Suara Anda,
                        </span>{" "}
                        Perubahan Kita
                    </h1>

                    {/* Description */}
                    <p
                        className="
                mt-5
                text-gray-400
                leading-8
                text-[15px] md:text-base
                max-w-2xl
                "
                    >
                        Sampaikan aspirasi, kritik, maupun pengaduan
                        secara cepat dan transparan kepada instansi terkait.
                        Bersama masyarakat, kita ciptakan pelayanan publik
                        yang lebih modern, responsif, dan terpercaya.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap items-center gap-4 mt-8">

                        {/* Primary Button */}
                        <Link
                            href="/home/lapor"
                            className="
                    flex items-center gap-2
                    bg-blue-600 hover:bg-blue-700
                    transition-all duration-300
                    px-6 py-3.5
                    rounded-2xl
                    shadow-lg shadow-blue-900/20
                    font-semibold
                    text-sm
                "
                        >
                            Buat Laporan
                        </Link>

                    </div>

                </div>

            </div>
        </section>
    );
}