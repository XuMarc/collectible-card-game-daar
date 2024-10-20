import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

interface Card {
  id: string;
  name: string;
  number: string;
  image: string;
}

function CollectionCardsPage() {
  const { id } = useParams<{ id: string }>(); // Récupère l'id de la collection depuis l'URL
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Utilisation de l'API Pokémon TCG pour filtrer les cartes par set.id
      axios.get(`https://api.pokemontcg.io/v2/cards?q=set.id:${id}`)
        .then(response => {
          const data = response.data;
          if (data && data.data) {
            // On map les résultats et on extrait seulement les infos nécessaires pour les cartes
            const filteredCards = data.data.map((card: any) => ({
              id: card.id,
              name: card.name,
              number: card.number,
              image: card.images.large,
            }));
            setCards(filteredCards);
          } else {
            console.error('Structure de réponse inattendue:', data);
          }
        })
        .catch(error => {
          console.error('Error :', error);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="cards-div">
      <h1>Collection {id}</h1>
      {loading ? (
        <p>Chargement des cartes...</p>
      ) : (
        <ul className="cards-grid">
          {cards.length > 0 ? (
            cards.map(card => (
              <li key={card.id} className="card-item">
                <img src={card.image} alt={card.name} />
                <h3>{card.name}</h3>
                <p>Numéro de carte : {card.number}</p>
              </li>
            ))
          ) : (
            <p>Aucune carte trouvée pour cette collection...</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default CollectionCardsPage;
