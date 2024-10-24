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

  const createCollection = async (collectionId: string, collectionName: string, collectionImg: string) => {
    try {
      setCreatingCollection(collectionId); // Indique quelle collection est en train d'être créée
      const response = await axios.post('http://localhost:3001/createCollection', {
        id: collectionId,
        name: collectionName,
        img: collectionImg,
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
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Ensembles de Cartes Pokémon</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map(collection => (
          <li key={collection.id} className="collection-item bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <Link
              className="flex-grow flex flex-col items-center"
              to={`/collections/${collection.id}`}
              state={{ setId: collection.id }}
            >
              <img 
                src={collection.images.logo} 
                alt={collection.name} 
                className="w-full h-40 object-contain rounded-md mb-4" // Utilisation de object-contain pour préserver les proportions
              />
              <h3 className="text-xl font-semibold mb-2 text-center">{collection.name}</h3>
            </Link>
            <button
              onClick={() => createCollection(collection.id, collection.name, collection.images.logo)}
              disabled={creatingCollection === collection.id} // Désactive pendant la création
              className={`mt-2 w-full py-2 rounded-md font-bold transition duration-300 ${creatingCollection === collection.id ? 'bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-400'}`}
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
