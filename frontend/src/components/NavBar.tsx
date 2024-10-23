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

const Users = ({ users }: { users: string[] }) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [message, setMessage] = useState<string>('');

  const fetchUserCards = async (user: string) => {
    try {
      // Récupère les cartes d'un utilisateur
      const response = await axios.get(`http://localhost:3001/getUserCards/${user}`);
      
      // Supposons que la réponse contienne un tableau de cartes directement
      setUserCards(response.data.cards);
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes de l\'utilisateur:', error);
      setMessage('Erreur lors de la récupération des cartes.');
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserCards(selectedUser); // Récupère les cartes lorsque l'utilisateur est sélectionné
      // console.log("ADJKLZANFDKSLLD : ",userCards[0][1]);
    }
  }, [selectedUser]);

  const mapCardData = (cardArray: any[]) => {
    return {
      id: cardArray[0].hex, // Accès à l'ID (BigNumber)
      name: cardArray[1],   // Nom de la carte
      uri: cardArray[2],    // URI de la carte
    };
  };
  
  return (
    <div>
      <h2>Utilisateurs</h2>
      <div>
        <h3>Sélectionnez un utilisateur :</h3>
        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="">Sélectionnez un utilisateur</option>
          {users.map(user => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && userCards.length > 0 && (
        <div>
          <h3>Cartes de l'utilisateur {selectedUser}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {userCards.map((card) => (
              <div key={card.id} style={{ margin: '10px', border: '1px solid #ddd', padding: '10px' }}>
                <img src={card[2]} alt="Card Image" style={{ width: '100px', height: 'auto' }} />
                <p>{card[1]}</p>
                <p>Token ID: {card[0].hex}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Users;
