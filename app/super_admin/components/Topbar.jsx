// components/Topbar.jsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAktivitas } from '../dashboard/data';

export default function Topbar({ 
  title = "Statistik", 
  subtitle = "Analisis Laporan Pengaduan",
  adminName = "Super Administrator",
  adminRole = "Super Admin",
}) {
  const router = useRouter();
  const initial = adminName.charAt(0);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const fetchActivities = async () => {
    try {
      const data = await getAktivitas();
      const notifData = data.map((item, idx) => ({
        id: idx,
        text: item.aksi || 'Aktivitas sistem',
        time: item.waktu || 'Baru saja',
        read: false,
      }));
      setNotifications(notifData.slice(0, 5));
    } catch (error) {
      console.error('Gagal ambil notifikasi:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/landing/login'); // ✅ Perbaikan: 'landing' bukan 'landung'
  };

  const handleProfile = () => {
    router.push('/super_admin/profile');
  };

  const handleDeleteNotif = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="topbar-custom">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>

      <div className="topbar-right">
        {/* NOTIFICATION */}
        <div className="notif-wrapper" ref={notifRef}>
          <button className="notif-button" onClick={() => setShowNotif(!showNotif)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="notif-badge-icon">{unreadCount}</span>}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span>Notifikasi</span>
                <button className="mark-read" onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}>
                  Tandai semua dibaca
                </button>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">Tidak ada aktivitas terbaru</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`notif-item ${!notif.read ? 'unread' : ''}`}>
                      <div className="notif-content">
                        <div className="notif-text">{notif.text}</div>
                        <div className="notif-time">{notif.time}</div>
                      </div>
                      <button className="notif-delete" onClick={(e) => handleDeleteNotif(notif.id, e)} aria-label="Hapus">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE - wrapper dengan ref agar dropdown tetap terbuka saat diklik */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div className="admin-info" onClick={() => setShowProfile(!showProfile)}>
            <div className="admin-avatar">{initial}</div>
            <div className="admin-text">
              <div className="admin-name">{adminName}</div>
              <div className="admin-role">{adminRole}</div>
            </div>
          </div>

          {showProfile && (
            <div className="profile-dropdown">
              <button onClick={handleProfile} className="profile-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </button>
              <button onClick={handleLogout} className="profile-item logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .topbar-custom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
          position: relative;
        }
        .topbar-left h1 {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }
        .topbar-left p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(4px);
          padding: 8px 18px;
          border-radius: 60px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }
        .notif-wrapper {
          position: relative;
        }
        .notif-button {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          transition: all 0.2s;
          position: relative;
        }
        .notif-button:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .notif-badge-icon {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .notif-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 340px;
          background: #0f0f1a;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 0 20px 35px -8px rgba(0,0,0,0.8);
          z-index: 200;
          overflow: hidden;
        }
        .notif-header {
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          font-weight: 600;
          font-size: 14px;
          color: #e2e8f0;
          background: #0a0a12;
        }
        .mark-read {
          background: none;
          border: none;
          color: #818cf8;
          font-size: 12px;
          cursor: pointer;
        }
        .notif-list {
          max-height: 300px;
          overflow-y: auto;
          background: #0f0f1a;
        }
        .notif-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s;
        }
        .notif-item:hover {
          background: #1a1a2e;
        }
        .notif-item.unread {
          background: rgba(99,102,241,0.15);
        }
        .notif-content {
          flex: 1;
          cursor: pointer;
        }
        .notif-text {
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          margin-bottom: 4px;
        }
        .notif-time {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
        }
        .notif-delete {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          margin-left: 8px;
          flex-shrink: 0;
        }
        .notif-delete:hover {
          background: rgba(239,68,68,0.2);
          color: #ef4444;
        }
        .notif-empty {
          padding: 30px;
          text-align: center;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
        }
        .admin-info {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .admin-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: white;
          box-shadow: 0 0 0 2px rgba(99,102,241,0.3);
        }
        .admin-text {
          text-align: right;
        }
        .admin-name {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .admin-role {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
        }
        .profile-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          width: 180px;
          z-index: 200;
          overflow: hidden;
        }
        .profile-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.8);
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
          text-align: left;
        }
        .profile-item:hover {
          background: #1a1a2e;
          color: white;
        }
        .logout {
          border-top: 1px solid rgba(255,255,255,0.12);
          color: #f87171;
        }
        .logout:hover {
          background: rgba(239,68,68,0.2);
          color: #ef4444;
        }
        @media (max-width: 640px) {
          .topbar-custom {
            flex-direction: column;
            align-items: flex-start;
          }
          .topbar-right {
            align-self: stretch;
            justify-content: space-between;
          }
          .notif-dropdown {
            width: 280px;
            right: -10px;
          }
          .profile-dropdown {
            right: 0;
          }
        }
      `}</style>
    </div>
  );
}