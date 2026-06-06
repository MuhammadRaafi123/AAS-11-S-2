"use client";

import { useState } from "react";

import {
    ChevronDown,
} from "lucide-react";

export default function FAQSection() {

    const faqs = [
        {
            question: "Bagaimana cara membuat laporan pengaduan?",
            answer:
                "Tekan tombol 'Buat Laporan', lalu isi formulir dengan detail kejadian, lokasi, dan bukti pendukung.",
        },
        {
            question: "Apakah identitas pelapor dirahasiakan?",
            answer:
                "Ya, sistem menyediakan opsi anonim untuk menjaga keamanan dan privasi pelapor.",
        },
        {
            question: "Berapa lama laporan diproses?",
            answer:
                "Laporan diverifikasi maksimal 24 jam kerja sebelum diteruskan ke instansi terkait.",
        },
        {
            question: "Bagaimana cara memantau laporan?",
            answer:
                "Gunakan nomor registrasi laporan pada halaman Pantau Laporan untuk melihat status terbaru.",
        },
        {
            question: "Apa yang terjadi jika laporan ditolak?",
            answer:
                "Sistem akan memberikan alasan penolakan dan Anda dapat memperbaiki laporan lalu mengirim ulang.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(
            openIndex === index ? null : index
        );
    };

    return (
        <section className="mt-14 pb-10">

            {/* Heading */}
            <div className="mb-8">

                <span
                    className="
                inline-flex
                px-4 py-2
                rounded-full
                bg-blue-500/10
                border border-blue-500/20
                text-blue-400
                text-xs
                font-semibold
            "
                >
                    FAQ
                </span>

                <h2
                    className="
                text-2xl md:text-3xl
                font-bold
                text-white
                mt-4
            "
                >
                    Ruang Tanya Jawab
                </h2>

                <p
                    className="
                text-gray-400
                mt-2
                max-w-2xl
                text-sm md:text-base
            "
                >
                    Temukan jawaban atas pertanyaan umum mengenai sistem pengaduan masyarakat.
                </p>

            </div>

            {/* FAQ Items */}
            <div className="space-y-4">

                {faqs.map((faq, index) => (

                    <div
                        key={index}
                        className="
                bg-[#161b22]/40
                backdrop-blur-sm
                border border-gray-800/70
                rounded-2xl
                overflow-hidden
                transition-all duration-300
                "
                    >

                        {/* Button */}
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="
                    w-full
                    flex items-center justify-between
                    text-left
                    p-5
                "
                        >

                            <span
                                className="
                    text-white
                    font-semibold
                    text-sm md:text-base
                    "
                            >
                                {faq.question}
                            </span>

                            <ChevronDown
                                size={20}
                                className={`
                    text-gray-400
                    transition-transform duration-300
                    ${openIndex === index ? "rotate-180" : ""}
                    `}
                            />

                        </button>

                        {/* Answer */}
                        <div
                            className={`
                    grid transition-all duration-300
                    ${openIndex === index
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                                }
                `}
                        >

                            <div className="overflow-hidden">

                                <p
                                    className="
                        px-5 pb-5
                        text-gray-400
                        text-sm
                        leading-7
                    "
                                >
                                    {faq.answer}
                                </p>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}