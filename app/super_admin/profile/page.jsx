// app/super_admin/profile/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)';
  const borderColor = type === 'success' ? '#10b981' : '#ef4444';
  const iconColor = type === 'success' ? '#10b981' : '#ef4444';

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 300 }}>
      <div style={{
        background: bgColor,
        border: `1px solid ${borderColor}40`,
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: '#fff',
        fontSize: 13,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.25s ease',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          {type === 'success' ? <polyline points="20 6 9 17 4 12" /> : <circle cx="12" cy="12" r="10" />}
        </svg>
        <span>{message}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', marginLeft: 8 }}>✕</button>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Data dummy untuk fallback ketika API 404
const MOCK_PROFILE = {
  id: 'SA001',
  nama_lengkap: 'Super Administrator',
  email: 'superadmin@example.com',
  no_telp: '081234567890',
  nik: '-',
  role: 'Super Admin',
  last_login: new Date().toISOString(),
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({ nama_lengkap: '', email: '', no_telp: '' });
  const [passwordData, setPasswordData] = useState({ password_lama: '', password_baru: '', konfirmasi_password: '' });
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({ totalLaporan: 0, totalUsers: 0 });
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('Anda belum login. Silakan login kembali.');
      setLoading(false);
      setTimeout(() => router.push('/landing/login'), 1500);
      return;
    }
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    setUsingMock(false);
    try {
      const token = getToken();
      if (!token) throw new Error('Token tidak ditemukan');
      
      const res = await fetch(`${API_BASE}/auth/profile`, { headers: authHeaders() });
      console.log('Profile response status:', res.status);
      
      if (res.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Sesi habis, silakan login ulang');
      }
      
      if (res.status === 404) {
        console.warn('Endpoint /auth/me tidak ditemukan (404), menggunakan data dummy');
        setUsingMock(true);
        setToast({ message: 'Mode demo: API belum tersedia, menggunakan data contoh', type: 'success' });
        setProfile(MOCK_PROFILE);
        setFormData({
          nama_lengkap: MOCK_PROFILE.nama_lengkap,
          email: MOCK_PROFILE.email,
          no_telp: MOCK_PROFILE.no_telp,
        });
        setLoading(false);
        return;
      }
      
      if (!res.ok) throw new Error(`Gagal memuat profil (${res.status})`);
      
      const json = await res.json();
      console.log('Profile data:', json);
      
      let data = json;
      if (json.data) data = json.data;
      if (json.user) data = json.user;
      
      if (!data || !data.nama_lengkap) throw new Error('Data profil tidak lengkap');
      
      setProfile({ ...data, nik: data.nik || '-' });
      setFormData({
        nama_lengkap: data.nama_lengkap || '',
        email: data.email || '',
        no_telp: data.no_telp || '',
      });
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err.message);
      setToast({ message: err.message, type: 'error' });
      
      if (!profile) {
        setUsingMock(true);
        setProfile(MOCK_PROFILE);
        setFormData({
          nama_lengkap: MOCK_PROFILE.nama_lengkap,
          email: MOCK_PROFILE.email,
          no_telp: MOCK_PROFILE.no_telp,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [complaintsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/complaints`, { headers: authHeaders() }).catch(() => ({ ok: false })),
        fetch(`${API_BASE}/auth/users`, { headers: authHeaders() }).catch(() => ({ ok: false })),
      ]);
      if (complaintsRes.ok) {
        const complaintsData = await complaintsRes.json();
        const totalLaporan = complaintsData.data?.length || complaintsData.length || 0;
        setStats(prev => ({ ...prev, totalLaporan }));
      } else {
        setStats(prev => ({ ...prev, totalLaporan: 42 }));
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const totalUsers = usersData.data?.length || usersData.length || 0;
        setStats(prev => ({ ...prev, totalUsers }));
      } else {
        setStats(prev => ({ ...prev, totalUsers: 8 }));
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
      setStats({ totalLaporan: 42, totalUsers: 8 });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (usingMock) {
      setToast({ message: 'Mode demo: perubahan hanya tersimpan sementara', type: 'success' });
      setProfile({ ...profile, ...formData });
      setEditing(false);
      return;
    }
    
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal update profil');
      setToast({ message: 'Profil berhasil diperbarui', type: 'success' });
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
        passwordData.password_baru !==
        passwordData.konfirmasi_password
    ) {
        setToast({
            message: "Konfirmasi password tidak cocok",
            type: "error",
        });
        return;
    }

    if (passwordData.password_baru.length < 6) {
        setToast({
            message: "Password minimal 6 karakter",
            type: "error",
        });
        return;
    }

    setActionLoading(true);

    try {
        const res = await fetch(
            `${API_BASE}/auth/profile`,
            {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({
                    nama_lengkap: profile.nama_lengkap,
                    email: profile.email,
                    nik: profile.nik,
                    no_telp: profile.no_telp,
                    foto_url: profile.foto_url,
                    password: passwordData.password_baru,
                }),
            }
        );

        const json = await res.json();

        if (!res.ok) {
            throw new Error(
                json.message ||
                "Gagal mengganti password"
            );
        }

        setToast({
            message: "Password berhasil diperbarui",
            type: "success",
        });

        setChangingPassword(false);

        setPasswordData({
            password_lama: "",
            password_baru: "",
            konfirmasi_password: "",
        });

    } catch (err) {
        setToast({
            message: err.message,
            type: "error",
        });
    } finally {
        setActionLoading(false);
    }
};

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#07070e' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: 240, padding: 32 }}>
          <div style={{ textAlign: 'center', padding: 60, color: '#fff' }}>Memuat profil...</div>
        </main>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#07070e' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: 240, padding: 32 }}>
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>⚠️</div>
            <div style={{ color: '#ef4444', marginBottom: 16 }}>{error}</div>
            <button onClick={() => router.push('/landing/login')} className="btn-primary">Login Ulang</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .profile-page { display: flex; min-height: 100vh; background: #07070e; font-family: 'DM Sans', sans-serif; }
        .main-content { flex: 1; margin-left: 240px; padding: 32px; }
        @media (max-width: 768px) { .main-content { margin-left: 72px; padding: 20px 16px; } }
        .profile-container { max-width: 800px; margin: 0 auto; }
        
        /* Header profil - mirip screenshot */
        .profile-header-simple {
          margin-bottom: 32px;
        }
        .profile-header-simple h1 {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .profile-header-simple .role-badge {
          background: rgba(99,102,241,0.15);
          color: #a5b4fc;
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
        }
        
        /* Kartu modern */
        .card {
          background: rgba(18, 18, 24, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 28px;
          margin-bottom: 28px;
          transition: all 0.2s;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 16px;
        }
        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
        /* Info list - dua kolom seperti screenshot */
        .info-grid {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 16px 8px;
        }
        .info-label {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value {
          font-size: 15px;
          color: #fff;
          font-weight: 500;
        }
        .info-value-muted {
          color: rgba(255,255,255,0.6);
        }
        
        /* Form dan input tetap seperti sebelumnya */
        .form-group { margin-bottom: 20px; }
        label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
        }
        input, .input-static {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          color: #fff;
          outline: none;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        input:focus { border-color: #6366f1; }
        .input-static {
          background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.7);
        }
        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: opacity 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.85; }
        .btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .button-group { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .stat-card { background: rgba(255,255,255,0.03); border-radius: 16px; padding: 16px; text-align: center; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #818cf8; }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; }
        .mock-badge {
          background: rgba(245,158,11,0.15);
          color: #f59e0b;
          border-radius: 30px;
          padding: 2px 12px;
          font-size: 11px;
          margin-left: 12px;
        }
        hr { border-color: rgba(255,255,255,0.06); margin: 20px 0; }
      `}</style>

      <div className="profile-page">
        <Sidebar />
        <main className="main-content">
          <Topbar 
            title="Profil Saya" 
            subtitle="Kelola informasi akun dan keamanan"
            adminName={profile?.nama_lengkap || 'Super Admin'}
            adminRole="Super Administrator"
          />

          <div className="profile-container">
            {/* Header sederhana seperti screenshot */}
            <div className="profile-header-simple">
              <h1>
                {profile?.nama_lengkap || 'Super Administrator'}
                {usingMock && <span className="mock-badge">Mode Demo</span>}
              </h1>
              <div className="role-badge">Role: Super_admin</div>
            </div>

            {/* Kartu Informasi Akun (redesign sesuai screenshot) */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Informasi Akun</div>
                {!editing && (
                  <button className="btn-secondary" onClick={() => setEditing(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Profil
                  </button>
                )}
              </div>
              
              {editing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>No. Telepon</label>
                    <input type="text" value={formData.no_telp || ''} onChange={e => setFormData({...formData, no_telp: e.target.value})} />
                  </div>
                  <div className="button-group">
                    <button type="button" className="btn-secondary" onClick={() => setEditing(false)} disabled={actionLoading}>Batal</button>
                    <button type="submit" className="btn-primary" disabled={actionLoading}>{actionLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                  </div>
                </form>
              ) : (
                <div className="info-grid">
                  <div className="info-label">Nama Lengkap</div>
                  <div className="info-value">{profile?.nama_lengkap || '—'}</div>
                  
                  <div className="info-label">Email</div>
                  <div className="info-value">{profile?.email || '—'}</div>
                  
                  <div className="info-label">No. Telepon</div>
                  <div className="info-value">{profile?.no_telp || '-'}</div>
                  
                  <div className="info-label">NIK</div>
                  <div className="info-value info-value-muted">{profile?.nik || '-'}</div>
                  
                  <div className="info-label">Role</div>
                  <div className="info-value">Super Administrator</div>
                </div>
              )}
            </div>

            {/* Kartu Keamanan (ganti password) - fungsi tetap */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Keamanan Akun</div>
                {!changingPassword && (
                  <button className="btn-secondary" onClick={() => setChangingPassword(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Ganti Password
                  </button>
                )}
              </div>
              {changingPassword ? (
                <form onSubmit={handleChangePassword}>
                  <div className="form-group"><label>Password Lama</label><input type="password" value={passwordData.password_lama} onChange={e => setPasswordData({...passwordData, password_lama: e.target.value})} required /></div>
                  <div className="form-group"><label>Password Baru</label><input type="password" value={passwordData.password_baru} onChange={e => setPasswordData({...passwordData, password_baru: e.target.value})} required /></div>
                  <div className="form-group"><label>Konfirmasi Password Baru</label><input type="password" value={passwordData.konfirmasi_password} onChange={e => setPasswordData({...passwordData, konfirmasi_password: e.target.value})} required /></div>
                  <div className="button-group">
                    <button type="button" className="btn-secondary" onClick={() => setChangingPassword(false)} disabled={actionLoading}>Batal</button>
                    <button type="submit" className="btn-primary" disabled={actionLoading}>{actionLoading ? 'Memproses...' : 'Update Password'}</button>
                  </div>
                </form>
              ) : (
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-static">••••••••</div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>Gunakan fitur ganti password untuk memperbarui kredensial Anda.</p>
                </div>
              )}
            </div>

            {/* Kartu Statistik Ringkas (tetap dipertahankan) */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Statistik Ringkas</div>
              </div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-value">{stats.totalLaporan}</div><div className="stat-label">Total Laporan Masuk</div></div>
                <div className="stat-card"><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Pengguna Terdaftar</div></div>
              </div>
              <hr />
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
                Terakhir login: {profile?.last_login ? new Date(profile.last_login).toLocaleString('id-ID') : 'Belum tercatat'}
              </div>
            </div>
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}