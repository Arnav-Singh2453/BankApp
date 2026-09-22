import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getApiConfig, saveApiConfig, testBackendPing } from '../services/api';

export default function BackendSettingsModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(getApiConfig());
  const [pingResult, setPingResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveApiConfig(config);
    setSaveMessage('Saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleTestPing = async () => {
    setIsTesting(true);
    setPingResult(null);
    const result = await testBackendPing(config.baseUrl);
    setPingResult(result);
    setIsTesting(false);
  };

  return (
    <div className="clean-modal-overlay">
      <div className="clean-modal-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
            Backend API Settings
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {saveMessage && (
          <div style={{ 
            backgroundColor: 'var(--color-green-light)', 
            border: '1px solid var(--color-green)', 
            color: 'var(--color-green)', 
            padding: '10px', 
            borderRadius: '10px', 
            fontWeight: '700',
            fontSize: '14px'
          }}>
            {saveMessage}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="clean-label">Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setConfig({ ...config, useMockData: true })}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: config.useMockData ? 'var(--color-green)' : 'var(--bg-card-border)',
                  backgroundColor: config.useMockData ? 'var(--color-green-light)' : 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Offline Demo
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, useMockData: false })}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: !config.useMockData ? 'var(--color-dark)' : 'var(--bg-card-border)',
                  backgroundColor: !config.useMockData ? 'var(--bg-card-border)' : 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Live Backend API
              </button>
            </div>
          </div>

          <div>
            <label className="clean-label">Backend Server URL</label>
            <input 
              type="text"
              className="clean-input"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder="http://localhost:5000/api"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleTestPing}
              className="btn-action btn-dark"
              style={{ padding: '12px', fontSize: '15px' }}
              disabled={isTesting}
            >
              <RefreshCw size={18} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>

            {pingResult && (
              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                borderRadius: '10px',
                backgroundColor: pingResult.connected ? 'var(--color-green-light)' : 'var(--color-red-light)',
                border: `1px solid ${pingResult.connected ? 'var(--color-green)' : 'var(--color-red)'}`,
                color: pingResult.connected ? 'var(--color-green)' : 'var(--color-red)',
                fontWeight: '700',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {pingResult.connected ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{pingResult.message}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-action btn-green">
            <Server size={20} />
            <span>Save Configuration</span>
          </button>
        </form>
      </div>
    </div>
  );
}
