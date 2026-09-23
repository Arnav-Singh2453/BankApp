import React, { useState } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { loginUser, signupUser } from '../services/api';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [uname, setUname] = useState('');
  const [pass, setPass] = useState('');
  
  // Signup fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const result = await signupUser({ name, age, phone, pass });
        setUname(String(result.userID || ''));
        setPass('');
        setIsSignup(false);
        setSuccess(`Account created. Your User ID is ${result.userID}. Use it to log in.`);
        return;
      } else {
        await loginUser({ uname, pass });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="clean-modal-overlay">
      <div className="clean-modal-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
            {isSignup ? 'Create Account' : 'Account Login'}
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

        {success && (
          <div style={{
            backgroundColor: 'var(--color-green-light)',
            border: '1px solid var(--color-green)',
            color: 'var(--color-green)',
            padding: '10px 14px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isSignup ? (
            <>
              <div>
                <label className="clean-label">Full Name</label>
                <input 
                  type="text"
                  className="clean-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="clean-label">Age</label>
                <input 
                  type="number"
                  className="clean-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="clean-label">Phone Number</label>
                <input 
                  type="tel"
                  className="clean-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="clean-label">Password (`pass`)</label>
                <input 
                  type="password"
                  className="clean-input"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="clean-label">User ID</label>
                <input 
                  type="number"
                  className="clean-input"
                  value={uname}
                  onChange={(e) => setUname(e.target.value)}
                  placeholder="e.g. 100000001"
                  required
                />
              </div>

              <div>
                <label className="clean-label">Password (`pass`)</label>
                <input 
                  type="password"
                  className="clean-input"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn-action btn-green"
            disabled={isSubmitting}
            style={{ marginTop: '8px' }}
          >
            {isSignup ? <UserPlus size={20} /> : <LogIn size={20} />}
            <span>{isSubmitting ? 'Processing...' : (isSignup ? 'Register New Account' : 'Log In')}</span>
          </button>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-green)',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
