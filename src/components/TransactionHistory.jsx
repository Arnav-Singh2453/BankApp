import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function TransactionHistory({ transactions }) {
  return (
    <div className="clean-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
          Recent Activity
        </h3>
      </div>

      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '14px' }}>
          No transactions yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--bg-card-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: isIncome ? 'var(--color-green-light)' : 'var(--color-red-light)',
                    color: isIncome ? 'var(--color-green)' : 'var(--color-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>

                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>
                      {tx.title}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>
                      {tx.date}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  fontWeight: '800', 
                  fontSize: '16px', 
                  color: isIncome ? 'var(--color-green)' : 'var(--color-red)' 
                }}>
                  {isIncome ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
