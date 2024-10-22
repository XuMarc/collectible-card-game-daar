import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

interface Collection {
  id: string;
  name: string;
  images: {
    logo: string;
  };
}

function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [creatingCollection, setCreatingCollection] = useState<string | null>(null); // Suivi de la création

  useEffect(() => {
    axios.get('http://localhost:3001/getCollections')
      .then(response => {
        setCollections(response.data.data);
      })
      .catch(error => {
        console.error('Erreur axios.get(//getCollections):', error);
      });
  }, []);

  const createCollection = async (collectionId: string, collectionName: string) => {
    try {
      setCreatingCollection(collectionId); // Indique quelle collection est en train d'être créée
      // Appeler l'API backend pour créer la collection et mint ses cartes via le contrat
      const response = await axios.post('http://localhost:3001/createCollection', {
        id: collectionId,
        name: collectionName
      });
      console.log(response.data.message);
      alert(`Collection ${collectionName} créée avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la création de la collection:', error);
      alert('Erreur lors de la création de la collection.');
    } finally {
      setCreatingCollection(null); // Réinitialise l'état de suivi
    }
  };

  return (
    <div className="collection-div">
      <h1>Pokemon Card Sets</h1>
      <ul className="collection-grid">
        {collections.map(collection => (
          <li key={collection.id} className="collection-item">
            <Link
              className="pokemon-sets-a"
              to={`/collections/${collection.id}`}
              state={{ setId: collection.id }}
            >
              <img src={collection.images.logo} alt={collection.name} />
              <h3>{collection.name}</h3>
            </Link>
            <button
              onClick={() => createCollection(collection.id, collection.name)}
              disabled={creatingCollection === collection.id} // Désactive pendant la création
            >
              {creatingCollection === collection.id ? 'Création en cours...' : 'Créer Collection'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CollectionsPage;
