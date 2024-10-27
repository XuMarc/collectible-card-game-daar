import React, { useState, useEffect } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface Card {
  id: string;
  uri: string;
}

const Users = (props: any) => {
  const [selectedUser, setSelectedUser] = useState<string>(''); 
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [message, setMessage] = useState<string>('');

  const fetchUserCards = async (user: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/getUserCards/${user}`);
      
      setUserCards(response.data.cards);
      console.log("FETCHED CARDS /USERS : ",response.data.cards);
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes de l\'utilisateur:', error);
      setMessage('Erreur lors de la récupération des cartes.');
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserCards(selectedUser);
    }
  }, [selectedUser]);

  return (
    <div className="users-page bg-gray-800 min-h-screen flex flex-col items-center justify-center text-center p-8 text-white">
      <h2 className="text-5xl font-bold mb-4">Utilisateurs</h2>
      
      <div className="w-full max-w-lg mb-8">
        <h3 className="text-2xl mb-4">Sélectionnez un utilisateur :</h3>
        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
        >
          <option value={selectedUser}>Sélectionnez un utilisateur</option>
          {props.users.map(user => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && userCards.length > 0 && (
        <div className="cards-section w-full max-w-4xl">
          <h3 className="text-3xl font-semibold mb-6">Cartes de l'utilisateur {selectedUser}</h3>
          <div className="cards-container flex flex-wrap justify-center">
            {userCards.map((card, index) => (
              <div key={index} className="card-item bg-gray-700 border border-gray-600 rounded-lg p-4 m-2" style={{ width: '150px' }}>
                <img src={card[2]} alt="Card Image" className="w-full h-auto mb-4 rounded-lg transition-transform duration-300 hover:scale-105" />
                <p className="text-xl">{card[1]}</p>
                <p className="text-sm">Token ID: {card[0].hex}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
};

export default Users;
