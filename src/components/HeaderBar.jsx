import React from 'react';
import { Volume2, Sun, Moon, Settings, RefreshCw, LogIn, LogOut } from 'lucide-react';
import { speakText, resetDemoState, logoutUser } from '../services/api';

export default function HeaderBar({ 
  theme, 
  setTheme, 
  onOpenBackendSettings,
  onOpenLogin,
  onStateUpdate,
  balance,
  user
}) {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset account balance to default demo state?')) {
      const newState = resetDemoState();
      onStateUpdate(newState);
    }
  };

  const handleLogout = () => {
    const newState = logoutUser();
    onStateUpdate(newState);
  };

  return (
    <div className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '34px', 
          height: '34px', 
          borderRadius: '8px', 
          background: 'var(--text-main)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontWeight: '800',
          color: 'var(--bg-main)',
          fontSize: '18px'
        }}>
          E
        </div>
        <div>
          <span style={{ fontWeight: '800', fontSize: '18px', display: 'block', lineHeight: 1.2 }}>EasyBank</span>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
            ID: {user?.userID || 100000001}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        {/* Manual Speaker Readout button */}
        <button 
          className="icon-btn" 
          onClick={() => speakText(`Your balance is ${balance.toLocaleString('en-IN')} rupees`)}
          title="Read Balance Out Loud"
        >
          <Volume2 size={18} />
        </button>

        {/* Login / Logout */}
        <button className="icon-btn" onClick={onOpenLogin} title="Login / Switch Account">
          <LogIn size={18} />
        </button>

        {/* Contrast Theme Toggle */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Settings */}
        <button className="icon-btn" onClick={onOpenBackendSettings} title="API Backend Settings">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
