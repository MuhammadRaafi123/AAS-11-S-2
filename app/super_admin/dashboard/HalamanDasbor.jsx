// super_admin/dashboard/HalamanDasbor.jsx
'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar'; // <-- ganti BilahAtas
import GridStatistik from './GridStatistik';
import GrafikPertumbuhan from './GrafikPertumbuhan';
import RasioStatus from './RasioStatus';
import AktivitasTerbaru from './AktivitasTerbaru';
import TabelPengguna from './TabelPengguna';
import { getAktivitas } from './data';

export default function HalamanDasbor() {
  const [dataLaporan, setDataLaporan] = useState([]);
  const [dataAktivitas, setDataAktivitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function ambilDataLaporan() {
      try {
        const res = await fetch('http://localhost:5000/api/complaints', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const json = await res.json();
        setDataLaporan(Array.isArray(json) ? json : json.data || []);
      } catch (error) {
        console.error('Gagal mengambil laporan:', error);
      } finally {
        setLoading(false);
      }
    }

    async function ambilDataAktivitas() {
      const data = await getAktivitas();
      setDataAktivitas(data || []);
    }

    ambilDataLaporan();
    ambilDataAktivitas();

    const interval = setInterval(ambilDataAktivitas, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="pembungkus-halaman">
        <Sidebar />
        <main className="konten-utama">
          <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Memuat dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .pembungkus-halaman {
          display: flex;
          min-height: 100vh;
          background: #07070e;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
        }

        .konten-utama {
          margin-left: 240px;
          flex: 1;
          padding: 32px;
          transition: margin-left 0.3s ease;
        }

        @media (max-width: 768px) {
          .konten-utama {
            margin-left: 72px;
            padding: 20px 16px;
          }
        }

        .grid-statistik {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 1100px) {
          .grid-statistik {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .grid-statistik {
            grid-template-columns: 1fr;
          }
        }

        .kartu-statistik {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }
        .kartu-statistik:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .kartu-statistik::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          height: 80px;
          border-radius: 0 16px 0 80px;
          background: var(--warna-bg);
          opacity: 0.4;
        }
        .ikon-statistik {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          background: var(--warna-bg);
          color: var(--warna-utama);
        }
        .nilai-statistik {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
          line-height: 1;
          margin-bottom: 6px;
        }
        .label-statistik {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 12px;
        }

        .layout-dua-kolom {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 20px;
          margin-bottom: 24px;
          align-items: stretch;
        }
        @media (max-width: 1024px) {
          .layout-dua-kolom {
            grid-template-columns: 1fr;
          }
        }

        .kolom-kiri {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .kolom-kanan {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .kartu {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 22px;
        }

        .kepala-kartu {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .judul-kartu {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
        }
        .aksi-kartu {
          font-size: 12px;
          color: #6366f1;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-decoration: none;
        }
        .aksi-kartu:hover {
          color: #818cf8;
        }

        .grafik-batang {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 140px;
          width: 100%;
        }
        .pembungkus-batang {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          height: 100%;
          justify-content: flex-end;
          cursor: pointer;
          position: relative;
        }
        .batang {
          width: 100%;
          border-radius: 5px 5px 0 0;
          background: rgba(99, 102, 241, 0.25);
          transition: background 0.2s;
          min-height: 4px;
        }
        .batang.aktif,
        .pembungkus-batang:hover .batang {
          background: #6366f1;
        }
        .label-bulan {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.3);
          text-align: center;
          margin-top: 6px;
        }

        .progress-bg {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background-color: #6366f1;
          border-radius: 3px;
        }

        .daftar-aktivitas-scroll {
          max-height: 280px;
          overflow-y: auto;
          padding-right: 4px;
          display: flex;
          flex-direction: column;
        }
        .item-aktivitas {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .item-aktivitas:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .titik-aktivitas {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
        }
        .isi-aktivitas {
          flex: 1;
        }
        .aksi-aktivitas {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
          font-weight: 500;
        }
        .meta-aktivitas {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 2px;
        }

        .pembungkus-tabel {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.25);
          padding: 0 12px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        td {
          padding: 12px;
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }
        tr:last-child td {
          border-bottom: none;
        }
        tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }
        .sel-pengguna {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .avatar-kecil {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 11px;
          color: #fff;
          flex-shrink: 0;
        }
        .nama-pengguna {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13.5px;
        }
        .email-pengguna {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <div className="pembungkus-halaman">
        <Sidebar />
        <main className="konten-utama">
          {/* Topbar baru menggantikan BilahAtas */}
          <Topbar 
            title="Dashboard" 
            subtitle="Ringkasan dan analisis laporan pengaduan masyarakat"
            adminName="Super Administrator"
            adminRole="Super Admin"
            notifCount={5}
          />

          <GridStatistik dataLaporan={dataLaporan} />

          <div className="layout-dua-kolom">
            <div className="kolom-kiri">
              <GrafikPertumbuhan dataLaporan={dataLaporan} />
              <TabelPengguna dataLaporan={dataLaporan} />
            </div>
            <div className="kolom-kanan">
              <RasioStatus dataLaporan={dataLaporan} />
              <AktivitasTerbaru dataAktivitas={dataAktivitas} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}