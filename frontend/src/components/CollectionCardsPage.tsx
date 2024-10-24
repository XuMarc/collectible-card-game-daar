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
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Collection {id}</h1>
      {loading ? (
        <p>Chargement des cartes...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.length > 0 ? (
            cards.map(card => (
              <li key={card.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4 transition-transform duration-200 hover:scale-105">
                <img src={card.image} alt={card.name} className="w-full h-48 object-cover rounded-md mb-2" />
                <h3 className="text-xl font-semibold">{card.name}</h3>
                <p className="text-gray-600">Numéro de carte : {card.number}</p>
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
