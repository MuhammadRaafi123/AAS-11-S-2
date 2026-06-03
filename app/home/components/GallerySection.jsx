"use client";

import { useEffect, useState } from "react";

export default function GallerySection() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setReports(data);
      }
    } catch (err) {
      console.error("GAGAL LOAD GALLERY:", err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <section className="mt-14">
        <p className="text-gray-400">
          Memuat laporan...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-14">
      {/* Heading */}
      <div className="mb-8">
        <span
          className="
            inline-flex
            px-4 py-2
            rounded-full
            bg-blue-500/10
            text-blue-400
            text-xs
            font-semibold
            border border-blue-500/20
          "
        >
          Gallery Laporan
        </span>

        <h2
          className="
            text-2xl md:text-3xl
            font-bold
            text-white
            mt-4
          "
        >
          Laporan Masyarakat
        </h2>

        <p
          className="
            text-gray-400
            mt-2
            text-sm md:text-base
            max-w-2xl
          "
        >
          Dokumentasi laporan masyarakat melalui sistem pengaduan online.
        </p>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((item) => (
          <div
            key={item.id}
            className="
              relative
              h-[320px]
              rounded-3xl
              overflow-hidden
              group
              border border-gray-800
            "
          >
            {/* Image */}
            <img
              src={
                item.image_url
                  ? `http://localhost:5000${item.image_url}`
                  : "/no-image.png"
              }
              alt={item.title}
              className="
                w-full
                h-full
                object-cover
                group-hover:scale-110
                transition-all
                duration-700
              "
            />

            {/* Overlay */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-b
                from-black/10
                via-black/20
                to-black/80
              "
            />

            {/* Status */}
            <div
              className={`
                absolute top-4 left-4
                px-3 py-1
                rounded-full
                backdrop-blur-sm
                border
                text-[10px]
                font-semibold
                tracking-wider
                ${getStatusStyle(item.status)}
              `}
            >
              {item.status?.toUpperCase()}
            </div>

            {/* Content */}
            <div
              className="
                absolute bottom-0 left-0
                p-5
                z-20
                w-full
              "
            >
              <p className="text-blue-300 text-xs mb-2">
                {item.category_name || "Kategori"}
              </p>

              <h3
                className="
                  text-lg
                  font-bold
                  text-white
                  line-clamp-2
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  text-gray-300
                  text-sm
                  mt-2
                  line-clamp-3
                "
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}