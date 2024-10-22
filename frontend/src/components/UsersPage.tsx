import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
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

interface UserCards {
  collectionId: string;
  cards: Card[];
}

const Users = ({ users }: { users: string[] }) => {
//   const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userCards, setUserCards] = useState<UserCards[]>([]);
  const [message, setMessage] = useState<string>('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         // Récupère les utilisateurs du contrat
//         const response = await axios.get('http://localhost:3001/getUsers');
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des utilisateurs:', error);
//         setMessage('Erreur lors de la récupération des utilisateurs.');
//       }
//     };

//     fetchUsers();
//   }, []);

  const fetchUserCards = async (user: string) => {
    try {
      // Récupère les collections du contrat
      const collectionsResponse = await axios.get('http://localhost:3001/getCollectionsFromContract');
      const collections = collectionsResponse.data.collections;

      let cardsByCollection: UserCards[] = [];

      for (const collection of collections) {
        // Récupère les cartes pour cet utilisateur dans chaque collection
        const response = await axios.get(`http://localhost:3001/getUserCardsByCollection/${collection.id}/${user}`);
        cardsByCollection.push({
          collectionId: collection.id,
          cards: response.data.cards,
        });
      }

      setUserCards(cardsByCollection);
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes de l\'utilisateur:', error);
      setMessage('Erreur lors de la récupération des cartes.');
    }
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
          {userCards.map((collection) => (
            <div key={collection.collectionId}>
              <h4>Collection ID: {collection.collectionId}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {collection.cards.map((card) => (
                  <div key={card.id} style={{ margin: '10px', border: '1px solid #ddd', padding: '10px' }}>
                    <img src={card.uri} alt="Card Image" style={{ width: '100px', height: 'auto' }} />
                    <p>Token ID: {card.id}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Users;
