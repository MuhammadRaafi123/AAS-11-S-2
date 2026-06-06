"use client";

import { useEffect, useState } from "react";
import { Eye, RefreshCw, CheckCircle } from "lucide-react";

// ========== MODAL STATUS ==========
function StatusModal({ complaint, onClose, refreshComplaints }) {
  const [status, setStatus] = useState(complaint.status);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Mapping untuk menampilkan label yang lebih rapi
  const statusOptions = [
    { value: "menunggu_verifikasi", label: "Menunggu Verifikasi" },
    { value: "diverifikasi", label: "Diverifikasi" },
    { value: "diproses", label: "Diproses" },
    { value: "selesai", label: "Selesai" },
    { value: "ditolak", label: "Ditolak" },
  ];

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/complaints/${complaint.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Gagal update status");

      // Refresh data dari server (laporan yang ditolak akan hilang otomatis)
      await refreshComplaints();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E293B] rounded-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">Ubah Status Laporan</h3>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 rounded bg-[#0F172A] border border-gray-700 mb-6"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
          >
            Batal
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== MODAL DETAIL ==========
function DetailModal({ complaint, onClose }) {
  // Mapping status ke warna dan label
  const statusMap = {
    menunggu_verifikasi: { label: "Menunggu Verifikasi", color: "bg-yellow-600" },
    diverifikasi: { label: "Diverifikasi", color: "bg-blue-600" },
    diproses: { label: "Diproses", color: "bg-purple-600" },
    selesai: { label: "Selesai", color: "bg-green-600" },
    ditolak: { label: "Ditolak", color: "bg-red-600" },
  };
  const statusInfo = statusMap[complaint.status] || { label: complaint.status, color: "bg-gray-600" };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E293B] rounded-xl w-full max-w-2xl p-6 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Detail Laporan</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <p><b>ID Tiket:</b> {complaint.ticket_number}</p>
          <p><b>Pelapor:</b> {complaint.reporter || complaint.nama || complaint.user?.name}</p>
          <p><b>Judul:</b> {complaint.title}</p>

          <p><b>Deskripsi:</b></p>
          <div className="bg-[#0F172A] p-3 rounded">
            {complaint.description}
          </div>

          <p>
            <b>Status:</b>{" "}
            <span className={`ml-2 px-2 py-1 rounded text-xs ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </p>

          <p>
            <b>Tanggal Dibuat:</b>{" "}
            {new Date(complaint.created_at).toLocaleString()}
          </p>

          {complaint.location_address && (
            <p><b>Lokasi:</b> {complaint.location_address}</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== MAIN ADMIN PAGE ==========
export default function AdminPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [detailComplaint, setDetailComplaint] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) setComplaints(data);
      else if (Array.isArray(data.data)) setComplaints(data.data);
      else setComplaints([]);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Mapping status untuk tampilan di tabel
  const statusMap = {
    menunggu_verifikasi: { label: "Menunggu Verifikasi", color: "bg-yellow-600" },
    diverifikasi: { label: "Diverifikasi", color: "bg-blue-600" },
    diproses: { label: "Diproses", color: "bg-purple-600" },
    selesai: { label: "Selesai", color: "bg-green-600" },
    ditolak: { label: "Ditolak", color: "bg-red-600" },
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Laporan</h1>
          <button
            onClick={fetchComplaints}
            className="flex items-center gap-2 bg-[#1E293B] px-4 py-2 rounded hover:bg-[#2D3A4E]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-[#1E293B] rounded-xl">
          <table className="w-full">
            <thead className="bg-[#0F172A]">
              <tr>
                <th className="p-3 text-left">Tiket</th>
                <th className="p-3 text-left">Judul</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Tidak ada laporan
                  </td>
                </tr>
              ) : (
                complaints.map((c) => {
                  const statusInfo = statusMap[c.status] || { label: c.status, color: "bg-gray-600" };
                  return (
                    <tr key={c.id} className="border-b border-gray-700">
                      <td className="p-3">{c.ticket_number}</td>
                      <td className="p-3">{c.title}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setDetailComplaint(c);
                            setDetailOpen(true);
                          }}
                          className="bg-blue-600 p-2 rounded hover:bg-blue-500"
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setOpenModal(true);
                          }}
                          className="bg-green-600 p-2 rounded hover:bg-green-500"
                          title="Ubah Status"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {openModal && selectedComplaint && (
        <StatusModal
          complaint={selectedComplaint}
          onClose={() => setOpenModal(false)}
          refreshComplaints={fetchComplaints}
        />
      )}

      {detailOpen && detailComplaint && (
        <DetailModal
          complaint={detailComplaint}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </div>
  );
}
