'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const stats = [
  {
    label: 'Total Pengguna',
    value: '24.521',
    change: '+12,4%',
    up: true,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.12)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Sesi Aktif',
    value: '1.893',
    change: '+5,2%',
    up: true,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: 'Total Pendapatan',
    value: 'Rp 482 Jt',
    change: '+18,7%',
    up: true,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: 'Masalah Dilaporkan',
    value: '38',
    change: '-3,1%',
    up: false,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const penggunaTerbaru = [
  { nama: 'Aryo Wibisono',  email: 'aryo@mail.com',   peran: 'Editor',   status: 'aktif',    bergabung: '28 Mei 2025', avatar: 'AW' },
  { nama: 'Siti Rahayu',    email: 'siti@mail.com',    peran: 'Penonton', status: 'aktif',    bergabung: '27 Mei 2025', avatar: 'SR' },
  { nama: 'Budi Santoso',   email: 'budi@mail.com',    peran: 'Admin',    status: 'nonaktif', bergabung: '25 Mei 2025', avatar: 'BS' },
  { nama: 'Dewi Permata',   email: 'dewi@mail.com',    peran: 'Editor',   status: 'aktif',    bergabung: '24 Mei 2025', avatar: 'DP' },
  { nama: 'Rizky Maulana',  email: 'rizky@mail.com',   peran: 'Penonton', status: 'menunggu', bergabung: '23 Mei 2025', avatar: 'RM' },
];

const aktivitas = [
  { aksi: 'Pengguna baru terdaftar',      pengguna: 'Aryo Wibisono', waktu: '2 menit lalu',  tipe: 'pengguna' },
  { aksi: 'Peran diubah ke Admin',        pengguna: 'Budi Santoso',  waktu: '15 menit lalu', tipe: 'peran'    },
  { aksi: 'Pengaturan sistem diperbarui', pengguna: 'Super Admin',   waktu: '1 jam lalu',    tipe: 'sistem'   },
  { aksi: 'Laporan diekspor',             pengguna: 'Siti Rahayu',   waktu: '2 jam lalu',    tipe: 'ekspor'   },
  { aksi: 'Akun dinonaktifkan',           pengguna: 'Budi Santoso',  waktu: '3 jam lalu',    tipe: 'blokir'   },
];

const dataBar  = [42, 68, 55, 80, 63, 91, 74, 88, 60, 77, 95, 82];
const bulan    = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
const warnaBadge = {
  aktif:    { bg: 'rgba(16,185,129,0.12)',  teks: '#10b981', label: 'Aktif'    },
  nonaktif: { bg: 'rgba(239,68,68,0.10)',   teks: '#ef4444', label: 'Nonaktif' },
  menunggu: { bg: 'rgba(245,158,11,0.12)',  teks: '#f59e0b', label: 'Menunggu' },
};
const warnaAvatar  = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const warnaTitik   = { pengguna: '#10b981', peran: '#6366f1', sistem: '#f59e0b', ekspor: '#8b5cf6', blokir: '#ef4444' };

export default function HalamanDasbor() {
  const [barAktif, setBarAktif] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
          .konten-utama { margin-left: 72px; padding: 20px 16px; }
        }

        /* Bilah atas */
        .bilah-atas {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .judul-halaman {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 26px;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .subjudul-halaman {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }

        .sisi-kanan-atas {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lencana-tanggal {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 12.5px;
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tombol-notif {
          width: 38px; height: 38px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.5);
          position: relative;
          transition: all 0.2s;
        }
        .tombol-notif:hover { background: rgba(255,255,255,0.09); color: #fff; }

        .titik-notif {
          position: absolute;
          top: 8px; right: 8px;
          width: 7px; height: 7px;
          background: #ef4444;
          border-radius: 50%;
          border: 1.5px solid #07070e;
        }

        /* Grid statistik */
        .grid-statistik {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 1100px) { .grid-statistik { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .grid-statistik { grid-template-columns: 1fr; } }

        .kartu-statistik {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }
        .kartu-statistik:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.12); }
        .kartu-statistik::after {
          content: '';
          position: absolute; top: 0; right: 0;
          width: 80px; height: 80px;
          border-radius: 0 16px 0 80px;
          background: var(--warna-bg);
          opacity: 0.4;
        }

        .ikon-statistik {
          width: 42px; height: 42px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          background: var(--warna-bg);
          color: var(--warna-utama);
        }

        .nilai-statistik {
          font-family: 'Syne', sans-serif;
          font-size: 26px; font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px; line-height: 1;
          margin-bottom: 6px;
        }

        .label-statistik {
          font-size: 12.5px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 12px;
        }

        .perubahan-statistik {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 12px; font-weight: 500;
          padding: 3px 8px;
          border-radius: 20px;
        }
        .perubahan-statistik.naik { background: rgba(16,185,129,0.12); color: #10b981; }
        .perubahan-statistik.turun { background: rgba(239,68,68,0.12); color: #ef4444; }

        /* Grid bawah */
        .grid-bawah {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 1024px) { .grid-bawah { grid-template-columns: 1fr; } }

        /* Kartu dasar */
        .kartu {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 22px;
        }

        .kepala-kartu {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }

        .judul-kartu {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #fff;
        }

        .aksi-kartu {
          font-size: 12px; color: #6366f1;
          cursor: pointer; background: none; border: none;
          padding: 0; text-decoration: none;
        }
        .aksi-kartu:hover { color: #818cf8; }

        /* Grafik batang */
        .grafik-batang {
          display: flex; align-items: flex-end; gap: 8px;
          height: 140px;
        }

        .pembungkus-batang {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 6px;
          height: 100%; justify-content: flex-end;
          cursor: pointer;
        }

        .batang {
          width: 100%;
          border-radius: 5px 5px 0 0;
          background: rgba(99,102,241,0.25);
          transition: background 0.2s;
          min-height: 4px;
        }
        .batang.aktif, .pembungkus-batang:hover .batang { background: #6366f1; }

        .label-bulan {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          text-align: center;
        }

        /* Tabel */
        .pembungkus-tabel { overflow-x: auto; }

        table { width: 100%; border-collapse: collapse; }

        th {
          text-align: left;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 0 12px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        td {
          padding: 12px;
          font-size: 13.5px;
          color: rgba(255,255,255,0.7);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }

        .sel-pengguna { display: flex; align-items: center; gap: 10px; }

        .avatar-kecil {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 11px;
          color: #fff; flex-shrink: 0;
        }

        .nama-pengguna  { font-weight: 500; color: rgba(255,255,255,0.85); font-size: 13.5px; }
        .email-pengguna { font-size: 12px; color: rgba(255,255,255,0.3); }

        /* Umpan aktivitas */
        .daftar-aktivitas { display: flex; flex-direction: column; }

        .item-aktivitas {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .item-aktivitas:last-child { border-bottom: none; }

        .titik-aktivitas {
          width: 8px; height: 8px;
          border-radius: 50%; flex-shrink: 0;
          margin-top: 5px;
        }

        .isi-aktivitas { flex: 1; }
        .aksi-aktivitas { font-size: 13px; color: rgba(255,255,255,0.75); font-weight: 500; }
        .meta-aktivitas { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 2px; }

        /* Baris ringkasan */
        .baris-ringkasan {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) { .baris-ringkasan { grid-template-columns: 1fr; } }

        .kartu-ringkasan {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 18px;
          display: flex; align-items: center; gap: 14px;
        }

        .ikon-ringkasan {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .nilai-ringkasan {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 700; color: #fff;
        }
        .label-ringkasan { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }
      `}</style>

      <div className="pembungkus-halaman">
        <Sidebar />

        <main className="konten-utama">
          {/* Bilah atas */}
          <div className="bilah-atas">
            <div>
              <div className="judul-halaman">Dasbor</div>
              <div className="subjudul-halaman">Selamat datang kembali, Super Admin 👋</div>
            </div>
            <div className="sisi-kanan-atas">
              <div className="lencana-tanggal">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                30 Mei 2026
              </div>
              <div className="tombol-notif">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="titik-notif" />
              </div>
            </div>
          </div>

          {/* Grid statistik */}
          <div className="grid-statistik">
            {stats.map((s, i) => (
              <div key={i} className="kartu-statistik" style={{ '--warna-utama': s.color, '--warna-bg': s.bg }}>
                <div className="ikon-statistik">{s.icon}</div>
                <div className="nilai-statistik">{s.value}</div>
                <div className="label-statistik">{s.label}</div>
                <span className={`perubahan-statistik ${s.up ? 'naik' : 'turun'}`}>
                  {s.up ? '▲' : '▼'} {s.change} vs bulan lalu
                </span>
              </div>
            ))}
          </div>

          {/* Grafik + Aktivitas */}
          <div className="grid-bawah">
            <div className="kartu">
              <div className="kepala-kartu">
                <span className="judul-kartu">Pertumbuhan Pengguna</span>
                <a href="#" className="aksi-kartu">Lihat detail →</a>
              </div>
              <div className="grafik-batang">
                {dataBar.map((val, i) => (
                  <div
                    key={i}
                    className="pembungkus-batang"
                    onMouseEnter={() => setBarAktif(i)}
                    onMouseLeave={() => setBarAktif(null)}
                  >
                    <div className={`batang ${barAktif === i ? 'aktif' : ''}`} style={{ height: `${val}%` }} />
                    <span className="label-bulan">{bulan[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kartu">
              <div className="kepala-kartu">
                <span className="judul-kartu">Aktivitas Terbaru</span>
                <a href="#" className="aksi-kartu">Semua</a>
              </div>
              <div className="daftar-aktivitas">
                {aktivitas.map((a, i) => (
                  <div key={i} className="item-aktivitas">
                    <div className="titik-aktivitas" style={{ background: warnaTitik[a.tipe] }} />
                    <div className="isi-aktivitas">
                      <div className="aksi-aktivitas">{a.aksi}</div>
                      <div className="meta-aktivitas">{a.pengguna} · {a.waktu}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabel pengguna terbaru */}
          <div className="kartu" style={{ marginBottom: '24px' }}>
            <div className="kepala-kartu">
              <span className="judul-kartu">Pengguna Terbaru</span>
              <a href="/super_admin/management-user" className="aksi-kartu">Lihat semua →</a>
            </div>
            <div className="pembungkus-tabel">
              <table>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Peran</th>
                    <th>Status</th>
                    <th>Bergabung</th>
                  </tr>
                </thead>
                <tbody>
                  {penggunaTerbaru.map((u, i) => {
                    const badge = warnaBadge[u.status];
                    return (
                      <tr key={i}>
                        <td>
                          <div className="sel-pengguna">
                            <div className="avatar-kecil" style={{ background: warnaAvatar[i % warnaAvatar.length] }}>{u.avatar}</div>
                            <div>
                              <div className="nama-pengguna">{u.nama}</div>
                              <div className="email-pengguna">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{u.peran}</td>
                        <td>
                          <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:500, background: badge.bg, color: badge.teks }}>
                            {badge.label}
                          </span>
                        </td>
                        <td>{u.bergabung}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Baris ringkasan */}
          <div className="baris-ringkasan">
            <div className="kartu-ringkasan">
              <div className="ikon-ringkasan" style={{ background: 'rgba(99,102,241,0.12)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              </div>
              <div>
                <div className="nilai-ringkasan">99,8%</div>
                <div className="label-ringkasan">Waktu Aktif Server</div>
              </div>
            </div>
            <div className="kartu-ringkasan">
              <div className="ikon-ringkasan" style={{ background: 'rgba(16,185,129,0.12)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <div className="nilai-ringkasan">1.204</div>
                <div className="label-ringkasan">Transaksi Hari Ini</div>
              </div>
            </div>
            <div className="kartu-ringkasan">
              <div className="ikon-ringkasan" style={{ background: 'rgba(245,158,11,0.12)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <div>
                <div className="nilai-ringkasan">7</div>
                <div className="label-ringkasan">Tiket Dukungan Aktif</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}