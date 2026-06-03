'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';

// ── Data ──────────────────────────────────────────────
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

const userGrowth     = [320, 480, 410, 620, 540, 780, 690, 850, 720, 940, 1020, 1180];
const revenueData    = [42, 58, 51, 74, 63, 89, 77, 95, 68, 88, 102, 115];  // in juta
const sessionData    = [210, 330, 290, 450, 380, 510, 470, 590, 430, 620, 680, 750];
const bounceRate     = [55, 48, 52, 44, 46, 39, 41, 36, 43, 38, 34, 31];

const trafficSources = [
  { label: 'Organic Search', value: 38, color: '#6366f1' },
  { label: 'Direct',         value: 24, color: '#10b981' },
  { label: 'Social Media',   value: 19, color: '#f59e0b' },
  { label: 'Referral',       value: 12, color: '#8b5cf6' },
  { label: 'Lainnya',        value: 7,  color: '#ef4444' },
];

const deviceData = [
  { label: 'Mobile',  value: 54, color: '#6366f1' },
  { label: 'Desktop', value: 35, color: '#10b981' },
  { label: 'Tablet',  value: 11, color: '#f59e0b' },
];

const topPages = [
  { page: '/dashboard',        views: 12840, bounce: '28%', avg: '4m 12s' },
  { page: '/product/list',     views: 9321,  bounce: '34%', avg: '3m 08s' },
  { page: '/user/profile',     views: 7654,  bounce: '41%', avg: '2m 44s' },
  { page: '/statistic',        views: 5430,  bounce: '22%', avg: '5m 30s' },
  { page: '/settings',         views: 3210,  bounce: '39%', avg: '1m 55s' },
];

const kpiCards = [
  { label: 'Avg. Session Duration', value: '3m 42s', change: '+8.3%', up: true,  color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  icon: '⏱' },
  { label: 'Bounce Rate',           value: '31%',    change: '-4.1%', up: true,  color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '↩' },
  { label: 'Pages / Session',       value: '5.2',    change: '+1.7%', up: true,  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '📄' },
  { label: 'New vs Return',         value: '62/38',  change: '+2.4%', up: true,  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  icon: '🔄' },
];

const TABS = ['User Growth', 'Revenue', 'Sessions', 'Bounce Rate'];
const TAB_DATA   = [userGrowth, revenueData, sessionData, bounceRate];
const TAB_LABELS = ['Users', 'Rp (juta)', 'Sessions', 'Rate (%)'];
const TAB_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

// ── Helpers ───────────────────────────────────────────
function normalize(arr) {
  const max = Math.max(...arr);
  return arr.map(v => (v / max) * 100);
}

function DonutChart({ segments, size = 130, thickness = 24 }) {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((a, s) => a + s.value, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={thickness} />
      {segments.map((s, i) => {
        const dash = (s.value / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle
            key={i}
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────
export default function StatisticPage() {
  const [activeTab, setActiveTab]   = useState(0);
  const [hoverIdx,  setHoverIdx]    = useState(null);
  const [range,     setRange]       = useState('12M');

  const chartData   = TAB_DATA[activeTab];
  const norm        = normalize(chartData);
  const chartColor  = TAB_COLORS[activeTab];
  const chartLabel  = TAB_LABELS[activeTab];
  const maxVal      = Math.max(...chartData);
  const totalTraffic = trafficSources.reduce((a, s) => a + s.value, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .page-wrapper {
          display: flex; min-height: 100vh;
          background: #07070e;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
        }

        .main-content {
          margin-left: 240px; flex: 1; padding: 32px;
          transition: margin-left .3s ease;
        }
        @media (max-width: 768px) { .main-content { margin-left: 72px; padding: 20px 16px; } }

        /* topbar */
        .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
        .page-title { font-family:'Syne',sans-serif; font-weight:800; font-size:26px; color:#fff; letter-spacing:-.5px; }
        .page-sub   { font-size:13px; color:rgba(255,255,255,.35); margin-top:2px; }

        .range-tabs { display:flex; gap:4px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:10px; padding:4px; }
        .range-btn  {
          padding:6px 14px; border-radius:7px; font-size:12.5px; font-weight:500;
          color:rgba(255,255,255,.4); cursor:pointer; border:none; background:transparent;
          transition:all .2s;
        }
        .range-btn.active { background:rgba(99,102,241,.25); color:#818cf8; }
        .range-btn:hover:not(.active) { color:rgba(255,255,255,.7); }

        /* kpi grid */
        .kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; }
        @media (max-width:1100px) { .kpi-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:600px)  { .kpi-grid { grid-template-columns:1fr; } }

        .kpi-card {
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:14px; padding:18px;
          display:flex; align-items:center; gap:14px;
          transition:transform .2s, border-color .2s;
        }
        .kpi-card:hover { transform:translateY(-2px); border-color:rgba(255,255,255,.12); }

        .kpi-emoji {
          width:42px; height:42px; border-radius:11px;
          display:flex; align-items:center; justify-content:center;
          font-size:18px; flex-shrink:0;
        }
        .kpi-val  { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#fff; }
        .kpi-lbl  { font-size:12px; color:rgba(255,255,255,.38); margin-top:2px; }
        .kpi-chg  { font-size:11.5px; font-weight:500; margin-top:5px; }
        .kpi-chg.up   { color:#10b981; }
        .kpi-chg.down { color:#ef4444; }

        /* main chart */
        .card {
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:16px; padding:22px;
        }

        .chart-tabs { display:flex; gap:6px; flex-wrap:wrap; }
        .chart-tab {
          padding:6px 14px; border-radius:8px; font-size:12.5px; font-weight:500;
          color:rgba(255,255,255,.38); cursor:pointer; border:none; background:transparent;
          transition:all .2s;
        }
        .chart-tab.active { color:#fff; }

        /* line chart */
        .line-chart-wrap { position:relative; height:180px; margin-top:20px; }

        .y-labels {
          position:absolute; left:0; top:0; bottom:20px;
          display:flex; flex-direction:column; justify-content:space-between;
          width:48px;
        }
        .y-lbl { font-size:10px; color:rgba(255,255,255,.22); text-align:right; padding-right:6px; }

        .chart-area {
          position:absolute; left:54px; right:0; top:0; bottom:20px;
          display:flex; align-items:flex-end; gap:0;
        }

        .grid-lines {
          position:absolute; left:54px; right:0; top:0; bottom:20px;
          display:flex; flex-direction:column; justify-content:space-between; pointer-events:none;
        }
        .grid-line { width:100%; height:1px; background:rgba(255,255,255,.05); }

        .line-col {
          flex:1; height:100%; display:flex; flex-direction:column;
          align-items:center; justify-content:flex-end; gap:5px;
          cursor:pointer; position:relative;
        }

        .line-bar {
          width:100%; border-radius:3px 3px 0 0;
          transition:opacity .2s;
          position:relative;
        }
        .line-bar::after {
          content:''; position:absolute; top:-5px; left:50%; transform:translateX(-50%);
          width:8px; height:8px; border-radius:50%;
          background:var(--bar-color);
          border:2px solid #07070e;
          opacity:0; transition:opacity .2s;
        }
        .line-col:hover .line-bar::after,
        .line-col.hovered .line-bar::after { opacity:1; }

        .tooltip-box {
          position:absolute; top:-44px; left:50%; transform:translateX(-50%);
          background:#1e1e2e; border:1px solid rgba(255,255,255,.12);
          border-radius:7px; padding:5px 10px;
          font-size:12px; color:#fff; white-space:nowrap;
          pointer-events:none; z-index:10;
          opacity:0; transition:opacity .15s;
        }
        .line-col:hover .tooltip-box,
        .line-col.hovered .tooltip-box { opacity:1; }

        .x-lbl { font-size:10px; color:rgba(255,255,255,.25); }

        /* two-col */
        .two-col { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:22px; }
        @media (max-width:900px) { .two-col { grid-template-columns:1fr; } }

        /* donut */
        .donut-wrap { display:flex; align-items:center; gap:20px; }
        .donut-legend { display:flex; flex-direction:column; gap:8px; flex:1; }
        .legend-row { display:flex; align-items:center; gap:8px; }
        .legend-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .legend-lbl { font-size:12.5px; color:rgba(255,255,255,.6); flex:1; }
        .legend-pct { font-size:12.5px; font-weight:600; color:#fff; }
        .legend-bar-wrap { height:3px; background:rgba(255,255,255,.07); border-radius:2px; width:100%; margin-top:2px; }
        .legend-bar-fill { height:100%; border-radius:2px; }

        /* table */
        .table-wrap { overflow-x:auto; }
        table { width:100%; border-collapse:collapse; }
        th { text-align:left; font-size:11px; font-weight:600; letter-spacing:.8px; text-transform:uppercase; color:rgba(255,255,255,.22); padding:0 12px 12px; border-bottom:1px solid rgba(255,255,255,.06); }
        td { padding:11px 12px; font-size:13.5px; color:rgba(255,255,255,.65); border-bottom:1px solid rgba(255,255,255,.04); }
        tr:last-child td { border-bottom:none; }
        tr:hover td { background:rgba(255,255,255,.02); }

        .pill {
          display:inline-flex; align-items:center; padding:3px 9px;
          border-radius:20px; font-size:11.5px; font-weight:500;
        }
        .pill-good { background:rgba(16,185,129,.12); color:#10b981; }
        .pill-mid  { background:rgba(245,158,11,.12); color:#f59e0b; }
        .pill-bad  { background:rgba(239,68,68,.1);   color:#ef4444; }

        .progress-cell { display:flex; align-items:center; gap:8px; }
        .progress-bg   { flex:1; height:4px; background:rgba(255,255,255,.07); border-radius:2px; min-width:80px; }
        .progress-fill { height:100%; border-radius:2px; background:#6366f1; }

        .card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .card-title  { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#fff; }
        .card-sub    { font-size:12px; color:rgba(255,255,255,.3); margin-top:3px; }
        .card-action { font-size:12px; color:#6366f1; cursor:pointer; background:none; border:none; text-decoration:none; }
        .card-action:hover { color:#818cf8; }

        .mb-22 { margin-bottom:22px; }
        .section-divider { display:flex; align-items:center; gap:10px; margin:24px 0 18px; }
        .section-divider-line { flex:1; height:1px; background:rgba(255,255,255,.06); }
        .section-divider-label { font-family:'Syne',sans-serif; font-size:12px; font-weight:600; color:rgba(255,255,255,.25); letter-spacing:1px; text-transform:uppercase; }
      `}</style>

      <div className="page-wrapper">
        <Sidebar />

        <main className="main-content">

          {/* Topbar */}
          <div className="topbar">
            <div>
              <div className="page-title">Statistik</div>
              <div className="page-sub">Analitik & performa platform secara keseluruhan</div>
            </div>
            <div className="range-tabs">
              {['7D','1M','3M','6M','12M'].map(r => (
                <button key={r} className={`range-btn ${range===r?'active':''}`} onClick={()=>setRange(r)}>{r}</button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="kpi-grid">
            {kpiCards.map((k,i) => (
              <div key={i} className="kpi-card">
                <div className="kpi-emoji" style={{ background: k.bg }}>{k.icon}</div>
                <div>
                  <div className="kpi-val">{k.value}</div>
                  <div className="kpi-lbl">{k.label}</div>
                  <div className={`kpi-chg ${k.up?'up':'down'}`}>
                    {k.up ? '▲' : '▼'} {k.change} vs periode lalu
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Line / Bar Chart */}
          <div className="card mb-22">
            <div className="card-header">
              <div>
                <div className="card-title">Tren Bulanan</div>
                <div className="card-sub">Data {range} terakhir</div>
              </div>
              <div className="chart-tabs">
                {TABS.map((t,i) => (
                  <button
                    key={i}
                    className={`chart-tab ${activeTab===i?'active':''}`}
                    style={activeTab===i ? { background: `${TAB_COLORS[i]}22`, color: TAB_COLORS[i] } : {}}
                    onClick={()=>{ setActiveTab(i); setHoverIdx(null); }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="line-chart-wrap">
              {/* Grid lines */}
              <div className="grid-lines">
                {[0,1,2,3,4].map(i => <div key={i} className="grid-line" />)}
              </div>

              {/* Y Labels */}
              <div className="y-labels">
                {[maxVal, Math.round(maxVal*0.75), Math.round(maxVal*0.5), Math.round(maxVal*0.25), 0].map((v,i) => (
                  <span key={i} className="y-lbl">{v}</span>
                ))}
              </div>

              {/* Bars */}
              <div className="chart-area">
                {norm.map((h, i) => (
                  <div
                    key={i}
                    className={`line-col ${hoverIdx===i?'hovered':''}`}
                    onMouseEnter={() => setHoverIdx(i)}
                    onMouseLeave={() => setHoverIdx(null)}
                  >
                    <div className="tooltip-box">
                      {monthLabels[i]}: {chartData[i]} {chartLabel}
                    </div>
                    <div
                      className="line-bar"
                      style={{
                        height: `${h}%`,
                        background: hoverIdx===i
                          ? chartColor
                          : `${chartColor}40`,
                        '--bar-color': chartColor,
                      }}
                    />
                    <span className="x-lbl">{monthLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traffic + Device */}
          <div className="two-col">

            {/* Traffic Sources Donut */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Traffic Sources</div>
                  <div className="card-sub">Asal pengunjung platform</div>
                </div>
              </div>
              <div className="donut-wrap">
                <DonutChart segments={trafficSources} size={130} thickness={22} />
                <div className="donut-legend">
                  {trafficSources.map((s,i) => (
                    <div key={i}>
                      <div className="legend-row">
                        <span className="legend-dot" style={{ background: s.color }} />
                        <span className="legend-lbl">{s.label}</span>
                        <span className="legend-pct">{s.value}%</span>
                      </div>
                      <div className="legend-bar-wrap">
                        <div className="legend-bar-fill" style={{ width:`${s.value/totalTraffic*100}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Device Breakdown</div>
                  <div className="card-sub">Perangkat yang digunakan</div>
                </div>
              </div>
              <div className="donut-wrap">
                <DonutChart segments={deviceData} size={130} thickness={22} />
                <div style={{ flex:1 }}>
                  {deviceData.map((d,i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                        <span style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:'rgba(255,255,255,.65)' }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background:d.color, display:'inline-block' }} />
                          {d.label}
                        </span>
                        <span style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{d.value}%</span>
                      </div>
                      <div style={{ height:5, background:'rgba(255,255,255,.06)', borderRadius:3 }}>
                        <div style={{ height:'100%', width:`${d.value}%`, background:d.color, borderRadius:3, transition:'width .6s ease' }} />
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop:18, padding:'12px', background:'rgba(255,255,255,.03)', borderRadius:10, border:'1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:4 }}>Total Page Views</div>
                    <div style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'#fff' }}>2,841,230</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Pages Table */}
          <div className="section-divider">
            <div className="section-divider-line" />
            <span className="section-divider-label">Halaman Teratas</span>
            <div className="section-divider-line" />
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Top Pages by Views</div>
                <div className="card-sub">Halaman paling banyak dikunjungi bulan ini</div>
              </div>
              <a href="#" className="card-action">Export CSV →</a>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Halaman</th>
                    <th>Views</th>
                    <th>Traffic Share</th>
                    <th>Bounce Rate</th>
                    <th>Avg. Time</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((p,i) => {
                    const share = ((p.views / topPages.reduce((a,x)=>a+x.views,0)) * 100).toFixed(1);
                    const bounceNum = parseInt(p.bounce);
                    const bounceClass = bounceNum < 30 ? 'pill-good' : bounceNum < 40 ? 'pill-mid' : 'pill-bad';
                    return (
                      <tr key={i}>
                        <td style={{ color:'rgba(255,255,255,.25)', width:32 }}>{i+1}</td>
                        <td style={{ color:'#818cf8', fontFamily:'monospace', fontSize:13 }}>{p.page}</td>
                        <td style={{ color:'#fff', fontWeight:500 }}>{p.views.toLocaleString()}</td>
                        <td>
                          <div className="progress-cell">
                            <div className="progress-bg">
                              <div className="progress-fill" style={{ width:`${share}%` }} />
                            </div>
                            <span style={{ fontSize:12, color:'rgba(255,255,255,.4)', width:36 }}>{share}%</span>
                          </div>
                        </td>
                        <td><span className={`pill ${bounceClass}`}>{p.bounce}</span></td>
                        <td>{p.avg}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}