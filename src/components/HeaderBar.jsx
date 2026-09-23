import React from 'react';
import { Volume2, Sun, Moon, Settings, LogIn } from 'lucide-react';
import { speakText } from '../services/api';

export default function HeaderBar({ 
  theme, 
  setTheme, 
  onOpenBackendSettings,
  onOpenLogin,
  balance = 0,
  user = {}
}) {
  const safeBalance = typeof balance === 'number' && !isNaN(balance) ? balance : 0;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
            ID: {user?.userID || 'Not signed in'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        {/* Manual Speaker Readout button */}
        <button 
          className="icon-btn" 
          onClick={() => speakText(`Your balance is ${safeBalance.toLocaleString('en-IN')} rupees`)}
          title="Read Balance Out Loud"
        >
          <Volume2 size={18} />
        </button>

        {/* Login / Switch Account */}
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
