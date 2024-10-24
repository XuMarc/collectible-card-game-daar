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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddUser = () => {
    if (newUser) {
      addUser(newUser);
      setSelectedUser(newUser); // Sélectionne l'utilisateur par défaut
      setNewUser('');
      setIsModalOpen(false); // Ferme le modal
    }
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 shadow-lg flex justify-between items-center">
        <div className="flex space-x-4">
          <Link className="text-xl font-bold hover:text-yellow-500 transition" to="/">Accueil</Link>
          <Link className="text-xl font-bold hover:text-yellow-500 transition" to="/users">Utilisateurs</Link>
          <Link className="text-xl font-bold hover:text-yellow-500 transition" to="/collections">Collections</Link>
          <Link className="text-xl font-bold hover:text-yellow-500 transition" to="/mint">Mint</Link>
        </div>

        <div className="flex space-x-4 items-center">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-yellow-500 px-4 py-2 rounded-md text-black font-bold hover:bg-yellow-600 transition"
          >
            Ajouter Utilisateur
          </button>
        </div>

        {users.length > 0 && (
          <div className="ml-4">
            <select 
              onChange={(e) => setSelectedUser(e.target.value)} 
              value={selectedUser}
              className="px-2 py-1 rounded-md border-2 border-yellow-500 bg-gray-700 text-white focus:outline-none"
            >
              <option value="">Sélectionnez un utilisateur</option>
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
        )}
      </nav>

      {/* Modal pour ajouter un utilisateur */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Ajouter un nouvel utilisateur</h2>
            <input 
              type="text" 
              value={newUser} 
              onChange={(e) => setNewUser(e.target.value)} 
              placeholder="Entrez l'adresse utilisateur"
              className="px-2 py-1 rounded-md border-2 border-yellow-500 bg-gray-200 focus:outline-none mb-4"
            />
            <div className="flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Annuler
              </button>
              <button 
                onClick={handleAddUser} 
                className="bg-yellow-500 text-black px-4 py-2 rounded-md"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
