import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { performAddMoney } from '../services/api';

export default function AddMoneyModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('1000');
  const [source, setSource] = useState('SBI Linked Account');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await performAddMoney({ amount, source });
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      onSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="clean-modal-overlay">
      <div className="clean-modal-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-green)' }}>
            Add Money (Deposit)
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'var(--color-green-light)', 
            border: '1px solid var(--color-green)', 
            color: 'var(--color-green)', 
            padding: '10px 14px', 
            borderRadius: '10px', 
            fontWeight: '700',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="clean-label">Deposit Amount (₹)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {['500', '1000', '2000', '5000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: amount === amt ? 'var(--color-green)' : 'var(--bg-card-border)',
                    backgroundColor: amount === amt ? 'var(--color-green-light)' : 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <input 
              type="number"
              className="clean-input"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="1"
              min="1"
              required
            />
          </div>

          <div>
            <label className="clean-label">Deposit Source</label>
            <select
              className="clean-input"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="SBI Bank Account">SBI Linked Account</option>
              <option value="HDFC NetBanking">HDFC NetBanking</option>
              <option value="Pension Payout">Monthly Pension</option>
            </select>
          </div>

          <button type="submit" className="btn-action btn-green" style={{ marginTop: '8px' }}>
            <Plus size={20} />
            <span>Deposit +₹{amount || '0'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
