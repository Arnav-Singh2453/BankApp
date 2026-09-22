import React from 'react';
import { Send, Plus, CreditCard } from 'lucide-react';

export default function ActionButtons({ onOpenSend, onOpenAdd, onOpenCard }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <button 
        className="btn-action btn-red"
        onClick={onOpenSend}
      >
        <Send size={22} />
        <span>Send Money</span>
      </button>

      <button 
        className="btn-action btn-green"
        onClick={onOpenAdd}
      >
        <Plus size={24} />
        <span>Add Money</span>
      </button>

      <button 
        className="btn-action btn-dark"
        onClick={onOpenCard}
      >
        <CreditCard size={22} />
        <span>My Debit Card</span>
      </button>
    </div>
  );
}
