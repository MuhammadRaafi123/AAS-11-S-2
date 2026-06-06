// dashboard/AktivitasTerbaru.jsx
'use client';
import React from 'react';
import { warnaTitik } from './data';

export default function AktivitasTerbaru({ dataAktivitas }) {
  const aktivitasFinal = Array.isArray(dataAktivitas) ? dataAktivitas : [];

  return (
    <div className="kartu" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="kepala-kartu">
        <span className="judul-kartu">Aktivitas Terkini</span>
      </div>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>
        Log aktivitas sistem dan penanganan laporan terbaru.
      </p>

      {/* Container scroll */}
      <div className="daftar-aktivitas" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
        {aktivitasFinal.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '20px' }}>
            Belum ada aktivitas
          </div>
        ) : (
          aktivitasFinal.map((item, idx) => {
            const bgColor = warnaTitik[item.tipe] || '#6366f1';
            return (
              <div key={idx} className="item-aktivitas">
                <div className="titik-aktivitas" style={{ backgroundColor: bgColor }} />
                <div className="isi-aktivitas">
                  <div className="aksi-aktivitas">{item.aksi || 'Aktivitas tanpa deskripsi'}</div>
                  {item.pengguna && <div className="meta-aktivitas">Oleh: {item.pengguna}</div>}
                  <div className="meta-aktivitas">{item.waktu || 'Baru saja'}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}