import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';

export default function BalanceCard({ balance, user }) {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyIban = () => {
    navigator.clipboard.writeText(user.iban || 'IN89 EASY 4092 8840 5512');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedBalance = `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="clean-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-secondary)' }}>
          TOTAL BALANCE
        </span>
        <button 
          className="icon-btn"
          onClick={() => setShowBalance(!showBalance)}
          style={{ width: '32px', height: '32px' }}
        >
          {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-main)', margin: '8px 0 16px 0' }}>
        {showBalance ? formattedBalance : '••••••••'}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingTop: '14px', 
        borderTop: '1px solid var(--bg-card-border)' 
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>Account Number / UPI</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '14px' }}>
            {user.accountNumber || '4092-8840-5512'}
          </div>
        </div>

        <button 
          onClick={handleCopyIban}
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            padding: '6px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '700'
          }}
        >
          {copied ? <Check size={14} color="var(--color-green)" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy Account'}</span>
        </button>
      </div>
    </div>
  );
}
