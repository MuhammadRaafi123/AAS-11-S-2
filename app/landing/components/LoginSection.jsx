"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function LoginSection() {
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // HANDLE LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({
            type: "",
            text: "",
        });

        try {
            const res = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            // 1. Cek response mentah dari API di console log browser
            console.log("LOGIN RESPONSE:", data);

            // LOGIN GAGAL
            if (!res.ok) {
                setMessage({
                    type: "error",
                    text: data.message || "Login gagal",
                });
                return;
            }

            // 2. Ambil role dengan proteksi ganda (baik dari data.user.role atau data.role)
            const rawRole = data?.user?.role || data?.role || "";

            const role = String(rawRole)
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "_");

            // 3. Pastikan log ini mencetak "admin" atau "super_admin" di console
            console.log("ROLE FINAL:", role);

            // SIMPAN TOKEN
            localStorage.setItem(
                "token",
                data.token
            );

            // SIMPAN USER (menggunakan data.user atau fallback ke root object data)
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...(data.user || data),
                    role,
                })
            );

            setMessage({
                type: "success",
                text: "Login berhasil",
            });

            // REDIRECT MENGGUNAKAN NEXT.JS ROUTER
            setTimeout(() => {
                if (
                    role === "admin" ||
                    role === "super_admin"
                ) {
                    router.push("/admin");
                } else {
                    router.push("/home");
                }
            }, 500);

        } catch (err) {
            console.log("LOGIN ERROR:", err);
            setMessage({
                type: "error",
                text: "Terjadi kesalahan server",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6 py-10">

            <div className="grid md:grid-cols-2 bg-gray-900 rounded-[35px] overflow-hidden shadow-2xl shadow-black/60 max-w-6xl w-full border border-gray-800">

                {/* LEFT */}
                <div className="bg-blue-800 text-white p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-700 rounded-full blur-3xl opacity-40" />
                    <div className="relative z-10">
                        <h1 className="text-5xl font-bold leading-tight">
                            Selamat Datang
                        </h1>
                        <p className="mt-6 text-blue-200 text-lg leading-relaxed">
                            Masuk ke platform pengaduan masyarakat untuk membuat dan memantau laporan publik.
                        </p>
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                            alt="login"
                            className="mt-10 rounded-3xl shadow-xl h-[260px] w-full object-cover"
                        />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-white">
                            Login Account
                        </h2>
                        <p className="text-gray-400 mt-3">
                            Silakan masuk menggunakan email dan password Anda.
                        </p>
                    </div>

                    {/* ALERT */}
                    {message.text && (
                        <div
                            className={`mb-5 px-4 py-3 rounded-xl border text-sm font-medium ${
                                message.type === "error"
                                    ? "bg-red-500/10 border-red-500 text-red-400"
                                    : "bg-green-500/10 border-green-500 text-green-400"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {/* FORM */}
                    <form
                        className="space-y-6"
                        onSubmit={handleLogin}
                    >
                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 rounded-2xl border border-gray-700 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 rounded-2xl border border-gray-700 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Masuk"}
                        </button>
                    </form>

                    {/* REGISTER */}
                    <p className="text-gray-500 mt-8 text-center">
                        Belum punya akun?{" "}
                        <Link
                            href="/register"
                            className="text-blue-400 font-semibold hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>

            </div>

        </div>
    );
}