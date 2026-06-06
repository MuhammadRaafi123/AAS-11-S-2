'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  {
    label: 'Dashboard',
    href: '/super_admin/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Statistik',
    href: '/super_admin/statistic',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    label: 'Management User',
    href: '/super_admin/management-user',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/landing/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: ${collapsed ? '72px' : '240px'};
          background: #0a0a0f;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
        }

        .sidebar-header {
          padding: ${collapsed ? '24px 16px' : '24px 20px'};
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          min-height: 72px;
        }

        .logo-mark {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.35);
        }

        .logo-mark span {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          white-space: nowrap;
          opacity: ${collapsed ? '0' : '1'};
          transition: opacity 0.2s ease;
        }

        .logo-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: #fff;
          line-height: 1.2;
          letter-spacing: 0.5px;
        }

        .logo-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        .nav-section {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.2);
          padding: ${collapsed ? '8px 0 8px 0' : '8px 20px'};
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-align: ${collapsed ? 'center' : 'left'};
          opacity: ${collapsed ? '0' : '1'};
          height: ${collapsed ? '0' : 'auto'};
          transition: opacity 0.2s ease;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: ${collapsed ? '12px 0' : '11px 16px'};
          margin: 2px ${collapsed ? '8px' : '10px'};
          border-radius: 10px;
          cursor: pointer;
          text-decoration: none;
          color: rgba(255,255,255,0.45);
          transition: all 0.2s ease;
          position: relative;
          white-space: nowrap;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          overflow: hidden;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.85);
        }

        .nav-item.active {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: #6366f1;
          border-radius: 0 2px 2px 0;
        }

        .nav-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-text {
          font-size: 13.5px;
          font-weight: 500;
          opacity: ${collapsed ? '0' : '1'};
          transition: opacity 0.15s ease;
          pointer-events: none;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: background 0.2s;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
        }

        .user-card:hover {
          background: rgba(255,255,255,0.06);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
          flex-shrink: 0;
        }

        .user-info {
          overflow: hidden;
          opacity: ${collapsed ? '0' : '1'};
          transition: opacity 0.2s ease;
          flex: 1;
        }

        .user-name {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          white-space: nowrap;
        }

        .logout-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
          padding: ${collapsed ? '10px 0' : '10px 12px'};
          border-radius: 10px;
          cursor: pointer;
          color: rgba(255,255,255,0.55);
          transition: all 0.2s ease;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          white-space: nowrap;
        }

        .logout-item:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        .logout-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .logout-text {
          font-size: 13px;
          font-weight: 500;
          opacity: ${collapsed ? '0' : '1'};
          transition: opacity 0.15s ease;
        }

        .collapse-btn {
          position: absolute;
          top: 22px;
          right: -12px;
          width: 24px;
          height: 24px;
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          transition: all 0.2s ease;
          z-index: 10;
        }

        .collapse-btn:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.3);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 72px;
          }
          .nav-text, .logo-text, .user-info, .nav-label, .logout-text {
            display: none;
          }
          .nav-item {
            justify-content: center;
          }
          .user-card {
            justify-content: center;
          }
          .logout-item {
            justify-content: center;
          }
        }
      `}</style>

      <aside className="sidebar">
        {/* Collapse toggle */}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Header / Logo */}
        <div className="sidebar-header">
          <div className="logo-mark">
            <span>SA</span>
          </div>
          <div className="logo-text">
            <span className="logo-title">SuperAdmin</span>
            <span className="logo-sub">Control Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-section">
          <div className="nav-label">Main Menu</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer with User Card + Logout */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-role">Super Administrator</div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="logout-item" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Keluar</span>
          </div>
        </div>
      </aside>
    </>
  );
}