    "use client";

    import { useState } from "react";
    import { ChevronDown } from "lucide-react";

    export default function FAQSection() {
    const faqs = [
        {
        question: "Bagaimana cara membuat laporan pengaduan?",
        answer:
            "Anda cukup menekan tombol 'Buat Laporan' di halaman beranda, mengisi formulir yang tersedia dengan detail kejadian, lokasi, dan melampirkan bukti pendukung berupa foto atau dokumen. Proses ini dirancang agar cepat dan mudah dipahami.",
        },
        {
        question: "Apakah identitas pelapor akan tetap dirahasiakan?",
        answer:
            "Tentu saja. Kami sangat menjunjung tinggi privasi Anda. Sistem kami menyediakan opsi 'Anonim' sehingga identitas Anda tidak akan dipublikasikan atau diberikan kepada pihak terlapor, menjamin keamanan Anda dalam beraspirasi.",
        },
        {
        question: "Berapa lama waktu yang dibutuhkan untuk memproses laporan?",
        answer:
            "Setiap laporan akan diverifikasi dalam waktu maksimal 24 jam kerja. Setelah diverifikasi, laporan akan diteruskan ke instansi terkait yang memiliki waktu standar 3 hingga 5 hari kerja untuk memberikan tanggapan awal",
        },
        {
        question: "Bagaimana saya bisa memantau status laporan saya?",
        answer:
            " Anda akan mendapatkan nomor registrasi unik untuk setiap laporan. Gunakan nomor tersebut di halaman 'Pantau Laporan' untuk melihat perkembangan terkini, mulai dari tahap verifikasi hingga penyelesaian oleh petugas.",
        },
        {
        question: "Apa yang harus saya lakukan jika laporan di tolak?",
        answer:
            "Jika laporan ditolak, sistem akan memberikan alasan yang jelas, misalnya karena kurangnya bukti atau salah alamat instansi. Anda dapat memperbaiki informasi tersebut dan mengirimkan kembali laporan Anda untuk diproses ulang.",
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-gray-100 py-24 px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-5xl font-bold text-[#0f172a]">
            Ruang Tanya Jawab
            </h2>

            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
            Temukan jawaban atas pertanyaan umum mengenai sistem pengaduan
            masyarakat LAPOR untuk kemudahan akses layanan publik.
            </p>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
            <div
                key={index}
                className="bg-white rounded-[30px] shadow-sm border border-gray-800 overflow-hidden"
            >
                <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-8 text-left"
                >
                <span className="text-2xl font-semibold text-[#0f172a]">
                    {faq.question}
                </span>

                <ChevronDown
                className={`transition duration-300 text-black stroke-[3] ${
                    openIndex === index ? "rotate-180" : ""
                }`}
                size={32}
                />
                </button>

                {/* Answer */}
                <div
                className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
                >
                <div className="overflow-hidden">
                    <p className="px-8 pb-8 text-gray-600 text-lg leading-relaxed">
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