"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineIdentification,
  HiOutlinePencil,
  HiOutlineCamera,
  HiOutlineX,
  HiOutlineSave,
} from "react-icons/hi";

export default function ProfilePage() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/auth";

  const [activeNav, setActiveNav] = useState("profil");
  const [user, setUser] = useState({
    id: null,
    nama_lengkap: "",
    email: "",
    nik: "",
    no_telp: "",
    role: "",
    foto_url: null,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nama_lengkap: "",
    email: "",
    nik: "",
    no_telp: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Ambil data user dari API
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        console.error("Gagal fetch profil:", res.status);
      }
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchUserProfile();
  }, []);

  const openEditModal = () => {
    setEditForm({
      nama_lengkap: user.nama_lengkap || "",
      email: user.email || "",
      nik: user.nik || "",
      no_telp: user.no_telp || "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // Upload foto profil ke endpoint terpisah (multipart/form-data)
  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("foto", file);
    const token = localStorage.getItem("token");
    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.foto_url; // URL baru dari server
      } else {
        const error = await res.json();
        throw new Error(error.message || "Gagal upload foto");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Update data diri (tanpa foto)
  const updateUserData = async (updatedData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Gagal update data");
    }
    return await res.json();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let foto_url = user.foto_url;

      // 1. Upload foto jika ada file baru
      if (selectedFile) {
        const newFotoUrl = await uploadPhoto(selectedFile);
        if (newFotoUrl) foto_url = newFotoUrl;
        else throw new Error("Upload foto gagal, lanjutkan tanpa ubah foto?");
      }

      // 2. Update data diri (termasuk foto_url terbaru)
      const updatedUser = await updateUserData({
        nama_lengkap: editForm.nama_lengkap,
        email: editForm.email,
        nik: editForm.nik,
        no_telp: editForm.no_telp,
        foto_url: foto_url, // kirim URL foto terbaru jika ada
      });

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditModalOpen(false);
      alert("Profil berhasil diperbarui");
      fetchUserProfile(); // refresh ulang dari server
    } catch (error) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan saat update profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex-1 overflow-y-auto">
        <section className="px-5 md:px-8 py-7">
          <div className="max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/70 backdrop-blur-sm p-7 md:p-9 mb-7">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-blue-600/20 overflow-hidden">
                    {user.foto_url ? (
                      <img
                        src={user.foto_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <HiOutlineUser className="text-white w-12 h-12" />
                    )}
                  </div>
                  <button
                    onClick={openEditModal}
                    className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-1.5 border-2 border-[#0B1120]"
                    title="Ubah foto"
                  >
                    <HiOutlineCamera className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div>
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
            <div className="bg-[#111827]/60 border border-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8">
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
                  onClick={openEditModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                >
                  <HiOutlinePencil size={17} />
                  Edit Profil
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <HiOutlineUser size={22} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Nama Lengkap</p>
                      <h3 className="text-white font-semibold">
                        {user.nama_lengkap || "-"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <HiOutlineMail size={22} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <h3 className="text-white font-semibold">
                        {user.email || "-"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <HiOutlineIdentification size={22} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">NIK</p>
                      <h3 className="text-white font-semibold">
                        {user.nik || "-"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <HiOutlinePhone size={22} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Nomor Telepon</p>
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

      {/* MODAL EDIT PROFIL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-white/20 rounded-3xl w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Edit Profil</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
              {/* Upload Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Foto Profil
                </label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : user.foto_url ? (
                      <img
                        src={user.foto_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <HiOutlineUser className="text-white w-12 h-12" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white text-sm"
                  >
                    Ganti Foto
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={editForm.nama_lengkap}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    NIK
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={editForm.nik}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="no_telp"
                    value={editForm.no_telp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition disabled:opacity-50"
                >
                  {loading || uploading ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <HiOutlineSave size={18} />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}