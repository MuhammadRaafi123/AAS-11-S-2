"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterSection() {
    const router = useRouter();

    const [form, setForm] = useState({
        nama_lengkap: "",
        email: "",
        password: "",
        nik: "",
        no_telp: "",
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        show: false,
        type: "",
        message: "",
    });

    // HANDLE INPUT (DENGAN FILTER ANGKA)
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Jika field adalah NIK atau no_telp, pastikan hanya angka
        if (name === "nik" || name === "no_telp") {
            const numericValue = value.replace(/[^0-9]/g, "");
            setForm({ ...form, [name]: numericValue });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // HANDLE REGISTER
    const handleRegister = async (e) => {
        e.preventDefault();

        // VALIDASI KOLOM KOSONG
        if (!form.nama_lengkap || !form.email || !form.password || !form.nik || !form.no_telp) {
            setAlert({ show: true, type: "error", message: "Semua kolom wajib diisi" });
            return;
        }

        // VALIDASI NIK (HARUS 16 DIGIT)
        if (form.nik.length !== 16) {
            setAlert({ show: true, type: "error", message: "NIK harus 16 digit angka" });
            return;
        }

        // VALIDASI NO TELEPON (MIN 10 DIGIT)
        if (form.no_telp.length < 10) {
            setAlert({ show: true, type: "error", message: "No Telepon minimal 10 digit" });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setAlert({ show: true, type: "error", message: data.message || "Registrasi gagal" });
                setLoading(false);
                return;
            }

            setAlert({ show: true, type: "success", message: "Registrasi berhasil, mengarah ke login..." });
            setForm({ nama_lengkap: "", email: "", password: "", nik: "", no_telp: "" });

            setTimeout(() => {
                router.push("/landing/login");
            }, 1500);
        } catch (err) {
            console.log(err);
            setAlert({ show: true, type: "error", message: "Terjadi kesalahan server" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6 py-10">
            <div className="grid md:grid-cols-2 bg-gray-900 rounded-[35px] overflow-hidden shadow-2xl shadow-black/60 max-w-6xl w-full border border-gray-800">
                
                {/* LEFT */}
                <div className="p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-white">Buat Account</h2>
                        <p className="text-gray-400 mt-3">Daftar sekarang untuk mulai membuat laporan publik.</p>
                    </div>

                    {alert.show && (
                        <div className={`mb-5 px-4 py-3 rounded-xl border text-sm font-medium ${
                            alert.type === "error" ? "bg-red-500/10 border-red-500 text-red-400" : "bg-green-500/10 border-green-500 text-green-400"
                        }`}>
                            {alert.message}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Nama Lengkap</label>
                            <input type="text" name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} placeholder="Masukkan nama lengkap" className="w-full px-5 py-4 rounded-2xl border border-gray-700 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Masukkan email" className="w-full px-5 py-4 rounded-2xl border border-gray-700 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Masukkan password" className="w-full px-5 py-4 rounded-2xl border border-gray-700 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">NIK</label>
                                <input type="text" name="nik" value={form.nik} maxLength="16" onChange={handleChange} placeholder="16 Digit NIK" className="w-full px-5 py-4 rounded-2xl border border-gray-700 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">No Telepon</label>
                                <input type="text" name="no_telp" value={form.no_telp} onChange={handleChange} placeholder="Min 10 Digit" className="w-full px-5 py-4 rounded-2xl border border-gray-700 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {loading ? "Loading..." : "Register"}
                        </button>
                    </form>

                    <p className="text-gray-500 mt-8 text-center">
                        Sudah punya akun? <Link href="/landing/login" className="text-blue-400 font-semibold hover:underline">Login</Link>
                    </p>
                </div>

                {/* RIGHT */}
                <div className="bg-blue-800 text-white p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-700 rounded-full blur-3xl opacity-40" />
                    <div className="relative z-10 -mt-16">
                        <h1 className="text-5xl font-bold leading-tight">Bergabung<br />Bersama Kami</h1>
                        <p className="mt-6 text-blue-200 text-lg leading-relaxed">Jadilah bagian dari perubahan dengan membuat laporan publik secara cepat dan transparan.</p>
                        
                        <img
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                            alt="register"
                            className="mt-6 rounded-3xl shadow-xl h-[260px] w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}