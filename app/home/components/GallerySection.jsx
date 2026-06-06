"use client";

import { useEffect, useState } from "react";

// Komponen StarRating sederhana (tanpa import eksternal)
function StarRating({ rating, onRatingChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl focus:outline-none"
        >
          <span
            className={
              star <= (hover || rating) ? "text-yellow-400" : "text-gray-600"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default function GallerySection() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // State untuk modal feedback (rating & komentar dari pemilik laporan)
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // State untuk modal detail & komentar publik
  const [detailReport, setDetailReport] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Ambil user dari localStorage (decode JWT)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.id, role: payload.role });
      } catch (e) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setReports(data);
      }
    } catch (err) {
      console.error("GAGAL LOAD GALLERY:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Fetch komentar untuk detail laporan (PUBLIK - tidak perlu token)
  const fetchComments = async (complaintId) => {
    setLoadingComments(true);
    try {
      // Tidak mengirim token agar komentar bisa dilihat semua orang
      const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}/comments`);
      const data = await res.json();
      if (res.ok) setComments(data);
      else setComments([]);
    } catch (err) {
      console.error("Gagal load komentar:", err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  // Submit komentar baru (tetap perlu login)
  const submitComment = async () => {
    if (!detailReport || !newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda harus login untuk berkomentar");
        return;
      }
      const res = await fetch(`http://localhost:5000/api/complaints/${detailReport.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment.trim() }),
      });
      if (res.ok) {
        setNewComment("");
        // Refresh komentar
        await fetchComments(detailReport.id);
      } else {
        const error = await res.json();
        alert(error.message || "Gagal mengirim komentar");
      }
    } catch (err) {
      console.error("Error submit komentar:", err);
      alert("Terjadi kesalahan");
    } finally {
      setSubmittingComment(false);
    }
  };

  const submitFeedback = async () => {
    if (!selectedReport) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/complaints/${selectedReport.id}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: feedbackRating,
            komentar: feedbackText,
          }),
        }
      );
      if (res.ok) {
        await fetchReports(); // refresh data
        setSelectedReport(null);
        setFeedbackRating(5);
        setFeedbackText("");
      } else {
        const error = await res.json();
        alert(error.message || "Gagal mengirim feedback");
      }
    } catch (err) {
      console.error("Feedback error:", err);
      alert("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "selesai":
        return "bg-green-500/20 text-green-300 border-green-500/20";
      case "diproses":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/20";
      case "ditolak":
        return "bg-red-500/20 text-red-300 border-red-500/20";
      case "diverifikasi":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/20";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/20";
    }
  };

  // Fungsi untuk membuka modal detail laporan
  const openDetailModal = async (report) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/complaints/${report.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setDetailReport(data);
        await fetchComments(report.id);
      }
    } catch (err) {
      console.error(err);
    }
  };


  if (loading) {
    return (
      <section className="mt-14">
        <p className="text-gray-400">Memuat laporan...</p>
      </section>
    );
  }

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/complaints/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal menghapus komentar");
        return;
      }

      await fetchComments(detailReport.id);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <>
      <section className="mt-14">
        {/* Heading */}
        <div className="mb-8">
          <span className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            Gallery Laporan
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-4">
            Laporan Masyarakat
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base max-w-2xl">
            Dokumentasi laporan masyarakat melalui sistem pengaduan online.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((item) => (
            <div
              key={item.id}
              className="relative h-[320px] rounded-3xl overflow-hidden group border border-gray-800 cursor-pointer"
              onClick={() => openDetailModal(item)}
            >
              {/* Image */}
              <img
                src={
                  item.image_url
                    ? `http://localhost:5000${item.image_url}`
                    : "/no-image.png"
                }
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80" />

              {/* Status */}
              <div
                className={`absolute top-4 left-4 px-3 py-1 rounded-full backdrop-blur-sm border text-[10px] font-semibold tracking-wider ${getStatusStyle(
                  item.status
                )}`}
              >
                {item.status?.toUpperCase()}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-5 z-20 w-full">
                <p className="text-blue-300 text-xs mb-2">
                  {item.category_name || "Kategori"}
                </p>
                <h3 className="text-lg font-bold text-white line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                  {item.description}
                </p>

                {/* Tampilkan feedback jika ada */}
                {item.rating && (
                  <div className="mt-2 pt-2 border-t border-gray-700/50">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-white text-xs">{item.rating}/5</span>
                      {item.komentar && (
                        <span className="text-gray-400 text-xs ml-2 truncate">
                          "{item.komentar}"
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tombol Beri Feedback (hanya untuk pemilik laporan dengan status selesai dan belum ada rating) */}
                {user &&
                  item.user_id === user.id &&
                  item.status === "selesai" &&
                  !item.rating && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah modal detail terbuka
                        setSelectedReport(item);
                        setFeedbackRating(5);
                        setFeedbackText("");
                      }}
                      className="mt-3 inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                    >
                      ⭐ Beri Rating & Komentar
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Feedback (Rating & Komentar dari pelapor) */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                Beri Feedback: {selectedReport.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Laporan Anda telah selesai. Bagikan pengalaman Anda.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating (1–5)
                </label>
                <StarRating
                  rating={feedbackRating}
                  onRatingChange={setFeedbackRating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Komentar (opsional)
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Tulis komentar Anda..."
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={submitFeedback}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50"
              >
                {submitting ? "Mengirim..." : "Kirim Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Laporan + Komentar Publik */}
      {detailReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setDetailReport(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <h3 className="text-xl font-bold text-white">{detailReport.title}</h3>
              <p className="text-gray-400 text-sm mt-1">
                {detailReport.category_name || "Kategori"} • Status:{" "}
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusStyle(detailReport.status)}`}>
                  {detailReport.status}
                </span>
              </p>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-4">
              {/* Gambar Laporan */}
              <img
                src={
                  detailReport.image_url
                    ? `http://localhost:5000${detailReport.image_url}`
                    : "/no-image.png"
                }
                alt={detailReport.title}
                className="w-full rounded-xl object-cover max-h-80"
              />
              {/* Deskripsi */}
              <div>
                <h4 className="text-white font-semibold mb-1">Deskripsi</h4>
                <p className="text-gray-300 text-sm">{detailReport.description}</p>
              </div>

              {/* Feedback dari pelapor (jika ada) */}
              {detailReport.rating && (
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <h4 className="text-white font-semibold text-sm mb-1">Feedback Pelapor</h4>
                  <div className="flex items-center gap-2">
                    <StarRating rating={detailReport.rating} onRatingChange={() => { }} />
                    <span className="text-white text-sm">({detailReport.rating}/5)</span>
                  </div>
                  {detailReport.komentar && (
                    <p className="text-gray-300 text-sm mt-2 italic">"{detailReport.komentar}"</p>
                  )}
                </div>
              )}

              {/* Daftar Komentar Publik */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  💬 Komentar Masyarakat
                  <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{comments.length}</span>
                </h4>
                {loadingComments ? (
                  <p className="text-gray-400 text-sm">Memuat komentar...</p>
                ) : comments.length === 0 ? (
                  <p className="text-gray-500 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-800/40 rounded-xl p-3 border border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-blue-400 font-medium text-sm">
                              {comment.user_name || "Anonim"}
                            </span>

                            <div className="text-gray-500 text-xs">
                              {new Date(comment.created_at).toLocaleDateString("id-ID")}
                            </div>
                          </div>

                          {(user?.role === "admin" ||
                            user?.role === "super_admin" ||
                            user?.id === comment.user_id) && (
                              <button
                                onClick={() => deleteComment(comment.id)}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                Hapus
                              </button>
                            )}
                        </div>

                        <p className="text-gray-300 text-sm mt-2">
                          {comment.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form Tambah Komentar (hanya jika user login) */}
                {user ? (
                  <div className="mt-4 pt-3 border-t border-gray-700">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Tulis komentar Anda..."
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={submitComment}
                        disabled={submittingComment || !newComment.trim()}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50"
                      >
                        {submittingComment ? "Mengirim..." : "Kirim Komentar"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mt-3 text-center">
                    Login untuk memberikan komentar.
                  </p>
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setDetailReport(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm hover:bg-gray-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}