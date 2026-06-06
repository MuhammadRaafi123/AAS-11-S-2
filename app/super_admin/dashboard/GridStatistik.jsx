'use client'; 
import React, { useState, useEffect } from 'react';
import { getStats } from './data';

export default function GridStatistik() {
  const [dataStats, setDataStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk menarik data dari backend
  const loadData = async () => {
    try {
      const result = await getStats('admin'); 
      // HAPUS pengecekan result.length > 0 agar array kosong pun tetap masuk ke state
      if (result) {
        setDataStats(result);
      }
    } catch (error) {
      console.error("Gagal sinkronisasi statistik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadData(); // Load pertama kali saat komponen masuk
    });

    // Polling setiap 10 detik untuk sinkronisasi real-time
    const interval = setInterval(loadData, 10000);
    
    // Membersihkan interval saat komponen dilepas (unmount)
    return () => clearInterval(interval);
  }, []);

  // TAMPILAN LOADING
  if (loading) {
    return (
      <div className="grid-statistik animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="kartu-statistik min-h-[140px] bg-gray-800/20 border border-gray-800 rounded-xl p-4">
            <div className="w-10 h-10 bg-gray-700 rounded-lg mb-3"></div>
            <div className="w-16 h-7 bg-gray-700 rounded mb-2"></div>
            <div className="w-24 h-4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // TAMPILAN JIKA DATA KOSONG
  if (dataStats.length === 0) {
    return (
      <div className="text-red-400 text-sm p-4 border border-red-500/20 bg-red-500/5 rounded-lg italic">
        ⚠️ Data statistik belum tersedia.
      </div>
    );
  }

  return (
    <div className="grid-statistik">
      {dataStats.map((s, i) => (
        <div 
          key={i} 
          className="kartu-statistik" 
          style={{ '--warna-utama': s.color, '--warna-bg': s.bg }}
        >
          <div className="ikon-statistik">{s.icon}</div>
          <div className="nilai-statistik">{s.value}</div>
          <div className="label-statistik">{s.label}</div>
          
          <span className={`perubahan-statistik ${s.up ? 'naik' : 'turun'}`}>
            {s.change.includes('%') && (s.up ? '▲ ' : '▼ ')}
            {s.change}
            {s.change.includes('%') ? ' dari total' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}