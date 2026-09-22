import React, { useState, useEffect } from 'react';
import HeaderBar from './components/HeaderBar';
import BalanceCard from './components/BalanceCard';
import ActionButtons from './components/ActionButtons';
import TransactionHistory from './components/TransactionHistory';
import SendMoneyModal from './components/SendMoneyModal';
import AddMoneyModal from './components/AddMoneyModal';
import SeniorCardModal from './components/SeniorCardModal';
import BackendSettingsModal from './components/BackendSettingsModal';
import LoginModal from './components/LoginModal';
import { getAppState } from './services/api';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // App State
  const [state, setState] = useState(getAppState());

  // Modal Controls
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const refreshState = () => {
    setState(getAppState());
  };

  return (
    <div className={`app-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="mobile-frame">
        {/* Top Navbar */}
        <HeaderBar 
          theme={theme}
          setTheme={setTheme}
          onOpenBackendSettings={() => setIsSettingsOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onStateUpdate={(newState) => setState(newState)}
          balance={state.balance}
          user={state.user}
        />

        {/* App Main Body */}
        <div className="app-body">
          {/* Welcome User Greeting */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
                Welcome, {state.user.name || 'Mary Morgan'} 👋
              </h1>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>
                User ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-green)' }}>{state.user.userID || 100000001}</span>
              </p>
            </div>
          </div>

          {/* Clean Balance Display */}
          <BalanceCard balance={state.balance} user={state.user} />

          {/* 3 Clear Action Buttons */}
          <ActionButtons 
            onOpenSend={() => setIsSendOpen(true)}
            onOpenAdd={() => setIsAddOpen(true)}
            onOpenCard={() => setIsCardOpen(true)}
          />

          {/* Recent Activity Feed */}
          <TransactionHistory transactions={state.transactions} />
        </div>

        {/* Modals */}
        <SendMoneyModal 
          isOpen={isSendOpen}
          onClose={() => setIsSendOpen(false)}
          onSuccess={refreshState}
        />

        <AddMoneyModal 
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={refreshState}
        />

        <SeniorCardModal 
          isOpen={isCardOpen}
          onClose={() => setIsCardOpen(false)}
          card={state.card}
          onCardUpdate={refreshState}
        />

        <BackendSettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <LoginModal 
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSuccess={refreshState}
        />
      </div>
    </div>
  );
}
