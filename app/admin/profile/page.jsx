// app/admin/profil/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlinePencil,
  HiOutlineCamera,
  HiOutlineSave,
  HiOutlineX,
  HiOutlineKey,
} from "react-icons/hi";

export default function AdminProfilePage() {

  const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

  const [activeNav, setActiveNav] = useState("profil");
  const [admin, setAdmin] = useState({
    id: "",
    nama_lengkap: "",
    email: "",
    no_telp: "",
    role: "admin",
    foto_url: null,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nama_lengkap: "",
    email: "",
    no_telp: "",
    password: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAdmin(data);
        localStorage.setItem("admin", JSON.stringify(data));
      } else if (res.status === 401) {
        window.location.href = "/landing/login";
      }
    } catch (error) {
      console.error("Gagal mengambil profil admin:", error);
    }
  };

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    fetchAdminProfile();
  }, []);

  const openEditModal = () => {
    setEditForm({
      nama_lengkap: admin.nama_lengkap || "",
      email: admin.email || "",
      no_telp: admin.no_telp || "",
      password: "",
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
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile) return null;
    const formData = new FormData();
    formData.append("foto", selectedFile);
    const token = localStorage.getItem("token");
    setUploading(true);
    try {
      const res = await fetch(
        `${API_URL}/auth/profile/photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (res.ok) {
        const data = await res.json();
        return data.foto_url;
      }
      throw new Error("Gagal upload foto");
    } catch (error) {
      console.error(error);
      alert("Upload foto gagal");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let foto_url = admin.foto_url;
      if (selectedFile) {
        const newFotoUrl = await uploadPhoto();
        if (newFotoUrl) foto_url = newFotoUrl;
      }

      const token = localStorage.getItem("token");
      const payload = {
        nama_lengkap: editForm.nama_lengkap,
        email: editForm.email,
        no_telp: editForm.no_telp,
        foto_url,
      };
      if (editForm.password && editForm.password.trim() !== "") {
        payload.password = editForm.password;
      }

      const res = await fetch(
        `${API_URL}/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const updatedAdmin = await res.json();
        setAdmin(updatedAdmin);
        localStorage.setItem("admin", JSON.stringify(updatedAdmin));
        setIsEditModalOpen(false);
        alert("Profil berhasil diperbarui");
        fetchAdminProfile();
      } else {
        const error = await res.json();
        alert(error.message || "Gagal update profil");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar title="Profil Admin" subtitle="Kelola data akun Anda" />
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/70 backdrop-blur-sm p-6 md:p-8 mb-8">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg overflow-hidden">
                    {admin.foto_url ? (
                      <img src={admin.foto_url} alt="Foto Admin" className="w-full h-full object-cover" />
                    ) : (
                      <HiOutlineUser className="text-white w-14 h-14" />
                    )}
                  </div>
                  <button
                    onClick={openEditModal}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 border-2 border-[#0B1120]"
                    title="Ubah foto"
                  >
                    <HiOutlineCamera className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                    <HiOutlineShieldCheck size={14} />
                    Administrator
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {admin.nama_lengkap || "Admin"}
                  </h1>
                  <p className="text-gray-400 mt-1">{admin.email}</p>
                  <p className="text-gray-500 text-sm capitalize">Role: {admin.role}</p>
                </div>

                <button
                  onClick={openEditModal}
                  className="md:ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  <HiOutlinePencil size={16} />
                  Edit Profil
                </button>
              </div>
            </div>

            {/* Informasi Detail */}
            <div className="bg-[#111827]/60 border border-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Informasi Akun</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <HiOutlineUser size={22} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Nama Lengkap</p>
                      <h3 className="text-white font-semibold">{admin.nama_lengkap || "-"}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <HiOutlineMail size={22} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <h3 className="text-white font-semibold">{admin.email || "-"}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <HiOutlinePhone size={22} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Nomor Telepon</p>
                      <h3 className="text-white font-semibold">{admin.no_telp || "-"}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <HiOutlineShieldCheck size={22} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Role</p>
                      <h3 className="text-white font-semibold capitalize">{admin.role || "admin"}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL EDIT PROFIL - tema gelap */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-white/20 rounded-3xl w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Edit Profil Admin</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                <HiOutlineX size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Foto Profil</label>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : admin.foto_url ? (
                      <img src={admin.foto_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <HiOutlineUser className="text-white w-10 h-10" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white text-sm transition"
                  >
                    Ganti Foto
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={editForm.nama_lengkap}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nomor Telepon</label>
                  <input
                    type="tel"
                    name="no_telp"
                    value={editForm.no_telp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password Baru (opsional)</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={editForm.password}
                      onChange={handleInputChange}
                      placeholder="Kosongkan jika tidak diubah"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <HiOutlineKey className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
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
                  {loading || uploading ? "Menyimpan..." : <><HiOutlineSave size={18} /> Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}