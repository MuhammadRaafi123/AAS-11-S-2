'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';

// ── Data ──────────────────────────────────────────────
const dataPengguna = [
  { id: 1,  nama: 'Aryo Wibisono',  email: 'aryo@mail.com',   peran: 'Pengguna', status: 'aktif',    bergabung: '28 Mei 2025', loginTerakhir: '2 jam lalu',    avatar: 'AW', warnaAvatar: '#6366f1' },
  { id: 2,  nama: 'Siti Rahayu',    email: 'siti@mail.com',    peran: 'Pengguna', status: 'aktif',    bergabung: '27 Mei 2025', loginTerakhir: '5 jam lalu',    avatar: 'SR', warnaAvatar: '#10b981' },
  { id: 3,  nama: 'Budi Santoso',   email: 'budi@mail.com',    peran: 'Pengguna', status: 'nonaktif', bergabung: '25 Mei 2025', loginTerakhir: '3 hari lalu',   avatar: 'BS', warnaAvatar: '#f59e0b' },
  { id: 4,  nama: 'Dewi Permata',   email: 'dewi@mail.com',    peran: 'Pengguna', status: 'aktif',    bergabung: '24 Mei 2025', loginTerakhir: '1 jam lalu',    avatar: 'DP', warnaAvatar: '#8b5cf6' },
  { id: 5,  nama: 'Rizky Maulana',  email: 'rizky@mail.com',   peran: 'Pengguna', status: 'menunggu', bergabung: '23 Mei 2025', loginTerakhir: 'Belum login',   avatar: 'RM', warnaAvatar: '#ef4444' },
  { id: 6,  nama: 'Andi Kurniawan', email: 'andi@mail.com',    peran: 'Pengguna', status: 'aktif',    bergabung: '20 Mei 2025', loginTerakhir: '30 menit lalu', avatar: 'AK', warnaAvatar: '#06b6d4' },
  { id: 7,  nama: 'Nurul Hidayah',  email: 'nurul@mail.com',   peran: 'Pengguna', status: 'aktif',    bergabung: '18 Mei 2025', loginTerakhir: '1 hari lalu',   avatar: 'NH', warnaAvatar: '#ec4899' },
  { id: 8,  nama: 'Fajar Setiawan', email: 'fajar@mail.com',   peran: 'Pengguna', status: 'diblokir', bergabung: '15 Mei 2025', loginTerakhir: '10 hari lalu',  avatar: 'FS', warnaAvatar: '#64748b' },
  { id: 9,  nama: 'Maya Indah',     email: 'maya@mail.com',    peran: 'Pengguna', status: 'aktif',    bergabung: '12 Mei 2025', loginTerakhir: '4 jam lalu',    avatar: 'MI', warnaAvatar: '#f97316' },
  { id: 10, nama: 'Hendra Gunawan', email: 'hendra@mail.com',  peran: 'Pengguna', status: 'nonaktif', bergabung: '10 Mei 2025', loginTerakhir: '2 minggu lalu', avatar: 'HG', warnaAvatar: '#84cc16' },
];

const dataAdmin = [
  { id: 1, nama: 'Super Admin',    email: 'superadmin@mail.com', peran: 'Super Admin', status: 'aktif',    bergabung: '01 Jan 2024', loginTerakhir: 'Baru saja',    avatar: 'SA', warnaAvatar: '#6366f1' },
  { id: 2, nama: 'Rendra Saputra', email: 'rendra@mail.com',     peran: 'Admin',       status: 'aktif',    bergabung: '15 Mar 2024', loginTerakhir: '1 jam lalu',   avatar: 'RS', warnaAvatar: '#10b981' },
  { id: 3, nama: 'Lina Marlina',   email: 'lina@mail.com',        peran: 'Admin',       status: 'aktif',    bergabung: '20 Apr 2024', loginTerakhir: '3 jam lalu',   avatar: 'LM', warnaAvatar: '#f59e0b' },
  { id: 4, nama: 'Doni Prasetyo',  email: 'doni@mail.com',        peran: 'Admin',       status: 'nonaktif', bergabung: '05 Jun 2024', loginTerakhir: '2 hari lalu',  avatar: 'DP', warnaAvatar: '#8b5cf6' },
  { id: 5, nama: 'Wulan Sari',     email: 'wulan@mail.com',       peran: 'Admin',       status: 'aktif',    bergabung: '11 Jul 2024', loginTerakhir: '20 mnt lalu',  avatar: 'WS', warnaAvatar: '#ec4899' },
];

// ── Konfigurasi badge status & peran ─────────────────
const KONFIG_STATUS = {
  aktif:    { label: 'Aktif',    warnaBg: 'rgba(16,185,129,.12)',  warnaTs: '#10b981' },
  nonaktif: { label: 'Nonaktif', warnaBg: 'rgba(100,116,139,.12)', warnaTs: '#94a3b8' },
  menunggu: { label: 'Menunggu', warnaBg: 'rgba(245,158,11,.12)',  warnaTs: '#f59e0b' },
  diblokir: { label: 'Diblokir', warnaBg: 'rgba(239,68,68,.10)',   warnaTs: '#ef4444' },
};

const KONFIG_PERAN = {
  'Super Admin': { warnaBg: 'rgba(99,102,241,.15)',  warnaTs: '#818cf8' },
  'Admin':       { warnaBg: 'rgba(16,185,129,.15)',  warnaTs: '#10b981' },
  'Pengguna':    { warnaBg: 'rgba(100,116,139,.15)', warnaTs: '#94a3b8' },
};

const FILTER_STATUS       = ['Semua', 'aktif', 'nonaktif', 'menunggu', 'diblokir'];
const FILTER_PERAN_USER   = ['Semua', 'Pengguna'];
const FILTER_PERAN_ADMIN  = ['Semua', 'Super Admin', 'Admin'];

// ── Komponen kecil ────────────────────────────────────
function LencanaStatus({ status }) {
  const k = KONFIG_STATUS[status] || KONFIG_STATUS.nonaktif;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:500, background:k.warnaBg, color:k.warnaTs }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:k.warnaTs, flexShrink:0 }} />
      {k.label}
    </span>
  );
}

function LencanaPeran({ peran }) {
  const k = KONFIG_PERAN[peran] || KONFIG_PERAN['Pengguna'];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, background:k.warnaBg, color:k.warnaTs }}>
      {peran}
    </span>
  );
}

function Modal({ judul, onTutup, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onTutup}>
      <div style={{ background:'#10101a', border:'1px solid rgba(255,255,255,.1)', borderRadius:18, width:'100%', maxWidth:520, overflow:'hidden' }} onClick={e=>e.stopPropagation()}>
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

function FormPengguna({ awal, opsiPeran, onSimpan, onBatal }) {
  const [form, setForm] = useState(awal || { nama:'', email:'', peran: opsiPeran.filter(r=>r!=='Semua')[0], status:'aktif' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const opsiStatus = awal?.peran === 'Super Admin'
    ? [['aktif','Aktif'],['nonaktif','Nonaktif']]
    : [['aktif','Aktif'],['nonaktif','Nonaktif'],['menunggu','Menunggu'],['diblokir','Diblokir']];

  return (
    <div style={{ padding:22 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        {[['nama','Nama Lengkap','text','Masukkan nama'],['email','Email','email','email@domain.com']].map(([k,lbl,tipe,ph]) => (
          <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:'.6px', textTransform:'uppercase' }}>{lbl}</label>
            <input className="input-form" type={tipe} value={form[k]||''} placeholder={ph} onChange={e=>set(k,e.target.value)} />
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:'.6px', textTransform:'uppercase' }}>Peran</label>
          <select className="input-form" value={form.peran} onChange={e=>set('peran',e.target.value)}>
            {opsiPeran.filter(r=>r!=='Semua').map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:'.6px', textTransform:'uppercase' }}>Status</label>
          <select className="input-form" value={form.status} onChange={e=>set('status',e.target.value)}>
            {opsiStatus.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
        <button className="btn-ghost" onClick={onBatal}>Batal</button>
        <button className="btn-primary" onClick={()=>onSimpan(form)}>Simpan</button>
      </div>
    </div>
  );
}

// ── Halaman utama ─────────────────────────────────────
export default function HalamanKelolaUser() {
  const [tab, setTab]               = useState('pengguna');
  const [pengguna, setPengguna]     = useState(dataPengguna);
  const [admin, setAdmin]           = useState(dataAdmin);
  const [cari, setCari]             = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterPeran,  setFilterPeran]  = useState('Semua');
  const [dipilih, setDipilih]       = useState([]);
  const [modal, setModal]           = useState(null);
  const [target, setTarget]         = useState(null);

  const isPengguna  = tab === 'pengguna';
  const dataset     = isPengguna ? pengguna : admin;
  const setDataset  = isPengguna ? setPengguna : setAdmin;
  const opsiPeran   = isPengguna ? FILTER_PERAN_USER : FILTER_PERAN_ADMIN;

  const terfilter = dataset.filter(u => {
    const cocokCari   = u.nama.toLowerCase().includes(cari.toLowerCase()) || u.email.toLowerCase().includes(cari.toLowerCase());
    const cocokStatus = filterStatus === 'Semua' || u.status === filterStatus;
    const cocokPeran  = filterPeran  === 'Semua' || u.peran  === filterPeran;
    return cocokCari && cocokStatus && cocokPeran;
  });

  const pilihanToggle  = (id) => setDipilih(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  const pilihanSemuaToggle = () => setDipilih(s => s.length === terfilter.length ? [] : terfilter.map(u=>u.id));

  const handleTambah = (form) => {
    const baru = { ...form, id: Date.now(), bergabung: new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}), loginTerakhir:'Belum login', avatar: form.nama.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(), warnaAvatar:'#6366f1' };
    setDataset(d => [baru, ...d]);
    setModal(null);
  };

  const handleEdit = (form) => {
    setDataset(d => d.map(u => u.id === target.id ? { ...u, ...form } : u));
    setModal(null);
  };

  const handleHapus = (ids) => {
    setDataset(d => d.filter(u => !ids.includes(u.id)));
    setDipilih([]);
    setModal(null);
  };

  const gantiTab = (t) => { setTab(t); setDipilih([]); setCari(''); setFilterStatus('Semua'); setFilterPeran('Semua'); };

  const jmlAktif    = dataset.filter(u=>u.status==='aktif').length;
  const jmlNonaktif = dataset.filter(u=>u.status==='nonaktif').length;
  const jmlMenunggu = dataset.filter(u=>u.status==='menunggu').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .pembungkus { display:flex; min-height:100vh; background:#07070e; font-family:'DM Sans',sans-serif; color:#e2e8f0; }
        .konten     { margin-left:240px; flex:1; padding:32px; }
        @media(max-width:768px){ .konten{ margin-left:72px; padding:20px 16px; } }

        .bilah-atas { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
        .judul      { font-family:'Syne',sans-serif; font-weight:800; font-size:26px; color:#fff; letter-spacing:-.5px; }
        .subjudul   { font-size:13px; color:rgba(255,255,255,.35); margin-top:2px; }

        /* Kartu ringkasan */
        .grid-ringkasan { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:22px; }
        @media(max-width:700px){ .grid-ringkasan{ grid-template-columns:1fr; } }
        .kartu-ringkasan { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:14px; }
        .ikon-ringkasan  { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .nilai-ringkasan { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#fff; }
        .label-ringkasan { font-size:12px; color:rgba(255,255,255,.35); margin-top:1px; }

        /* Tab */
        .baris-tab { display:flex; margin-bottom:20px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:12px; padding:5px; width:fit-content; }
        .tombol-tab { padding:8px 22px; border-radius:8px; font-size:13.5px; font-weight:500; color:rgba(255,255,255,.4); cursor:pointer; border:none; background:transparent; display:flex; align-items:center; gap:7px; transition:all .2s; font-family:'DM Sans',sans-serif; }
        .tombol-tab.aktif { background:rgba(99,102,241,.2); color:#818cf8; }
        .tombol-tab:hover:not(.aktif) { color:rgba(255,255,255,.7); }
        .jumlah-tab { background:rgba(255,255,255,.08); border-radius:20px; padding:1px 7px; font-size:11px; }
        .tombol-tab.aktif .jumlah-tab { background:rgba(99,102,241,.3); color:#818cf8; }

        /* Toolbar */
        .bilah-alat { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; align-items:center; }
        .pembungkus-cari { position:relative; flex:1; min-width:200px; max-width:340px; }
        .ikon-cari   { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.25); pointer-events:none; }
        .input-cari  { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:9px 12px 9px 36px; font-size:13.5px; color:#fff; font-family:'DM Sans',sans-serif; outline:none; transition:border-color .2s; }
        .input-cari::placeholder { color:rgba(255,255,255,.25); }
        .input-cari:focus { border-color:rgba(99,102,241,.5); }
        .pilih-filter { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:9px 12px; font-size:13px; color:rgba(255,255,255,.65); font-family:'DM Sans',sans-serif; outline:none; cursor:pointer; }
        .pilih-filter:focus { border-color:rgba(99,102,241,.5); }

        /* Tombol */
        .btn-primary { background:linear-gradient(135deg,#6366f1,#8b5cf6); border:none; border-radius:9px; padding:9px 18px; font-size:13.5px; font-weight:600; color:#fff; cursor:pointer; display:flex; align-items:center; gap:7px; transition:opacity .2s; font-family:'DM Sans',sans-serif; white-space:nowrap; }
        .btn-primary:hover { opacity:.88; }
        .btn-bahaya  { background:rgba(239,68,68,.15); border:1px solid rgba(239,68,68,.25); border-radius:9px; padding:9px 14px; font-size:13px; font-weight:500; color:#ef4444; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all .2s; font-family:'DM Sans',sans-serif; }
        .btn-bahaya:hover { background:rgba(239,68,68,.25); }
        .btn-ghost   { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:9px; padding:9px 16px; font-size:13px; font-weight:500; color:rgba(255,255,255,.65); cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; }
        .btn-ghost:hover { background:rgba(255,255,255,.09); color:#fff; }

        /* Tabel */
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

        /* Sel pengguna */
        .sel-pengguna { display:flex; align-items:center; gap:10px; }
        .avatar { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:12px; color:#fff; flex-shrink:0; }
        .nama-pengguna  { font-weight:500; color:rgba(255,255,255,.88); font-size:13.5px; }
        .email-pengguna { font-size:12px; color:rgba(255,255,255,.3); margin-top:1px; }

        /* Tombol aksi */
        .baris-aksi { display:flex; align-items:center; gap:6px; }
        .tombol-ikon { width:30px; height:30px; border-radius:7px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .ikon-lihat  { background:rgba(99,102,241,.12); color:#818cf8; }
        .ikon-edit   { background:rgba(16,185,129,.12);  color:#10b981; }
        .ikon-hapus  { background:rgba(239,68,68,.10);   color:#ef4444; }
        .tombol-ikon:hover { filter:brightness(1.3); transform:scale(1.08); }

        /* Paginasi */
        .paginasi    { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-top:1px solid rgba(255,255,255,.06); flex-wrap:wrap; gap:10px; }
        .info-halaman{ font-size:13px; color:rgba(255,255,255,.35); }
        .tombol-halaman-wrap { display:flex; gap:4px; }
        .tombol-halaman { width:32px; height:32px; border-radius:7px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.04); color:rgba(255,255,255,.5); font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .tombol-halaman:hover  { border-color:rgba(99,102,241,.5); color:#818cf8; }
        .tombol-halaman.aktif  { background:rgba(99,102,241,.2); border-color:#6366f1; color:#818cf8; font-weight:600; }

        /* Bilah massal */
        .bilah-massal { display:flex; align-items:center; gap:12px; padding:10px 18px; background:rgba(99,102,241,.1); border-bottom:1px solid rgba(99,102,241,.2); }
        .info-massal  { font-size:13px; color:#818cf8; flex:1; }

        /* Input form */
        .input-form { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:9px; padding:10px 12px; font-size:13.5px; color:#fff; font-family:'DM Sans',sans-serif; outline:none; width:100%; transition:border-color .2s; appearance:none; }
        .input-form::placeholder { color:rgba(255,255,255,.25); }
        .input-form:focus { border-color:rgba(99,102,241,.6); }

        /* Kosong */
        .status-kosong { text-align:center; padding:48px 20px; }
        .ikon-kosong   { font-size:38px; margin-bottom:12px; }
        .judul-kosong  { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:rgba(255,255,255,.4); }
        .sub-kosong    { font-size:13px; color:rgba(255,255,255,.2); margin-top:4px; }

        /* Detail modal */
        .grid-detail  { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .item-detail  { background:rgba(255,255,255,.04); border-radius:10px; padding:12px; }
        .label-detail { font-size:11px; font-weight:600; letter-spacing:.5px; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:4px; }
        .nilai-detail { font-size:13.5px; color:#fff; }
      `}</style>

      <div className="pembungkus">
        <Sidebar />
        <main className="konten">

          {/* Bilah atas */}
          <div className="bilah-atas">
            <div>
              <div className="judul">Kelola Pengguna</div>
              <div className="subjudul">Kelola semua pengguna dan admin platform</div>
            </div>
            <button className="btn-primary" onClick={() => { setTarget(null); setModal('tambah'); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah {isPengguna ? 'Pengguna' : 'Admin'}
            </button>
          </div>

          {/* Ringkasan */}
          <div className="grid-ringkasan">
            {[
              [jmlAktif,    'Aktif',    'rgba(16,185,129,.12)',  '#10b981', <polyline points="20 6 9 17 4 12"/>],
              [jmlNonaktif, 'Nonaktif', 'rgba(100,116,139,.12)', '#94a3b8', <><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></>],
              [jmlMenunggu, 'Menunggu', 'rgba(245,158,11,.12)',  '#f59e0b', <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>],
            ].map(([val, lbl, bg, warna, path], i) => (
              <div key={i} className="kartu-ringkasan">
                <div className="ikon-ringkasan" style={{ background: bg }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth="2">{path}</svg>
                </div>
                <div>
                  <div className="nilai-ringkasan">{val}</div>
                  <div className="label-ringkasan">{lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab */}
          <div className="baris-tab">
            {[['pengguna','Pengguna',pengguna.length],['admin','Admin',admin.length]].map(([id,lbl,jml]) => (
              <button key={id} className={`tombol-tab ${tab===id?'aktif':''}`} onClick={()=>gantiTab(id)}>
                {id==='pengguna'
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                }
                {lbl}
                <span className="jumlah-tab">{jml}</span>
              </button>
            ))}
          </div>

          {/* Bilah alat */}
          <div className="bilah-alat">
            <div className="pembungkus-cari">
              <span className="ikon-cari">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input className="input-cari" placeholder={`Cari ${isPengguna?'pengguna':'admin'}…`} value={cari} onChange={e=>{ setCari(e.target.value); setDipilih([]); }} />
            </div>
            <select className="pilih-filter" value={filterStatus} onChange={e=>{ setFilterStatus(e.target.value); setDipilih([]); }}>
              {FILTER_STATUS.map(s=>(
                <option key={s} value={s}>{s==='Semua'?'Semua Status':KONFIG_STATUS[s]?.label||s}</option>
              ))}
            </select>
            <select className="pilih-filter" value={filterPeran} onChange={e=>{ setFilterPeran(e.target.value); setDipilih([]); }}>
              {opsiPeran.map(r=><option key={r} value={r}>{r==='Semua'?'Semua Peran':r}</option>)}
            </select>
            {dipilih.length > 0 && (
              <button className="btn-bahaya" onClick={()=>setModal('hapus-massal')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Hapus ({dipilih.length})
              </button>
            )}
          </div>

          {/* Tabel */}
          <div className="kartu-tabel">
            {dipilih.length > 0 && (
              <div className="bilah-massal">
                <span className="info-massal">{dipilih.length} data dipilih</span>
                <button className="btn-ghost" style={{padding:'6px 12px',fontSize:12}} onClick={()=>setDipilih([])}>Batal pilih</button>
              </div>
            )}
            <div className="gulir-tabel">
              <table>
                <thead>
                  <tr>
                    <th style={{width:40}}>
                      <input type="checkbox" className="cb" checked={terfilter.length>0 && dipilih.length===terfilter.length} onChange={pilihanSemuaToggle} />
                    </th>
                    <th>Nama</th>
                    <th>Peran</th>
                    <th>Status</th>
                    <th>Bergabung</th>
                    <th>Login Terakhir</th>
                    <th style={{textAlign:'center'}}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {terfilter.length === 0 ? (
                    <tr><td colSpan={7}>
                      <div className="status-kosong">
                        <div className="ikon-kosong">🔍</div>
                        <div className="judul-kosong">Tidak ada data</div>
                        <div className="sub-kosong">Coba ubah filter atau kata kunci pencarian</div>
                      </div>
                    </td></tr>
                  ) : terfilter.map(u => (
                    <tr key={u.id} className={dipilih.includes(u.id)?'baris-dipilih':''}>
                      <td><input type="checkbox" className="cb" checked={dipilih.includes(u.id)} onChange={()=>pilihanToggle(u.id)} /></td>
                      <td>
                        <div className="sel-pengguna">
                          <div className="avatar" style={{background:u.warnaAvatar}}>{u.avatar}</div>
                          <div>
                            <div className="nama-pengguna">{u.nama}</div>
                            <div className="email-pengguna">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><LencanaPeran peran={u.peran} /></td>
                      <td><LencanaStatus status={u.status} /></td>
                      <td>{u.bergabung}</td>
                      <td style={{color:u.loginTerakhir==='Belum login'?'rgba(255,255,255,.25)':'rgba(255,255,255,.55)'}}>{u.loginTerakhir}</td>
                      <td>
                        <div className="baris-aksi" style={{justifyContent:'center'}}>
                          <button className="tombol-ikon ikon-lihat" title="Lihat detail" onClick={()=>{ setTarget(u); setModal('lihat'); }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button className="tombol-ikon ikon-edit" title="Edit" onClick={()=>{ setTarget(u); setModal('edit'); }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button className="tombol-ikon ikon-hapus" title="Hapus" onClick={()=>{ setTarget(u); setModal('hapus'); }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="paginasi">
              <span className="info-halaman">Menampilkan {terfilter.length} dari {dataset.length} data</span>
              <div className="tombol-halaman-wrap">
                {['‹','1','2','3','›'].map((b,i) => (
                  <button key={i} className={`tombol-halaman ${b==='1'?'aktif':''}`}>{b}</button>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* ── Modal Tambah ── */}
      {modal === 'tambah' && (
        <Modal judul={`Tambah ${isPengguna?'Pengguna':'Admin'} Baru`} onTutup={()=>setModal(null)}>
          <FormPengguna opsiPeran={opsiPeran} onSimpan={handleTambah} onBatal={()=>setModal(null)} />
        </Modal>
      )}

      {/* ── Modal Edit ── */}
      {modal === 'edit' && target && (
        <Modal judul="Ubah Data" onTutup={()=>setModal(null)}>
          <FormPengguna awal={target} opsiPeran={opsiPeran} onSimpan={handleEdit} onBatal={()=>setModal(null)} />
        </Modal>
      )}

      {/* ── Modal Lihat Detail ── */}
      {modal === 'lihat' && target && (
        <Modal judul="Detail Pengguna" onTutup={()=>setModal(null)}>
          <div style={{padding:22}}>
            <div style={{width:60,height:60,borderRadius:14,background:target.warnaAvatar,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#fff',margin:'0 auto 12px'}}>{target.avatar}</div>
            <div style={{textAlign:'center',fontFamily:'Syne,sans-serif',fontSize:17,fontWeight:700,color:'#fff',marginBottom:4}}>{target.nama}</div>
            <div style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,.35)',marginBottom:18}}>{target.email}</div>
            <div className="grid-detail">
              {[['Peran',<LencanaPeran peran={target.peran}/>],['Status',<LencanaStatus status={target.status}/>],['Bergabung',target.bergabung],['Login Terakhir',target.loginTerakhir],['ID',`#${target.id}`]].map(([lbl,val],i)=>(
                <div key={i} className="item-detail">
                  <div className="label-detail">{lbl}</div>
                  <div className="nilai-detail">{val}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:20}}>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Tutup</button>
              <button className="btn-primary" onClick={()=>setModal('edit')}>Edit</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal Hapus Satu ── */}
      {modal === 'hapus' && target && (
        <Modal judul="Konfirmasi Hapus" onTutup={()=>setModal(null)}>
          <div style={{padding:22,textAlign:'center'}}>
            <div style={{width:52,height:52,borderRadius:14,background:'rgba(239,68,68,.12)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
            </div>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:17,fontWeight:700,color:'#fff',marginBottom:8}}>Hapus {target.nama}?</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.5}}>Data <strong style={{color:'#fff'}}>{target.nama}</strong> akan dihapus permanen dan tidak bisa dikembalikan.</div>
            <div style={{display:'flex',justifyContent:'center',gap:10,marginTop:20}}>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Batal</button>
              <button className="btn-bahaya" style={{border:'none'}} onClick={()=>handleHapus([target.id])}>Ya, Hapus</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal Hapus Massal ── */}
      {modal === 'hapus-massal' && (
        <Modal judul="Konfirmasi Hapus Massal" onTutup={()=>setModal(null)}>
          <div style={{padding:22,textAlign:'center'}}>
            <div style={{width:52,height:52,borderRadius:14,background:'rgba(239,68,68,.12)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
            </div>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:17,fontWeight:700,color:'#fff',marginBottom:8}}>Hapus {dipilih.length} Data?</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.5}}>Semua data yang dipilih akan dihapus permanen.</div>
            <div style={{display:'flex',justifyContent:'center',gap:10,marginTop:20}}>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Batal</button>
              <button className="btn-bahaya" style={{border:'none'}} onClick={()=>handleHapus(dipilih)}>Ya, Hapus Semua</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}