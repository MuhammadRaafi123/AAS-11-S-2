// app/super_admin/dashboard/data.jsx
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetcher(endpoint) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) {
      console.error(`[API ERROR] ${endpoint} returned status ${res.status}`);

      // 🔐 Tangani 401: hapus token & redirect ke login (hanya di client)
      if (res.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/landing/login";
      }

      return [];
    }

    const result = await res.json();
    console.log(`[DEBUG] Data dari ${endpoint}:`, result);

    if (result && typeof result === "object") {
      return (
        result.data ||
        result.complaints ||
        result.users ||
        result.activities ||
        result
      );
    }

    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error(`⚠️ Gagal fetch ${endpoint}:`, error.message);
    return [];
  }
}

export async function getStats() {
  const [listLaporan, listPengguna] = await Promise.all([
    fetcher('/complaints'),
    fetcher('/auth/users')
  ]);
  
  const totalLaporan = listLaporan.length;
  const totalSelesai = listLaporan.filter(l => 
    l.status && String(l.status).toLowerCase() === 'selesai'
  ).length;
  
  const totalDitolak = listLaporan.filter(l => 
    l.status && String(l.status).toLowerCase() === 'ditolak'
  ).length;
  
  const totalAktif = listPengguna.filter(u => 
    u.status && String(u.status).toLowerCase() === 'aktif'
  ).length;
  
  return [
    { label: 'Total Laporan', value: totalLaporan.toString(), change: 'Real-time', up: true, color: '#6366f1', bg: 'rgba(99,102,241,0.12)', icon: '📊' },
    { label: 'User Aktif', value: totalAktif.toString(), change: 'Aktif', up: true, color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: '👥' },
    { label: 'Selesai', value: totalSelesai.toString(), change: totalLaporan > 0 ? `${((totalSelesai / totalLaporan) * 100).toFixed(0)}%` : '0%', up: true, color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: '✅' },
    { label: 'Ditolak', value: totalDitolak.toString(), change: '0%', up: false, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '❌' },
  ];
}

export async function getMonthlyStats() {
  const listLaporan = await fetcher('/complaints');
  const stats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  
  listLaporan.forEach(l => {
    if (l.created_at) {
      const month = new Date(l.created_at).getMonth();
      stats[month]++;
    }
  });
  return stats;
}

export async function getAktivitas() {
  const data = await fetcher('/notifications');
  if (!Array.isArray(data)) return [];
  return data.map(item => {
    let statusText = String(item.status_to || 'unknown').replace(/_/g, ' ');
    let aksiText = `Laporan ${item.ticket_number || ''} - "${item.title || ''}" status diperbarui ke "${statusText}"`;
    if (item.note) {
      aksiText += `: ${item.note}`;
    }
    return {
      aksi: aksiText,
      pengguna: 'Sistem / Admin',
      waktu: item.created_at 
        ? new Date(item.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : 'Baru saja',
      tipe: item.status_to || 'menunggu_verifikasi'
    };
  });
}

export async function getDataPenggunaSistem() { return await fetcher('/auth/users'); }
export async function getLaporanTerbaru() { return await fetcher('/complaints'); }

export const dataBar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
export const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

export const warnaBadge = {
  aktif: { bg: 'rgba(16,185,129,0.12)', teks: '#10b981', label: 'Aktif' },
  nonaktif: { bg: 'rgba(239,68,68,0.10)', teks: '#ef4444', label: 'Nonaktif' },
  menunggu_verifikasi: { bg: 'rgba(99,102,241,0.12)', teks: '#6366f1', label: 'Menunggu Verifikasi' },
  selesai: { bg: 'rgba(16,185,129,0.12)', teks: '#10b981', label: 'Selesai' },
  ditolak: { bg: 'rgba(239,68,68,0.10)', teks: '#ef4444', label: 'Ditolak' }
};

export const warnaTitik = { 
  menunggu_verifikasi: '#6366f1', 
  diverifikasi: '#8b5cf6', 
  diproses: '#3b82f6', 
  selesai: '#10b981', 
  ditolak: '#ef4444' 
};