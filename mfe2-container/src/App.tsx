import React, { useState } from 'react';
import './styles.css';

interface UserContext {
  username: string;
  roles: string[];
  name: string;
}

interface AppProps {
  userContext?: UserContext;
}

const App: React.FC<AppProps> = ({ userContext }) => {
  const [showGold, setShowGold] = useState(false);

  return (
    <div className="irish-theme">
      <div className="celtic-knot" />
      <h1>🍀 Welcome to the Emerald Realm 🍀</h1>
      <p>
        Step into a world of myth and magic.
        Here lies the ancient knowledge of the Tuatha Dé Danann.
      </p>

      {userContext ? (
        <div className="leprechaun-message">
          <p>Greetings, traveler <strong>{userContext.name}</strong>!</p>
          <p>You have been granted access to the secret grove.</p>
        </div>
      ) : (
        <div className="leprechaun-message">
          <p>Beware, stranger! The spirits are watching you.</p>
        </div>
      )}

      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#FFD700',
          color: '#004d25',
          border: 'none',
          borderRadius: '5px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
        onClick={() => setShowGold(!showGold)}
      >
        {showGold ? 'Hide the Pot of Gold' : 'Find the Pot of Gold'}
      </button>

      {showGold && (
        <div style={{ marginTop: '20px', fontSize: '3rem', animation: 'bounce 1s infinite' }}>
          💰💰💰🌈💰💰💰
        </div>
      )}

      <div className="celtic-knot" />
    </div>
  );
};

export default App;
