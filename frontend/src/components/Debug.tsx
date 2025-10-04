import React from 'react';
import { authService } from '../services/authService';

const Debug: React.FC = () => {
  const handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const handleShowToken = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    console.log('Token:', token);
    console.log('Username:', username);
    console.log('Is Authenticated:', authService.isAuthenticated());
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token Payload:', payload);
        console.log('Token Expiry:', new Date(payload.exp * 1000));
        console.log('Current Time:', new Date());
        console.log('Is Expired:', payload.exp < Date.now() / 1000);
      } catch (e) {
        console.log('Error decoding token:', e);
      }
    }
  };

  const handleValidateToken = async () => {
    try {
      const isValid = await authService.validateToken();
      console.log('Server validation result:', isValid);
      alert(`Token validation: ${isValid ? 'Valid' : 'Invalid'}`);
    } catch (error) {
      console.error('Validation error:', error);
      alert('Validation failed');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Debug Authentication</h3>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleShowToken} style={{ marginRight: '10px' }}>
          Show Token Info (Check Console)
        </button>
        <button onClick={handleValidateToken} style={{ marginRight: '10px' }}>
          Validate Token with Server
        </button>
        <button onClick={handleClearStorage} style={{ backgroundColor: '#ff4444', color: 'white' }}>
          Clear All Storage & Reload
        </button>
      </div>
      <div>
        <p><strong>Current Status:</strong></p>
        <p>Authenticated: {authService.isAuthenticated() ? 'Yes' : 'No'}</p>
        <p>Username: {authService.getUsername() || 'None'}</p>
        <p>Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default Debug;