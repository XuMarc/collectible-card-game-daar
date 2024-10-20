import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  addUser: (user: string) => void;
  setSelectedUser: (user: string) => void;
  users: string[];
  selectedUser: string;
}

function NavBar({ addUser, setSelectedUser, users, selectedUser }: NavBarProps) {
  const [newUser, setNewUser] = useState('');

  const handleAddUser = () => {
    if (newUser) {
      addUser(newUser);
      setNewUser('');
    }
  };

  return (
    <div className="navbar">
      <Link className="brand-name" to="/">Accueil</Link>
      <Link className="brand-name" to="/users">Utilisateurs</Link>
      <Link className="brand-name" to="/collections">Collections</Link>
      <Link className="brand-name" to="/mint">Mint</Link>
      <div>
        <input 
          type="text" 
          value={newUser} 
          onChange={(e) => setNewUser(e.target.value)} 
          placeholder="Ajouter une adresse utilisateur" 
        />
        <button onClick={handleAddUser}>Ajouter Utilisateur</button>
      </div>

      {users.length > 0 && (
        <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
          <option value="">Sélectionnez un utilisateur</option>
          {users.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default NavBar;
