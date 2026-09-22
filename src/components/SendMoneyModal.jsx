import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { performSendMoney } from '../services/api';

const SAMPLE_USER_IDS = [
  { name: 'Ramesh (ID: 100000002)', id: '100000002' },
  { name: 'Priya (ID: 100000003)', id: '100000003' },
  { name: 'Pharmacy (ID: 100000004)', id: '100000004' },
];

export default function SendMoneyModal({ isOpen, onClose, onSuccess }) {
  const [payid, setPayid] = useState('100000002');
  const [amount, setAmount] = useState('500');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await performSendMoney({
        payid: payid,
        amount: amount,
        note: note,
      });

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
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-red)' }}>
            Send Money (Pay ID)
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'var(--color-red-light)', 
            border: '1px solid var(--color-red)', 
            color: 'var(--color-red)', 
            padding: '10px 14px', 
            borderRadius: '10px', 
            fontWeight: '700',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="clean-label">Recipient User ID (`payid`)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {SAMPLE_USER_IDS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setPayid(c.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: payid === c.id ? 'var(--color-red)' : 'var(--bg-card-border)',
                    backgroundColor: payid === c.id ? 'var(--color-red-light)' : 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <input 
              type="number"
              className="clean-input"
              placeholder="e.g. 100000002"
              value={payid}
              onChange={(e) => setPayid(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="clean-label">Amount (₹)</label>
            <input 
              type="number"
              className="clean-input"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="1"
              min="1"
              required
            />
          </div>

          <div>
            <label className="clean-label">Note / Reference (Optional)</label>
            <input 
              type="text"
              className="clean-input"
              placeholder="Reason for payment"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-action btn-red" style={{ marginTop: '8px' }}>
            <Send size={20} />
            <span>Confirm & Transfer ₹{amount || '0'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
