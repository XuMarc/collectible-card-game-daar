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

  useEffect(() => {
    axios.get('http://localhost:3001/getCollections')
      .then(response => {
        setCollections(response.data.data);
      })
      .catch(error => {
        console.error('Erreur axios.get(//getCollections):', error);
      });
  }, []);

  return (
    <div className="collection-div">
      <h1>Pokemon Card Sets</h1>
      <ul className="collection-grid">
        {collections.map(collection => (
          <Link
            className="pokemon-sets-a"
            to={`/collections/${collection.id}`}
            state={{ setId: collection.id }}
          >
            <li className="collection-item">
              <img src={collection.images.logo} alt={collection.name} />
              <h3>{collection.name}</h3>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default CollectionsPage;
