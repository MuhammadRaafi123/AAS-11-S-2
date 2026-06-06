'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar'; // <-- import Topbar

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetcher(endpoint) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (!res.ok) {
      console.error(`[API ERROR] ${endpoint} returned status ${res.status}`);
      return [];
    }
    const result = await res.json();
    if (result && typeof result === 'object') {
      return result.data || result.complaints || result.users || result.activities || result;
    }
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error(`⚠️ Gagal fetch ${endpoint}:`, error.message);
    return [];
  }
}

export default function StatisticPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [animateBars, setAnimateBars] = useState(false);
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

  useEffect(() => {
    async function loadData() {
      try {
        const listLaporan = await fetcher('/complaints');
        const total = listLaporan.length;
        const menunggu = listLaporan.filter(l => l.status?.toLowerCase() === 'menunggu_verifikasi').length;
        const diverifikasi = listLaporan.filter(l => l.status?.toLowerCase() === 'diverifikasi').length;
        const diproses = listLaporan.filter(l => l.status?.toLowerCase() === 'diproses').length;
        const selesai = listLaporan.filter(l => l.status?.toLowerCase() === 'selesai').length;
        const ditolak = listLaporan.filter(l => l.status?.toLowerCase() === 'ditolak').length;

        let statData = [
          { label: 'Total Laporan', value: total, icon: '📋', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
          { label: 'Menunggu Verifikasi', value: menunggu, icon: '⏳', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
          { label: 'Diverifikasi', value: diverifikasi, icon: '🔍', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
          { label: 'Diproses', value: diproses, icon: '⚙️', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
          { label: 'Selesai', value: selesai, icon: '✅', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
          { label: 'Ditolak', value: ditolak, icon: '❌', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
        ];

        statData = statData.map(item => {
          if (item.label === 'Total Laporan') {
            return { ...item, change: 'Real-time' };
          }
          const percent = total > 0 ? (item.value / total) * 100 : 0;
          return { ...item, change: `${percent.toFixed(1)}%` };
        });

        statData.sort((a, b) => b.value - a.value);
        setStats(statData);

        const tahunSekarang = new Date().getFullYear();
        setCurrentYear(tahunSekarang);
        const monthly = Array(12).fill(0);
        listLaporan.forEach(l => {
          if (l.created_at) {
            const date = new Date(l.created_at);
            if (!isNaN(date.getTime()) && date.getFullYear() === tahunSekarang) {
              monthly[date.getMonth()]++;
            }
          }
        });
        setMonthlyData(monthly);
        setTimeout(() => setAnimateBars(true), 200);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const maxBarValue = Math.max(...monthlyData, 1);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Syne:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0a0a0f;
        }

        .stat-page {
          font-family: 'Inter', sans-serif;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          position: relative;
          background: linear-gradient(135deg, rgba(30, 30, 60, 0.85), rgba(20, 20, 45, 0.9));
          backdrop-filter: blur(8px);
          border-radius: 28px;
          padding: 24px 22px;
          transition: all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          border: 1px solid rgba(99, 102, 241, 0.4);
          box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.1) inset;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #a78bfa, #6366f1);
          opacity: 0.7;
        }

        .stat-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #a78bfa, transparent);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 20px 30px -12px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(167, 139, 250, 0.3) inset;
        }

        .stat-icon {
          font-size: 40px;
          margin-bottom: 16px;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
          transition: transform 0.2s;
        }
        .stat-card:hover .stat-icon {
          transform: scale(1.02) translateY(-2px);
        }

        .stat-value {
          font-size: 38px;
          font-weight: 800;
          font-family: 'Syne', sans-serif;
          letter-spacing: -1px;
          line-height: 1.1;
          background: linear-gradient(135deg, #fff, #c7d2fe);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          display: inline-block;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .stat-change {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-left: 10px;
          padding: 3px 10px;
          border-radius: 40px;
          background: rgba(99, 102, 241, 0.25);
          backdrop-filter: blur(4px);
          color: #c7d2fe;
          border: 0.5px solid rgba(167, 139, 250, 0.4);
        }

        .stat-label {
          margin-top: 14px;
          color: #cbd5e1;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.2px;
          opacity: 0.9;
        }

        .section-card {
          background: rgba(18, 18, 24, 0.7);
          backdrop-filter: blur(8px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 24px;
          margin-top: 28px;
          transition: all 0.2s;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #e5e7eb;
        }

        .year-badge {
          display: inline-block;
          margin-left: 8px;
          font-size: 12px;
          background: rgba(99,102,241,0.2);
          padding: 2px 10px;
          border-radius: 30px;
          font-weight: 500;
          color: #a78bfa;
        }

        .progress-item { 
          margin-bottom: 20px; 
        }
        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 500;
        }
        .progress-bar-bg {
          background: rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
          height: 6px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 20px;
          transition: width 0.6s ease;
        }

        .bar-chart-container {
          margin-top: 16px;
        }
        .bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          justify-content: space-between;
          min-height: 220px;
          padding-bottom: 16px;
        }
        .bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .bar-wrapper:hover {
          transform: translateY(-3px);
        }
        .bar {
          width: 100%;
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          border-radius: 12px 12px 6px 6px;
          transition: height 0.5s cubic-bezier(0.22, 0.97, 0.36, 1.02);
          box-shadow: 0 0 8px rgba(99,102,241,0.4);
          position: relative;
        }
        .bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0));
          border-radius: 12px 12px 6px 6px;
        }
        .bar-wrapper:hover .bar {
          background: linear-gradient(180deg, #818cf8, #a78bfa);
          box-shadow: 0 0 14px rgba(99,102,241,0.6);
        }
        .bar-value {
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #c7d2fe;
          background: rgba(0,0,0,0.5);
          padding: 2px 8px;
          border-radius: 20px;
          transition: all 0.2s;
        }
        .bar-wrapper:hover .bar-value {
          background: #6366f1;
          color: white;
          transform: scale(1.03);
        }
        .bar-label {
          text-align: center;
          font-size: 11px;
          font-weight: 500;
          color: #9ca3af;
          margin-top: 8px;
        }
        .loading-skeleton {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
        }
        .page-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 20px;
        }
      `}</style>

      <div className="stat-page" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0f' }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            marginLeft: 'var(--sidebar-width, 240px)',
            padding: '32px 40px',
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* TOPBAR */}
          <Topbar 
            title="Statistik" 
            subtitle="Analisis Laporan Pengaduan"
            adminName="Super Administrator"
            adminRole="Super Admin"
            notifCount={10}
          />

          <div className="stats-grid">
            {stats.map((item, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-icon">{item.icon}</div>
                <div>
                  <span className="stat-value">{item.value}</span>
                  {item.change && <span className="stat-change">{item.change}</span>}
                </div>
                <p className="stat-label">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="section-card">
            <div className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 12 L7 12 L7 20 L4 20 L4 12 Z" />
                <path d="M9 8 L14 8 L14 20 L11 20 L11 8 Z" />
                <path d="M16 4 L21 4 L21 20 L18 20 L18 4 Z" />
              </svg>
              Distribusi Status Pengaduan
            </div>
            {loading ? (
              <div className="loading-skeleton">Memuat data...</div>
            ) : (
              stats.filter(s => s.label !== 'Total Laporan').map((item) => {
                const total = stats.find(s => s.label === 'Total Laporan')?.value || 1;
                const percent = (item.value / total) * 100;
                return (
                  <div key={item.label} className="progress-item">
                    <div className="progress-header">
                      <span>{item.icon} {item.label}</span>
                      <span>{item.value} ({percent.toFixed(1)}%)</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${percent}%`, 
                          background: item.gradient 
                        }} 
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="section-card">
            <div className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="4" height="16" />
                <rect x="10" y="8" width="4" height="12" />
                <rect x="17" y="2" width="4" height="18" />
              </svg>
              Statistik Bulanan (Jumlah Pengaduan)
              <span className="year-badge">{currentYear}</span>
            </div>
            {loading ? (
              <div className="loading-skeleton">Memuat data bulanan...</div>
            ) : (
              <div className="bar-chart-container">
                <div className="bar-chart">
                  {monthlyData.map((count, idx) => {
                    const heightPercent = maxBarValue > 0 ? (count / maxBarValue) * 140 : 0;
                    const barHeight = animateBars ? `${heightPercent}px` : '0px';
                    return (
                      <div key={idx} className="bar-wrapper">
                        <div className="bar-value">{count}</div>
                        <div className="bar" style={{ height: barHeight }} />
                        <div className="bar-label">{bulan[idx]}</div>
                      </div>
                    );
                  })}
                </div>
                {monthlyData.every(v => v === 0) && (
                  <div style={{ textAlign: 'center', marginTop: 16, color: '#9ca3af' }}>
                    Belum ada pengaduan pada tahun {currentYear}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="page-footer">
            📊 Data diperbarui secara real-time • Total pengaduan: <strong>{stats.find(s => s.label === 'Total Laporan')?.value || 0}</strong>
          </div>
        </main>
      </div>
    </>
  );
}