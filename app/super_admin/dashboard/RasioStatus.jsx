// dashboard/RasioStatus.jsx
'use client';
import React from 'react';

export default function RasioStatus({ dataLaporan }) {
  const statusMap = {
    'Menunggu Verifikasi': 0,
    'Sedang Diproses': 0,
    'Selesai': 0,
    'Ditolak': 0
  };

  const laporanFinal = Array.isArray(dataLaporan) ? dataLaporan : [];
  laporanFinal.forEach((laporan) => {
    const status = laporan.status?.toLowerCase() || '';
    if (status.includes('menunggu')) statusMap['Menunggu Verifikasi']++;
    else if (status.includes('proses')) statusMap['Sedang Diproses']++;
    else if (status === 'selesai') statusMap['Selesai']++;
    else if (status === 'ditolak') statusMap['Ditolak']++;
  });

  const total = Object.values(statusMap).reduce((a, b) => a + b, 0);
  const getPersen = (jml) => (total === 0 ? 0 : ((jml / total) * 100).toFixed(1));

  return (
    <div className="kartu" style={{ marginBottom: '20px' }}>
      <div className="kepala-kartu">
        <span className="judul-kartu">Rasio Status Penyelesaian</span>
      </div>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
        Persentase pembagian status tindak lanjut dari seluruh laporan masuk.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(statusMap).map(([label, jumlah]) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>{label} ({jumlah})</span>
              <span style={{ fontWeight: 600, color: '#a5b4fc' }}>{getPersen(jumlah)}%</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${getPersen(jumlah)}%`, height: '100%', backgroundColor: '#6366f1', borderRadius: '3px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}