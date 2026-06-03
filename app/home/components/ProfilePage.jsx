  "use client";

  import { useEffect, useState } from "react";
  import Sidebar from "./Sidebar";

  import {
    HiOutlineUser,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineIdentification,
    HiOutlineShieldCheck,
    HiOutlinePencil,
  } from "react-icons/hi";

  export default function ProfilePage() {

    const [activeNav, setActiveNav] = useState("profil");

    const [user, setUser] = useState({
      nama_lengkap: "",
      email: "",
      nik: "",
      no_telp: "",
      role: "",
    });

    useEffect(() => {

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

    }, []);

    return (
      <div className="min-h-screen bg-[#0B1120] flex">

        {/* Sidebar */}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />

        {/* Main */}
        <main className="flex-1 overflow-y-auto">

          <section className="px-5 md:px-8 py-7">

            <div className="max-w-5xl mx-auto">

              {/* HEADER */}
              <div
                className="
                  relative overflow-hidden
                  rounded-3xl
                  border border-white/10
                  bg-[#111827]/70
                  backdrop-blur-sm
                  p-7 md:p-9
                  mb-7
                "
              >

                {/* Glow */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">

                  {/* Avatar */}
                  <div
                    className="
                      w-24 h-24 rounded-3xl
                      bg-gradient-to-br from-blue-500 to-violet-600
                      flex items-center justify-center
                      shadow-2xl shadow-blue-600/20
                    "
                  >
                    <HiOutlineUser className="text-white w-12 h-12" />
                  </div>

                  {/* Info */}
                  <div>

                    <div
                      className="
                        inline-flex items-center gap-2
                        px-4 py-2 rounded-full
                        bg-blue-500/10
                        border border-blue-500/20
                        text-blue-400 text-xs font-semibold
                        mb-4
                      "
                    >
                      <HiOutlineShieldCheck size={15} />
                      Profile Pengguna
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-white">
                      {user.nama_lengkap || "Guest"}
                    </h1>

                    <p className="text-gray-400 mt-2 capitalize">
                      Role: {user.role || "masyarakat"}
                    </p>

                  </div>

                </div>

              </div>

              {/* PROFILE CARD */}
              <div
                className="
                  bg-[#111827]/60
                  border border-white/10
                  backdrop-blur-sm
                  rounded-3xl
                  p-6 md:p-8
                "
              >

                {/* Title */}
                <div className="flex items-center justify-between mb-8">

                  <div>

                    <h2 className="text-2xl font-bold text-white">
                      Informasi Akun
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      Data akun sesuai pengguna yang login
                    </p>

                  </div>

                  <button
                    className="
                      flex items-center gap-2
                      px-4 py-2 rounded-xl
                      bg-blue-600 hover:bg-blue-700
                      text-white text-sm font-semibold
                      transition
                    "
                  >
                    <HiOutlinePencil size={17} />
                    Edit Profil
                  </button>

                </div>

                {/* DATA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Nama */}
                  <div
                    className="
                      bg-[#0F172A]
                      border border-white/10
                      rounded-2xl
                      p-5
                    "
                  >

                    <div className="flex items-center gap-3 mb-3">

                      <div
                        className="
                          w-11 h-11 rounded-xl
                          bg-blue-500/10
                          flex items-center justify-center
                          text-blue-400
                        "
                      >
                        <HiOutlineUser size={22} />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Nama Lengkap
                        </p>

                        <h3 className="text-white font-semibold">
                          {user.nama_lengkap || "-"}
                        </h3>
                      </div>

                    </div>

                  </div>

                  {/* Email */}
                  <div
                    className="
                      bg-[#0F172A]
                      border border-white/10
                      rounded-2xl
                      p-5
                    "
                  >

                    <div className="flex items-center gap-3 mb-3">

                      <div
                        className="
                          w-11 h-11 rounded-xl
                          bg-blue-500/10
                          flex items-center justify-center
                          text-blue-400
                        "
                      >
                        <HiOutlineMail size={22} />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Email
                        </p>

                        <h3 className="text-white font-semibold">
                          {user.email || "-"}
                        </h3>
                      </div>

                    </div>

                  </div>

                  {/* NIK */}
                  <div
                    className="
                      bg-[#0F172A]
                      border border-white/10
                      rounded-2xl
                      p-5
                    "
                  >

                    <div className="flex items-center gap-3 mb-3">

                      <div
                        className="
                          w-11 h-11 rounded-xl
                          bg-blue-500/10
                          flex items-center justify-center
                          text-blue-400
                        "
                      >
                        <HiOutlineIdentification size={22} />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          NIK
                        </p>

                        <h3 className="text-white font-semibold">
                          {user.nik || "-"}
                        </h3>
                      </div>

                    </div>

                  </div>

                  {/* No Telepon */}
                  <div
                    className="
                      bg-[#0F172A]
                      border border-white/10
                      rounded-2xl
                      p-5
                    "
                  >

                    <div className="flex items-center gap-3 mb-3">

                      <div
                        className="
                          w-11 h-11 rounded-xl
                          bg-blue-500/10
                          flex items-center justify-center
                          text-blue-400
                        "
                      >
                        <HiOutlinePhone size={22} />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Nomor Telepon
                        </p>

                        <h3 className="text-white font-semibold">
                          {user.no_telp || "-"}
                        </h3>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>

        </main>

      </div>
    );
  }