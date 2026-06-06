// dashboard/GrafikPertumbuhan.jsx
'use client';
import React, { useState } from 'react';
import { bulan } from './data';

export default function GrafikPertumbuhan({ dataLaporan }) {
  const [barAktif, setBarAktif] = useState(null);
  const hitunganPerBulan = Array(12).fill(0);
  const tahunIni = new Date().getFullYear();
  const laporanFinal = Array.isArray(dataLaporan) ? dataLaporan : [];

  laporanFinal.forEach((laporan) => {
    if (laporan.created_at) {
      const tanggal = new Date(laporan.created_at);
      if (tanggal.getUTCFullYear() === tahunIni) {
        const indeksBulan = tanggal.getUTCMonth();
        if (indeksBulan >= 0 && indeksBulan <= 11) {
          hitunganPerBulan[indeksBulan] += 1;
        }
      }
    }
  });

  const angkaTertinggi = Math.max(...hitunganPerBulan, 1);

  return (
    <div className="kartu" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="kepala-kartu">
        <span className="judul-kartu">Tren Laporan Masuk Bulanan</span>
      </div>

      {/* Container grafik dengan tinggi tetap dan rapi */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
        <div className="grafik-batang" style={{ width: '100%' }}>
          {hitunganPerBulan.map((val, i) => {
            const tinggiBatang = Math.max((val / angkaTertinggi) * 100, 5);
            const isActive = barAktif === i;

            return (
              <div
                key={i}
                className="pembungkus-batang"
                onMouseEnter={() => setBarAktif(i)}
                onMouseLeave={() => setBarAktif(null)}
              >
                {isActive && (
                  <div className="tooltip-batang">
                    {val} Laporan
                  </div>
                )}
                <div
                  className={`batang ${isActive ? 'aktif' : ''}`}
                  style={{ height: `${tinggiBatang}%` }}
                />
                <span className="label-bulan">{bulan[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .tooltip-batang {
          position: absolute;
          bottom: 100%;
          margin-bottom: 8px;
          background: #1e293b;
          color: white;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          white-space: nowrap;
          z-index: 10;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}