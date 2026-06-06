'use client';
import React from 'react';

export default function TabelPengguna({ dataLaporan }) {
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);

  const laporan = Array.isArray(dataLaporan) ? dataLaporan : [];

  const laporanTerurut = [...laporan].sort((a, b) => {
    if (typeof a.id === 'number' && typeof b.id === 'number') {
      return b.id - a.id;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <>
{/* ================= MODAL DETAIL ================= */}
{selectedComplaint && (
  <div
    onClick={() => setSelectedComplaint(null)}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      zIndex: 9999,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '700px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        background: '#0f172a',
        borderRadius: '18px',
        color: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,.45)',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: '18px 22px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
            }}
          >
            Detail Laporan
          </h2>

          <div
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: '#a78bfa',
            }}
          >
            #
            {selectedComplaint.ticket_number ||
              selectedComplaint.id}
          </div>
        </div>

        <button
          onClick={() => setSelectedComplaint(null)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: '1px solid #334155',
            background: '#1e293b',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: '18px',
          overflowY: 'auto',
          flex: 1,
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(250px,1fr))',
          gap: '14px',
        }}
      >
        {/* PELAPOR */}
        <div
          style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '12px',
            }}
          >
            PELAPOR
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background:
                  'linear-gradient(135deg,#7c3aed,#4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px',
              }}
            >
              {(selectedComplaint.reporter || 'A')[0].toUpperCase()}
            </div>

            <div
              style={{
                fontWeight: '600',
                fontSize: '16px',
              }}
            >
              {selectedComplaint.reporter || 'Anonim'}
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div
          style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '12px',
            }}
          >
            STATUS LAPORAN
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '999px',
              background: 'rgba(16,185,129,.15)',
              color: '#34d399',
              fontWeight: '600',
            }}
          >
            ● {selectedComplaint.status}
          </span>
        </div>

        {/* JUDUL */}
        <div
          style={{
            gridColumn: '1 / -1',
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '8px',
            }}
          >
            JUDUL LAPORAN
          </div>

          <div
            style={{
              fontSize: '20px',
              fontWeight: '700',
            }}
          >
            {selectedComplaint.title}
          </div>
        </div>

        {/* KATEGORI */}
        <div
          style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '8px',
            }}
          >
            KATEGORI
          </div>

          <div>
            {selectedComplaint.category_name ||
              selectedComplaint.kategori ||
              selectedComplaint.category_id ||
              '-'}
          </div>
        </div>

        {/* TANGGAL */}
        <div
          style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '8px',
            }}
          >
            TANGGAL LAPORAN
          </div>

          <div>
            {selectedComplaint.created_at
              ? new Date(
                  selectedComplaint.created_at
                ).toLocaleString('id-ID')
              : '-'}
          </div>
        </div>

        {/* DESKRIPSI */}
        <div
          style={{
            gridColumn: '1 / -1',
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '8px',
            }}
          >
            DESKRIPSI LENGKAP
          </div>

          <div
            style={{
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
            }}
          >
            {selectedComplaint.description}
          </div>
        </div>

        {/* GAMBAR */}
        {selectedComplaint.file_path && (
          <div
            style={{
              gridColumn: '1 / -1',
              background: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                marginBottom: '10px',
              }}
            >
              GAMBAR LAPORAN
            </div>

            <img
              src={`http://localhost:5000/uploads/${selectedComplaint.file_path}`}
              alt="Laporan"
              style={{
                width: '100%',
                maxHeight: '280px',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
          </div>
        )}

        {/* KOMENTAR */}
        <div
          style={{
            gridColumn: '1 / -1',
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '12px',
            }}
          >
            KOMENTAR
          </div>

          {selectedComplaint.comments?.length ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {selectedComplaint.comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: '#0b1220',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '600',
                    }}
                  >
                    {c.user_name}
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      marginTop: '2px',
                    }}
                  >
                    {new Date(
                      c.created_at
                    ).toLocaleString('id-ID')}
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
                    }}
                  >
                    {c.comment}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                color: '#94a3b8',
              }}
            >
              Belum ada komentar
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
      {/* ================= TABLE ================= */}
      <div className="kartu" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="kepala-kartu">
          <span className="judul-kartu">Daftar Pengaduan Terbaru</span>
        </div>

        <div style={{ maxHeight: '320px', overflow: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Pelapor</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th>Detail</th>
              </tr>
            </thead>

            <tbody>
              {laporanTerurut.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Belum ada laporan
                  </td>
                </tr>
              ) : (
                laporanTerurut.map((l) => (
                  <tr key={l.id}>
                    <td>#{l.id}</td>

                    <td>{l.reporter || l.user_name || l.nama_lengkap || '-'}</td>

                    <td>{l.category_id || l.kategori || '-'}</td>

                    <td>{l.status}</td>

                    <td>
                      {l.created_at
                        ? new Date(l.created_at).toLocaleDateString('id-ID')
                        : '-'}
                    </td>

                    <td>
                      <button onClick={() => setSelectedComplaint(l)}>
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}