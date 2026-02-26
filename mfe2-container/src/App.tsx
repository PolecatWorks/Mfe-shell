import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './styles.css';

interface UserContext {
  username: string;
  roles: string[];
  name: string;
}

interface AppProps {
  userContext?: UserContext;
  setContext?: (context: UserContext) => void;
}

// Mock Data for Irish Mythology
const CHARACTERS = [
  { id: '1', name: 'Cú Chulainn', title: 'The Hound of Ulster', description: 'A legendary Irish hero and demigod, known for his terrifying battle frenzy (ríastrad).' },
  { id: '2', name: 'Fionn mac Cumhaill', title: 'Leader of the Fianna', description: 'A mythical hunter-warrior of Irish mythology, occurring also in the mythologies of Scotland and the Isle of Man.' },
  { id: '3', name: 'The Morrígan', title: 'The Phantom Queen', description: 'A figure from Irish mythology who appears to have been mainly associated with war and fate, especially with foretelling doom, death or victory in battle.' },
  { id: '4', name: 'Lugh', title: 'The Long-Arm', description: 'A prominent god in Irish mythology, member of the Tuatha Dé Danann, associated with skill, crafts, and warfare.' }
];

const Home = ({ userContext }: { userContext?: UserContext }) => {
  const [showGold, setShowGold] = useState(false);
  const navigate = useNavigate();

  return (
    <>
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

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <button
          className="emerald-btn"
          onClick={() => setShowGold(!showGold)}
        >
          {showGold ? 'Hide the Pot of Gold' : 'Find the Pot of Gold'}
        </button>
        <button
          className="emerald-btn"
          onClick={() => navigate('/characters')}
        >
          View Mythological Figures
        </button>
      </div>

      {showGold && (
        <div style={{ marginTop: '20px', fontSize: '3rem', animation: 'bounce 1s infinite' }}>
          💰💰💰🌈💰💰💰
        </div>
      )}

      <div className="celtic-knot" />
    </>
  );
};

const CharacterList = ({ setContext, userContext }: { setContext?: (context: UserContext) => void, userContext?: UserContext }) => {
  const navigate = useNavigate();

  const handleSelectCharacter = (character: any) => {
    navigate(`/characters/${character.id}`);
  };

  const handleSetUser = (e: React.MouseEvent, character: any) => {
    e.stopPropagation();
    if (setContext) {
      setContext({
        username: character.name.toLowerCase().replace(/ /g, '_'),
        roles: ['MYTHICAL_FIGURE'],
        name: character.name
      });
    }
  };

  return (
    <div className="character-view">
      <h2>📜 Figures of Legend 📜</h2>
      <p>Select a hero or deity to learn about their legend, and assume their mantle.</p>

      <div className="character-list">
        {CHARACTERS.map(char => (
          <div key={char.id} className="character-card" onClick={() => handleSelectCharacter(char)}>
            <h3>{char.name}</h3>
            <p><em>{char.title}</em></p>
            <button
              className="emerald-btn"
              style={{ marginTop: '10px', fontSize: '1rem', padding: '5px 10px' }}
              onClick={(e) => handleSetUser(e, char)}
            >
              Set as User
            </button>
          </div>
        ))}
      </div>

      <button className="emerald-btn" onClick={() => navigate('/')}>
        Back to the Grove
      </button>
    </div>
  );
};

const CharacterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const character = CHARACTERS.find(c => c.id === id);

  if (!character) {
    return <div>Character not found lost to the mists of time...</div>;
  }

  return (
    <div className="character-view">
      <h2>{character.name}</h2>
      <h3>{character.title}</h3>
      <div className="leprechaun-message" style={{ textAlign: 'left' }}>
        <p>{character.description}</p>
      </div>

      <button className="emerald-btn" onClick={() => navigate('/characters')}>
        Back to the Legend Index
      </button>
    </div>
  );
};

const App: React.FC<AppProps> = ({ userContext, setContext }) => {
  return (
    <div className="irish-theme">
      <BrowserRouter basename="/home/mfe2">
        <Routes>
          <Route path="/" element={<Home userContext={userContext} />} />
          <Route path="/characters" element={<CharacterList setContext={setContext} userContext={userContext} />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
