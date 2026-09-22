import React from 'react';
import { X, Lock, Unlock } from 'lucide-react';
import { toggleSeniorCardFreeze } from '../services/api';

export default function SeniorCardModal({ isOpen, onClose, card, onCardUpdate }) {
  if (!isOpen) return null;

  const handleToggleFreeze = () => {
    const updatedCard = toggleSeniorCardFreeze();
    onCardUpdate(updatedCard);
  };

  return (
    <div className="clean-modal-overlay">
      <div className="clean-modal-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
            My Debit Card
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Clean Debit Card */}
        <div style={{
          background: card.isFrozen ? '#334155' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '20px',
          padding: '24px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '1px' }}>DEBIT CARD</span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '12px',
              backgroundColor: card.isFrozen ? 'var(--color-red)' : 'var(--color-green)',
              fontWeight: '800',
              fontSize: '12px'
            }}>
              {card.isFrozen ? 'FROZEN' : 'ACTIVE'}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>CARD NUMBER</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: '700', letterSpacing: '1.5px' }}>
              {card.cardNumber || '4532 8810 9940 3312'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>HOLDER</div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>{card.cardholderName || 'MARY MORGAN'}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>EXPIRES</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '14px' }}>{card.expiry || '12/28'}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>CVV</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '14px' }}>{card.cvv || '542'}</div>
            </div>
          </div>
        </div>

        {/* Freeze / Unfreeze Button */}
        <div>
          <button
            onClick={handleToggleFreeze}
            className={`btn-action ${card.isFrozen ? 'btn-green' : 'btn-red'}`}
          >
            {card.isFrozen ? <Unlock size={20} /> : <Lock size={20} />}
            <span>{card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
