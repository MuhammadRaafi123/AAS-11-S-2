// super_admin/management-user/page.jsx
'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import Sidebar from '../components/Sidebar';

// ── Konfigurasi Role & Status ──────────────────────────
const ROLES = {
  super_admin: { label: 'Super Admin', warnaBg: 'rgba(99,102,241,.15)',  warnaTs: '#818cf8' },
  admin:       { label: 'Admin',       warnaBg: 'rgba(16,185,129,.15)',  warnaTs: '#10b981' },
  masyarakat:  { label: 'Masyarakat',  warnaBg: 'rgba(100,116,139,.15)', warnaTs: '#94a3b8' },
};

const KONFIG_STATUS = {
  aktif:    { label: 'Aktif',    warnaBg: 'rgba(16,185,129,.12)',  warnaTs: '#10b981' },
  nonaktif: { label: 'Nonaktif', warnaBg: 'rgba(100,116,139,.12)', warnaTs: '#94a3b8' },
  menunggu: { label: 'Menunggu', warnaBg: 'rgba(245,158,11,.12)',  warnaTs: '#f59e0b' },
  diblokir: { label: 'Diblokir', warnaBg: 'rgba(239,68,68,.10)',   warnaTs: '#ef4444' },
};

const AV_COLORS = ['#6366f1','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#ec4899','#64748b','#f97316','#84cc16'];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── Helpers ────────────────────────────────────────────
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

function avatarInisial(nama = '') {
  return nama.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
}

function avatarWarna(id) {
  return AV_COLORS[(id || 0) % AV_COLORS.length];
}

function formatTanggal(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Komponen kecil ─────────────────────────────────────
function LencanaRole({ role }) {
  const k = ROLES[role] || ROLES.masyarakat;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, background:k.warnaBg, color:k.warnaTs }}>
      {k.label}
    </span>
  );
}

function LencanaStatus({ status }) {
  const k = KONFIG_STATUS[status] || KONFIG_STATUS.aktif;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:500, background:k.warnaBg, color:k.warnaTs }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:k.warnaTs, flexShrink:0 }} />
      {k.label}
    </span>
  );
}

function Spinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:48 }}>
      <div style={{ width:28, height:28, borderRadius:'50%', border:'3px solid rgba(99,102,241,.2)', borderTopColor:'#6366f1', animation:'spin .7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Toast({ pesan, tipe, onTutup }) {
  useEffect(() => {
    const t = setTimeout(onTutup, 3000);
    return () => clearTimeout(t);
  }, [onTutup]);

  const warna = tipe === 'sukses' ? '#10b981' : '#ef4444';
  const bg    = tipe === 'sukses' ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.12)';

  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:300, background:bg, border:`1px solid ${warna}30`, borderRadius:12, padding:'12px 18px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 8px 32px rgba(0,0,0,.4)', animation:'slideUp .25s ease' }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth="2.5">
        {tipe === 'sukses'
          ? <polyline points="20 6 9 17 4 12" />
          : <Fragment><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></Fragment>
        }
      </svg>
      <span style={{ fontSize:13, color:'#fff' }}>{pesan}</span>
      <button onClick={onTutup} style={{ background:'none', border:'none', color:'rgba(255,255,255,.4)', cursor:'pointer', padding:0, marginLeft:4 }}>✕</button>
    </div>
  );
}

function Modal({ judul, onTutup, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onTutup}>
      <div style={{ background:'#10101a', border:'1px solid rgba(255,255,255,.1)', borderRadius:18, width:'100%', maxWidth:520, overflow:'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#fff' }}>{judul}</span>
          <button onClick={onTutup} style={{ width:30, height:30, borderRadius:8, border:'none', background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.5)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Form Tambah / Edit ──
function FormPengguna({ awal, opsiRole, onSimpan, onBatal, loading }) {
  const formAwal = awal || { nama_lengkap:'', email:'', password:'', nik:'', no_telp:'', role: opsiRole[0]?.value || 'masyarakat', status:'aktif' };
  const [form, setForm] = useState(formAwal);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isSuperAdmin = awal?.role === 'super_admin';
  const isEdit = !!awal;

  return (
    <div style={{ padding:22 }}>
      {!isEdit && (
        <div style={{ background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.2)', borderRadius:9, padding:'9px 12px', marginBottom:16, fontSize:12, color:'rgba(245,158,11,.9)', display:'flex', gap:8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Password akan di-hash (bcrypt) sebelum disimpan ke database.
        </div>
      )}
      {isEdit && (
        <div style={{ background:'rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.2)', borderRadius:9, padding:'9px 12px', marginBottom:16, fontSize:12, color:'#818cf8', display:'flex', gap:8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Kosongkan password jika tidak ingin mengubahnya.
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        {[
          ['nama_lengkap', 'Nama Lengkap', 'text',  'Nama lengkap'],
          ['email',        'Email',        'email', 'email@domain.com'],
        ].map(([k, lbl, tipe, ph]) => (
          <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:'.6px', textTransform:'uppercase' }}>{lbl}</label>
            <input className="input-form" type={tipe} value={form[k] || ''} placeholder={ph} onChange={e => set(k, e.target.value)} />
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        {[
          ['nik',    'NIK',         'text', '16 digit NIK'],
          ['no_telp','No. Telepon', 'text', '08xx-xxxx-xxxx'],
        ].map(([k, lbl, tipe, ph]) => (
          <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:'.6px', textTransform:'uppercase' }}>{lbl}</label>
            <input className="input-form" type={tipe} value={form[k] || ''} placeholder={ph} maxLength={k==='nik'?16:undefined} onChange={e => set(k, e.target.value)} />
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:'.6px', textTransform:'uppercase' }}>Role</label>
          <select className="input-form" value={form.role} disabled={isSuperAdmin} onChange={e => set('role', e.target.value)}>
            {opsiRole.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:'.6px', textTransform:'uppercase' }}>Status</label>
          <select className="input-form" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
            {!isSuperAdmin && <option value="menunggu">Menunggu</option>}
            {!isSuperAdmin && <option value="diblokir">Diblokir</option>}
          </select>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
        <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:'.6px', textTransform:'uppercase' }}>
          {isEdit ? 'Password Baru (Opsional)' : 'Password'}
        </label>
        <input
          className="input-form"
          type="password"
          value={form.password || ''}
          placeholder={isEdit ? 'Kosongkan jika tidak diubah' : 'Password awal'}
          onChange={e => set('password', e.target.value)}
        />
      </div>

      <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
        <button className="btn-ghost" onClick={onBatal} disabled={loading}>Batal</button>
        <button className="btn-primary" onClick={() => onSimpan(form)} disabled={loading}>
          {loading ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>
    </div>
  );
}

// ── Halaman Utama ──────────────────────────────────────
export default function HalamanKelolaUser() {
  const [tab, setTab]             = useState('masyarakat'); // 'masyarakat' | 'admin'
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [loadingAksi, setLoadingAksi] = useState(false);
  const [error, setError]         = useState(null);
  const [cari, setCari]           = useState('');
  const [filterRole, setFilterRole]     = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [dipilih, setDipilih]     = useState([]);
  const [modal, setModal]         = useState(null);
  const [target, setTarget]       = useState(null);
  const [toast, setToast]         = useState(null);

  // ── Fetch semua user dari backend ──
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/users`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`);
      const json = await res.json();
    setUsers(Array.isArray(json) ? json : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Dataset sesuai tab ──
  const dataset = users.filter(u =>
    tab === 'masyarakat' ? u.role === 'masyarakat' : ['admin', 'super_admin'].includes(u.role)
  );

  // ── Filter & cari ──
  const terfilter = dataset.filter(u => {
    const q = cari.toLowerCase();
    const cocokCari   = !q || u.nama_lengkap?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || (u.nik && u.nik.includes(q));
    const cocokRole   = filterRole   === 'semua' || u.role   === filterRole;
    const statusUser = u.status || 'aktif';
    const cocokStatus = filterStatus === 'semua' || statusUser === filterStatus;
    return cocokCari && cocokRole && cocokStatus;
  });

  // ── Opsi role per tab ──
  const opsiRole = tab === 'masyarakat'
    ? [{ value:'masyarakat', label:'Masyarakat' }]
    : [{ value:'admin', label:'Admin' }, { value:'super_admin', label:'Super Admin' }];

  const opsiFilterRole = tab === 'masyarakat'
    ? [['semua','Semua Role'],['masyarakat','Masyarakat']]
    : [['semua','Semua Role'],['admin','Admin'],['super_admin','Super Admin']];

  // ── Statistik ──
  const jmlMasyarakat = users.filter(u => u.role === 'masyarakat').length;
  const jmlAdmin      = users.filter(u => u.role === 'admin').length;
  const jmlSuperAdmin = users.filter(u => u.role === 'super_admin').length;

  // ── Pilihan ──
  const togglePilih    = id  => setDipilih(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleSemuaPilih = () => setDipilih(s => s.length === terfilter.length ? [] : terfilter.map(u => u.id));

  const gantiTab = t => {
    setTab(t); setDipilih([]); setCari('');
    setFilterRole('semua'); setFilterStatus('semua');
  };

  const tampilToast = (pesan, tipe = 'sukses') => setToast({ pesan, tipe });

  // ── Tambah user ──
  const handleTambah = async (form) => {
    if (!form.nama_lengkap || !form.email || !form.password) {
      tampilToast('Nama, email, dan password wajib diisi', 'error'); return;
    }
    setLoadingAksi(true);
    try {
      const res = await fetch(`${API_BASE}/auth/users`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          nama_lengkap: form.nama_lengkap,
          email:        form.email,
          password:     form.password,
          nik:          form.nik || null,
          no_telp:      form.no_telp || null,
          role:         form.role,
          status:       form.status || 'aktif',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menambahkan');
      tampilToast('Pengguna berhasil ditambahkan');
      setModal(null);
      fetchUsers();
    } catch (err) {
      tampilToast(err.message, 'error');
    } finally {
      setLoadingAksi(false);
    }
  };

  // ── Edit user ──
  const handleEdit = async (form) => {
    if (!form.nama_lengkap || !form.email) {
      tampilToast('Nama dan email wajib diisi', 'error'); return;
    }
    setLoadingAksi(true);
    try {
      const payload = {
        nama_lengkap: form.nama_lengkap,
        email:        form.email,
        nik:          form.nik || null,
        no_telp:      form.no_telp || null,
        role:         form.role,
        status:       form.status,
      };
      if (form.password && form.password.trim() !== '') {
        payload.password = form.password;
      }
      const res = await fetch(`${API_BASE}/auth/users/${target.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal mengubah');
      tampilToast('Data berhasil diubah');
      setModal(null);
      fetchUsers();
    } catch (err) {
      tampilToast(err.message, 'error');
    } finally {
      setLoadingAksi(false);
    }
  };

  // ── Hapus satu ──
  const handleHapus = async (id) => {
    setLoadingAksi(true);
    try {
      const res = await fetch(`${API_BASE}/auth/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menghapus');
      tampilToast('Pengguna berhasil dihapus');
      setModal(null);
      setDipilih(s => s.filter(x => x !== id));
      fetchUsers();
    } catch (err) {
      tampilToast(err.message, 'error');
    } finally {
      setLoadingAksi(false);
    }
  };

  // ── Hapus massal ──
  const handleHapusMassal = async () => {
    setLoadingAksi(true);
    try {
      await Promise.all(
        dipilih.map(id =>
          fetch(`${API_BASE}/auth/users/${id}`, { method:'DELETE', headers: authHeaders() })
        )
      );
      tampilToast(`${dipilih.length} pengguna berhasil dihapus`);
      setDipilih([]);
      setModal(null);
      fetchUsers();
    } catch (err) {
      tampilToast('Sebagian data gagal dihapus', 'error');
    } finally {
      setLoadingAksi(false);
    }
  };

  // ─────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .pembungkus { display:flex; min-height:100vh; background:#07070e; font-family:'DM Sans',sans-serif; color:#e2e8f0; }
        .konten     { margin-left:240px; flex:1; padding:32px; }
        @media(max-width:768px){ .konten{ margin-left:72px; padding:20px 16px; } }

        .bilah-atas  { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
        .judul       { font-family:'Syne',sans-serif; font-weight:800; font-size:26px; color:#fff; letter-spacing:-.5px; }
        .subjudul    { font-size:13px; color:rgba(255,255,255,.35); margin-top:2px; }

        .grid-ringkasan { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:22px; }
        @media(max-width:700px){ .grid-ringkasan{ grid-template-columns:1fr; } }
        .kartu-ringkasan { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:14px; }
        .ikon-ringkasan  { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .nilai-ringkasan { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#fff; }
        .label-ringkasan { font-size:12px; color:rgba(255,255,255,.35); margin-top:1px; }

        .baris-tab   { display:flex; margin-bottom:20px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:12px; padding:5px; width:fit-content; }
        .tombol-tab  { padding:8px 22px; border-radius:8px; font-size:13.5px; font-weight:500; color:rgba(255,255,255,.4); cursor:pointer; border:none; background:transparent; display:flex; align-items:center; gap:7px; transition:all .2s; font-family:'DM Sans',sans-serif; }
        .tombol-tab.aktif { background:rgba(99,102,241,.2); color:#818cf8; }
        .tombol-tab:hover:not(.aktif) { color:rgba(255,255,255,.7); }
        .jumlah-tab  { background:rgba(255,255,255,.08); border-radius:20px; padding:1px 7px; font-size:11px; }
        .tombol-tab.aktif .jumlah-tab { background:rgba(99,102,241,.3); color:#818cf8; }

        .bilah-alat  { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; align-items:center; }
        .pembungkus-cari { position:relative; flex:1; min-width:200px; max-width:340px; }
        .ikon-cari   { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.25); pointer-events:none; }
        .input-cari  { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:9px 12px 9px 36px; font-size:13.5px; color:#fff; font-family:'DM Sans',sans-serif; outline:none; transition:border-color .2s; }
        .input-cari::placeholder { color:rgba(255,255,255,.25); }
        .input-cari:focus { border-color:rgba(99,102,241,.5); }

        /* ── DROPDOWN FILTER LEBIH TEBAL & SOLID ── */
        .pilih-filter {
          background: #14142a;
          border: 1px solid #4f46e5;
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          outline: none;
          transition: all 0.2s;
        }
        .pilih-filter:hover {
          background: #1e1e3a;
          border-color: #818cf8;
        }
        .pilih-filter option {
          background: #0f0f1a;
          color: #e2e8f0;
          padding: 8px;
          font-weight: normal;
        }
        .pilih-filter option:checked {
          background: #4f46e5;
          color: white;
          font-weight: 600;
        }

        .btn-primary { background:linear-gradient(135deg,#6366f1,#8b5cf6); border:none; border-radius:9px; padding:9px 18px; font-size:13.5px; font-weight:600; color:#fff; cursor:pointer; display:flex; align-items:center; gap:7px; transition:opacity .2s; font-family:'DM Sans',sans-serif; white-space:nowrap; }
        .btn-primary:hover:not(:disabled) { opacity:.88; }
        .btn-primary:disabled { opacity:.5; cursor:not-allowed; }
        .btn-bahaya  { background:rgba(239,68,68,.15); border:1px solid rgba(239,68,68,.25); border-radius:9px; padding:9px 14px; font-size:13px; font-weight:500; color:#ef4444; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all .2s; font-family:'DM Sans',sans-serif; }
        .btn-bahaya:hover:not(:disabled) { background:rgba(239,68,68,.25); }
        .btn-ghost   { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:9px; padding:9px 16px; font-size:13px; font-weight:500; color:rgba(255,255,255,.65); cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; }
        .btn-ghost:hover:not(:disabled) { background:rgba(255,255,255,.09); color:#fff; }
        .btn-refresh { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:9px 12px; font-size:13px; color:rgba(255,255,255,.5); cursor:pointer; display:flex; align-items:center; gap:6px; transition:all .2s; font-family:'DM Sans',sans-serif; }
        .btn-refresh:hover { background:rgba(255,255,255,.08); color:#fff; }

        .kartu-tabel { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:16px; overflow:hidden; }
        .gulir-tabel { overflow-x:auto; }
        table { width:100%; border-collapse:collapse; }
        thead tr { border-bottom:1px solid rgba(255,255,255,.07); }
        th { text-align:left; font-size:11px; font-weight:600; letter-spacing:.8px; text-transform:uppercase; color:rgba(255,255,255,.22); padding:13px 14px; white-space:nowrap; }
        td { padding:13px 14px; font-size:13.5px; color:rgba(255,255,255,.65); border-bottom:1px solid rgba(255,255,255,.04); vertical-align:middle; white-space:nowrap; }
        tr:last-child td { border-bottom:none; }
        tbody tr { transition:background .15s; }
        tbody tr:hover td { background:rgba(255,255,255,.025); }
        tbody tr.baris-dipilih td { background:rgba(99,102,241,.07); }
        .cb { width:16px; height:16px; accent-color:#6366f1; cursor:pointer; }

        .sel-pengguna  { display:flex; align-items:center; gap:10px; }
        .avatar        { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:12px; color:#fff; flex-shrink:0; }
        .nama-pengguna { font-weight:500; color:rgba(255,255,255,.88); font-size:13.5px; }
        .email-pengguna{ font-size:12px; color:rgba(255,255,255,.3); margin-top:1px; }

        .baris-aksi  { display:flex; align-items:center; gap:6px; }
        .tombol-ikon { width:30px; height:30px; border-radius:7px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .ikon-lihat  { background:rgba(99,102,241,.12); color:#818cf8; }
        .ikon-edit   { background:rgba(16,185,129,.12);  color:#10b981; }
        .ikon-hapus  { background:rgba(239,68,68,.10);   color:#ef4444; }
        .tombol-ikon:hover { filter:brightness(1.3); transform:scale(1.08); }

        .paginasi         { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-top:1px solid rgba(255,255,255,.06); flex-wrap:wrap; gap:10px; }
        .info-halaman     { font-size:13px; color:rgba(255,255,255,.35); }
        .tombol-halaman-wrap { display:flex; gap:4px; }
        .tombol-halaman   { width:32px; height:32px; border-radius:7px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.04); color:rgba(255,255,255,.5); font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:'center'; transition:all .15s; }
        .tombol-halaman:hover { border-color:rgba(99,102,241,.5); color:#818cf8; }
        .tombol-halaman.aktif { background:rgba(99,102,241,.2); border-color:#6366f1; color:#818cf8; font-weight:600; }

        .bilah-massal { display:flex; align-items:center; gap:12px; padding:10px 18px; background:rgba(99,102,241,.1); border-bottom:1px solid rgba(99,102,241,.2); }
        .info-massal  { font-size:13px; color:#818cf8; flex:1; }

        .input-form { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:9px; padding:10px 12px; font-size:13.5px; color:#fff; font-family:'DM Sans',sans-serif; outline:none; width:100%; transition:border-color .2s; appearance:none; }
        .input-form::placeholder { color:rgba(255,255,255,.25); }
        .input-form:focus { border-color:rgba(99,102,241,.6); }
        .input-form:disabled { opacity:.5; cursor:not-allowed; }

        .status-kosong { text-align:center; padding:48px 20px; }
        .ikon-kosong   { font-size:38px; margin-bottom:12px; }
        .judul-kosong  { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:rgba(255,255,255,.4); }
        .sub-kosong    { font-size:13px; color:rgba(255,255,255,.2); margin-top:4px; }

        .status-error { text-align:center; padding:48px 20px; }

        .grid-detail { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .item-detail { background:rgba(255,255,255,.04); border-radius:10px; padding:12px; }
        .label-detail{ font-size:11px; font-weight:600; letter-spacing:.5px; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:4px; }
        .nilai-detail{ font-size:13.5px; color:#fff; }

        .mono { font-family:monospace; font-size:12px; color:rgba(255,255,255,.4); }
      `}</style>

      <div className="pembungkus">
        <Sidebar />
        <main className="konten">

          <div className="bilah-atas">
            <div>
              <div className="judul">Kelola Pengguna</div>
              <div className="subjudul">Manajemen data pengguna & admin platform secara realtime</div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-refresh" onClick={fetchUsers} disabled={loading}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: loading ? 'spin .7s linear infinite' : 'none' }}>
                  <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                Refresh
              </button>
              <button className="btn-primary" onClick={() => { setTarget(null); setModal('tambah'); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Tambah {tab === 'masyarakat' ? 'Masyarakat' : 'Admin'}
              </button>
            </div>
          </div>

          <div className="grid-ringkasan">
            <div className="kartu-ringkasan">
              <div className="ikon-ringkasan" style={{ background: 'rgba(99,102,241,.12)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <div className="nilai-ringkasan">{loading ? '—' : jmlMasyarakat}</div>
                <div className="label-ringkasan">Masyarakat</div>
              </div>
            </div>
            <div className="kartu-ringkasan">
              <div className="ikon-ringkasan" style={{ background: 'rgba(16,185,129,.12)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <div className="nilai-ringkasan">{loading ? '—' : jmlAdmin}</div>
                <div className="label-ringkasan">Admin</div>
              </div>
            </div>
            <div className="kartu-ringkasan">
              <div className="ikon-ringkasan" style={{ background: 'rgba(245,158,11,.12)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <div className="nilai-ringkasan">{loading ? '—' : jmlSuperAdmin}</div>
                <div className="label-ringkasan">Super Admin</div>
              </div>
            </div>
          </div>

          <div className="baris-tab">
            {[
              ['masyarakat', 'Masyarakat', users.filter(u => u.role === 'masyarakat').length,
                <path key="p" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>,
                <circle key="c" cx="12" cy="7" r="4"/>
              ],
              ['admin', 'Admin', users.filter(u => ['admin','super_admin'].includes(u.role)).length,
                <path key="s" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              ],
            ].map(([id, lbl, jml, ...paths]) => (
              <button key={id} className={`tombol-tab ${tab === id ? 'aktif' : ''}`} onClick={() => gantiTab(id)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{paths}</svg>
                {lbl}
                <span className="jumlah-tab">{loading ? '…' : jml}</span>
              </button>
            ))}
          </div>

          <div className="bilah-alat">
            <div className="pembungkus-cari">
              <span className="ikon-cari">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input className="input-cari" placeholder="Cari nama, email, NIK…" value={cari} onChange={e => { setCari(e.target.value); setDipilih([]); }} />
            </div>
            <select className="pilih-filter" value={filterRole} onChange={e => { setFilterRole(e.target.value); setDipilih([]); }}>
              {opsiFilterRole.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select className="pilih-filter" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setDipilih([]); }}>
              <option value="semua">Semua Status</option>
              {Object.entries(KONFIG_STATUS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
            </select>
            {dipilih.length > 0 && (
              <button className="btn-bahaya" onClick={() => setModal('hapus-massal')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
                Hapus ({dipilih.length})
              </button>
            )}
          </div>

          <div className="kartu-tabel">
            {dipilih.length > 0 && (
              <div className="bilah-massal">
                <span className="info-massal">{dipilih.length} data dipilih</span>
                <button className="btn-ghost" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => setDipilih([])}>Batal pilih</button>
              </div>
            )}
            <div className="gulir-tabel">
              <table>
                <thead>
                  <tr>
                    <th style={{ width:40 }}><input type="checkbox" className="cb" checked={terfilter.length > 0 && dipilih.length === terfilter.length} onChange={toggleSemuaPilih} /></th>
                    <th>Pengguna</th><th>Role</th><th>Status</th><th>NIK</th><th>No. Telepon</th><th>Terdaftar</th><th style={{ textAlign:'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8}><Spinner /></td></tr>
                  ) : error ? (
                    <tr><td colSpan={8}>
                      <div className="status-error"><div className="ikon-kosong">⚠️</div><div className="judul-kosong">Gagal memuat data</div><div className="sub-kosong">{error}</div><button className="btn-primary" style={{ margin:'14px auto 0', width:'fit-content' }} onClick={fetchUsers}>Coba Lagi</button></div>
                    </td></tr>
                  ) : terfilter.length === 0 ? (
                    <tr><td colSpan={8}><div className="status-kosong"><div className="ikon-kosong">🔍</div><div className="judul-kosong">Tidak ada data</div><div className="sub-kosong">Coba ubah filter atau kata kunci pencarian</div></div></td></tr>
                  ) : terfilter.map(u => (
                    <tr key={u.id} className={dipilih.includes(u.id) ? 'baris-dipilih' : ''}>
                      <td><input type="checkbox" className="cb" checked={dipilih.includes(u.id)} onChange={() => togglePilih(u.id)} /></td>
                      <td><div className="sel-pengguna"><div className="avatar" style={{ background: avatarWarna(u.id) }}>{avatarInisial(u.nama_lengkap)}</div><div><div className="nama-pengguna">{u.nama_lengkap}</div><div className="email-pengguna">{u.email}</div></div></div></td>
                      <td><LencanaRole role={u.role} /></td>
                      <td><LencanaStatus status={u.status || 'aktif'} /></td>
                      <td><span className="mono">{u.nik || '—'}</span></td>
                      <td style={{ fontSize:13 }}>{u.no_telp || '—'}</td>
                      <td style={{ fontSize:12.5, color:'rgba(255,255,255,.35)' }}>{formatTanggal(u.created_at)}</td>
                      <td><div className="baris-aksi" style={{ justifyContent:'center' }}>
                        <button className="tombol-ikon ikon-lihat" title="Lihat detail" onClick={() => { setTarget(u); setModal('lihat'); }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                        <button className="tombol-ikon ikon-edit" title="Edit" onClick={() => { setTarget(u); setModal('edit'); }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button className="tombol-ikon ikon-hapus" title="Hapus" onClick={() => { setTarget(u); setModal('hapus'); }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="paginasi">
              <span className="info-halaman">Menampilkan {terfilter.length} dari {dataset.length} data</span>
              <div className="tombol-halaman-wrap">
                {['‹','1','2','3','›'].map((b, i) => (<button key={i} className={`tombol-halaman ${b==='1'?'aktif':''}`}>{b}</button>))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {modal === 'tambah' && <Modal judul={`Tambah ${tab === 'masyarakat' ? 'Masyarakat' : 'Admin'} Baru`} onTutup={() => setModal(null)}><FormPengguna opsiRole={opsiRole} onSimpan={handleTambah} onBatal={() => setModal(null)} loading={loadingAksi} /></Modal>}
      {modal === 'edit' && target && <Modal judul="Ubah Data Pengguna" onTutup={() => setModal(null)}><FormPengguna awal={target} opsiRole={opsiRole} onSimpan={handleEdit} onBatal={() => setModal(null)} loading={loadingAksi} /></Modal>}
      {modal === 'lihat' && target && (
        <Modal judul="Detail Pengguna" onTutup={() => setModal(null)}>
          <div style={{ padding:22 }}>
            <div style={{ width:60, height:60, borderRadius:14, background:avatarWarna(target.id), display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff', margin:'0 auto 12px' }}>{avatarInisial(target.nama_lengkap)}</div>
            <div style={{ textAlign:'center', fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#fff', marginBottom:4 }}>{target.nama_lengkap}</div>
            <div style={{ textAlign:'center', fontSize:13, color:'rgba(255,255,255,.35)', marginBottom:18 }}>{target.email}</div>
            <div className="grid-detail">
              {[
                ['Role', <LencanaRole key="r" role={target.role} />],
                ['Status', <LencanaStatus key="s" status={target.status || 'aktif'} />],
                ['NIK', <span key="n" className="mono">{target.nik || '—'}</span>],
                ['No. Telepon', target.no_telp || '—'],
                ['Terdaftar', formatTanggal(target.created_at)],
                ['ID User', <span key="id" className="mono">#{target.id}</span>],
              ].map(([lbl, val], i) => (<div key={i} className="item-detail"><div className="label-detail">{lbl}</div><div className="nilai-detail">{val}</div></div>))}
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 }}>
              <button className="btn-ghost" onClick={() => setModal(null)}>Tutup</button>
              <button className="btn-primary" onClick={() => setModal('edit')}>Edit</button>
            </div>
          </div>
        </Modal>
      )}
      {modal === 'hapus' && target && (
        <Modal judul="Konfirmasi Hapus" onTutup={() => setModal(null)}>
          <div style={{ padding:22, textAlign:'center' }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'rgba(239,68,68,.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg></div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#fff', marginBottom:8 }}>Hapus {target.nama_lengkap}?</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.4)', lineHeight:1.5 }}>Data <strong style={{ color:'#fff' }}>{target.nama_lengkap}</strong> akan dihapus permanen dari database.</div>
            <div style={{ display:'flex', justifyContent:'center', gap:10, marginTop:20 }}>
              <button className="btn-ghost" onClick={() => setModal(null)} disabled={loadingAksi}>Batal</button>
              <button className="btn-bahaya" style={{ border:'none' }} onClick={() => handleHapus(target.id)} disabled={loadingAksi}>{loadingAksi ? 'Menghapus…' : 'Ya, Hapus'}</button>
            </div>
          </div>
        </Modal>
      )}
      {modal === 'hapus-massal' && (
        <Modal judul="Konfirmasi Hapus Massal" onTutup={() => setModal(null)}>
          <div style={{ padding:22, textAlign:'center' }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'rgba(239,68,68,.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg></div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#fff', marginBottom:8 }}>Hapus {dipilih.length} Data?</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.4)', lineHeight:1.5 }}>Semua data yang dipilih akan dihapus permanen dari database.</div>
            <div style={{ display:'flex', justifyContent:'center', gap:10, marginTop:20 }}>
              <button className="btn-ghost" onClick={() => setModal(null)} disabled={loadingAksi}>Batal</button>
              <button className="btn-bahaya" style={{ border:'none' }} onClick={handleHapusMassal} disabled={loadingAksi}>{loadingAksi ? 'Menghapus…' : 'Ya, Hapus Semua'}</button>
            </div>
          </div>
        </Modal>
      )}
      {toast && <Toast pesan={toast.pesan} tipe={toast.tipe} onTutup={() => setToast(null)} />}
    </>
  );
}