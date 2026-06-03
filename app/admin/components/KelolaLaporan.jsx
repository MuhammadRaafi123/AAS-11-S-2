"use client";

import { useEffect, useState } from "react";
import { HiOutlineClipboardList, HiOutlineRefresh } from "react-icons/hi";

import Table from "./Table";
import StatusModal from "./Statusmodal";

export default function AdminPage() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // ======================================================
    // GET DATA LAPORAN
    // ======================================================
    async function fetchComplaints() {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/complaints", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Gagal mengambil data");
                return;
            }

            setComplaints(data);
        } catch (err) {
            console.log(err);
            alert("Terjadi kesalahan server");
        } finally {
            setLoading(false);
        }
    }

    // ======================================================
    // FIRST LOAD
    // ======================================================
    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B1120] text-white p-6">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <HiOutlineClipboardList className="text-violet-400" />
                        Kelola Laporan
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Kelola seluruh laporan pengaduan masyarakat secara berkala.
                    </p>
                </div>

                <button
                    onClick={fetchComplaints}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-98 transition font-semibold text-sm shadow-lg shadow-violet-600/10"
                >
                    <HiOutlineRefresh className="w-5 h-5" />
                    Refresh Data
                </button>
            </div>

            {/* TABLE CONTAINER */}
            <Table
                data={complaints}
                loading={loading}
                onUpdateStatus={(item) => {
                    setSelectedComplaint(item);
                    setOpenModal(true);
                }}
                onRefresh={fetchComplaints}
            />

            {/* MODAL */}
            {openModal && selectedComplaint && (
                <StatusModal
                    complaint={selectedComplaint}
                    onClose={() => {
                        setOpenModal(false);
                        setSelectedComplaint(null);
                    }}
                    refreshComplaints={fetchComplaints}
                />
            )}
        </div>
    );
}