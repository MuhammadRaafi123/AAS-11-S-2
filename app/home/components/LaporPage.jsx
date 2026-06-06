"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "./Sidebar";

import {
  HiOutlinePhotograph,
  HiOutlineLocationMarker,
  HiOutlineClipboardList,
  HiOutlinePaperAirplane,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiX,
} from "react-icons/hi";

export default function LaporPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("lapor");
  const [user, setUser] = useState(null);
  
  // State Utama Form
  const [formData, setFormData] = useState({
    category_id: "",
    location_address: "",
    title: "",
    description: "",
  });
  
  // State File Foto
  const [attachment, setAttachment] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      await Promise.resolve();
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }
    };
    init();
  }, []);

  // Handle Input Teks, Select, dan Textarea
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Pilih File Gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 5MB.");
        return;
      }
      setAttachment(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Hapus Foto Yang Dipilih
  const removeImage = (e) => {
    e.preventDefault();
    setAttachment(null);
    setImagePreview(null);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ====================================================
    // VALIDASI FRONTEND DI SINI SUDAH DIHAPUS TOTAL!
    // APAPUN INPUTANNYA AKAN LANGSUNG DIKIRIM KE BACKEND
    // ====================================================

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda belum login!");
        router.push("/landing/login");
        return;
      }

      // Gunakan FormData untuk upload file biner
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      dataToSend.append("category_id", formData.category_id ? parseInt(formData.category_id) : "");
      dataToSend.append("location_address", formData.location_address);
      
      if (attachment) {
        dataToSend.append("attachment", attachment);
      }

      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Laporan berhasil dikirim!");
        // Reset Form
        setFormData({
          category_id: "",
          location_address: "",
          title: "",
          description: "",
        });
        setAttachment(null);
        setImagePreview(null);
        router.push("/home/pantau-laporan-home");
      } else {
        // Jika backend menolak karena ada data kosong, error dari backend muncul di sini
        alert(data.message || "Gagal mengirim laporan (Error dari Backend)");
      }
    } catch (err) {
      console.error("CREATE COMPLAINT ERROR:", err);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <section className="px-5 md:px-7 py-6">
          <div className="max-w-6xl mx-auto">
            
            {/* ================= HERO ================= */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/60 backdrop-blur-sm p-6 md:p-8 mb-6">
              <div className="absolute -top-10 right-0 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-5">
                  <HiOutlineClipboardList size={16} />
                  Form Pengaduan Masyarakat
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  Buat Laporan <span className="block text-blue-400">Pengaduan Baru</span>
                </h1>
                <p className="mt-4 text-gray-400 text-sm md:text-base leading-7 max-w-2xl">
                  Isi formulir pengaduan dengan lengkap agar laporan dapat diproses lebih cepat dan tepat.
                </p>
              </div>
            </div>

            {/* ================= FORM UTAMA ================= */}
            <form onSubmit={handleSubmit} className="bg-[#111827]/55 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8">
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white">Detail Laporan</h2>
                <p className="text-sm text-gray-400 mt-2">
                  Data laporan akan tersimpan ke database complaints dan complaint_attachments.
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Nama Lengkap (Disabled) */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Nama Lengkap</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={user?.nama_lengkap || ""}
                      disabled
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white cursor-not-allowed opacity-70 outline-none"
                    />
                  </div>
                </div>

                {/* No Telepon (Disabled) */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Nomor Telepon</label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={user?.no_telp || ""}
                      disabled
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white cursor-not-allowed opacity-70 outline-none"
                    />
                  </div>
                </div>

                {/* Kategori */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Kategori Laporan</label>
                  <div className="relative">
                    <HiOutlineTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Pilih kategori</option>
                      <option value="1">Infrastruktur Jalan</option>
                      <option value="2">Kesehatan</option>
                      <option value="3">Pendidikan</option>
                      <option value="4">Pelayanan Publik</option>
                      <option value="5">Lingkungan Hidup</option>
                    </select>
                  </div>
                </div>

                {/* Status Awal (Disabled) */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Status Awal</label>
                  <input
                    type="text"
                    value="menunggu_verifikasi"
                    disabled
                    className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-4 py-3 text-sm text-yellow-400 font-medium cursor-not-allowed outline-none"
                  />
                </div>

                {/* Lokasi */}
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300 mb-2 block">Lokasi Kejadian</label>
                  <div className="relative">
                    <HiOutlineLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      name="location_address"
                      value={formData.location_address}
                      onChange={handleInputChange}
                      placeholder="Masukkan lokasi kejadian"
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Judul Laporan */}
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300 mb-2 block">Judul Laporan</label>
                  <div className="relative">
                    <HiOutlineDocumentText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Contoh: Jalan berlubang di depan sekolah"
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300 mb-2 block">Deskripsi Laporan</label>
                  <textarea
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Jelaskan detail laporan Anda..."
                    className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Upload Bukti */}
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300 mb-2 block">Upload Bukti</label>
                  
                  {imagePreview ? (
                    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 bg-[#0F172A] p-2">
                      <img src={imagePreview} alt="Preview Bukti" className="w-full h-48 object-cover rounded-xl" />
                      <button
                        onClick={removeImage}
                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition"
                        title="Hapus Foto"
                      >
                        <HiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="border border-dashed border-white/10 bg-[#0F172A] rounded-2xl p-7 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/30 transition">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                        <HiOutlinePhotograph size={24} />
                      </div>
                      <p className="text-white font-semibold">Upload Foto / Bukti</p>
                      <span className="text-gray-500 text-sm mt-1">PNG, JPG maksimal 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

              </div>

              {/* Tombol Kirim */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  {loading ? "Kirim..." : "Kirim Laporan"}
                  <HiOutlinePaperAirplane size={18} />
                </button>
              </div>

            </form>

          </div>
        </section>
      </main>
    </div>
  );
}