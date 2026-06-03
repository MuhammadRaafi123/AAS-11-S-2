"use client";

import { useEffect, useState } from "react";
import { BiSolidReport } from "react-icons/bi";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";

export default function Statcard() {
  const [stats, setStats] = useState([
    {
      label: "Total Laporan",
      value: 0,
      icon: <BiSolidReport size={24} />,
      color: "blue",
    },
    {
      label: "Dalam Proses",
      value: 0,
      icon: <HiOutlineClock size={24} />,
      color: "yellow",
    },
    {
      label: "Laporan Selesai",
      value: 0,
      icon: <HiOutlineCheckCircle size={24} />,
      color: "green",
    },
    {
      label: "Ditolak",
      value: 0,
      icon: <HiOutlineXCircle size={24} />,
      color: "red",
    },
  ]);

  const [counts, setCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token tidak ditemukan");
          return;
        }

        const res = await fetch(
          "http://localhost:5000/api/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || `HTTP Error ${res.status}`
          );
        }

        const diproses =
          data.statusBreakdown?.find(
            (item) => item.status === "diproses"
          )?.count || 0;

        const selesai =
          data.statusBreakdown?.find(
            (item) => item.status === "selesai"
          )?.count || 0;

        const ditolak =
          data.statusBreakdown?.find(
            (item) => item.status === "ditolak"
          )?.count || 0;

        setStats([
          {
            label: "Total Laporan",
            value: data.totalComplaints || 0,
            icon: <BiSolidReport size={24} />,
            color: "blue",
          },
          {
            label: "Dalam Proses",
            value: diproses,
            icon: <HiOutlineClock size={24} />,
            color: "yellow",
          },
          {
            label: "Laporan Selesai",
            value: selesai,
            icon: <HiOutlineCheckCircle size={24} />,
            color: "green",
          },
          {
            label: "Ditolak",
            value: ditolak,
            icon: <HiOutlineXCircle size={24} />,
            color: "red",
          },
        ]);
      } catch (error) {
        console.error("STAT ERROR:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const timers = [];

    stats.forEach((stat, index) => {
      let start = 0;
      const end = stat.value;

      const duration = 1200;
      const increment = end / (duration / 20);

      const timer = setInterval(() => {
        start += increment;

        if (start >= end) {
          start = end;
          clearInterval(timer);
        }

        setCounts((prev) => {
          const updated = [...prev];
          updated[index] = Math.floor(start);
          return updated;
        });
      }, 20);

      timers.push(timer);
    });

    return () => timers.forEach(clearInterval);
  }, [stats]);

  const colorClasses = {
    blue: {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    yellow: {
      text: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    green: {
      text: "text-green-400",
      bg: "bg-green-500/10",
    },
    red: {
      text: "text-red-400",
      bg: "bg-red-500/10",
    },
  };

  return (
    <section className="mt-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="
              bg-[#111827]/60
              backdrop-blur-sm
              border border-white/10
              rounded-2xl
              p-5
              hover:border-blue-500/20
              transition-all duration-300
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {item.label}
                </p>

                <h2
                  className={`text-3xl font-black mt-2 ${colorClasses[item.color].text}`}
                >
                  {counts[index].toLocaleString()}
                </h2>
              </div>

              <div
                className={`
                  w-12 h-12
                  rounded-xl
                  flex items-center justify-center
                  ${colorClasses[item.color].bg}
                  ${colorClasses[item.color].text}
                `}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}