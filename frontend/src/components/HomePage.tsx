import React from 'react';

function HomePage() {
    return (
        <div className="homepage bg-gray-800 min-h-screen flex flex-col items-center justify-center text-center p-8 text-white">
            <h1 className="title text-6xl font-bold mb-4 drop-shadow-lg">
                Bienvenue sur Pokémon TCG
            </h1>
            <p className="description text-2xl mb-8 drop-shadow-md">
                Plongez dans le monde fascinant des cartes Pokémon, collectionnez et gérez vos NFT !
            </p>

            <div className="image-container flex flex-wrap justify-center mb-10">
                <img 
                    src="https://img.pokemondb.net/artwork/large/pikachu.jpg" 
                    alt="Pikachu" 
                    className="w-1/4 h-auto p-2 transition-transform duration-300 hover:scale-105" 
                />
                <img 
                    src="https://img.pokemondb.net/artwork/large/charizard.jpg" 
                    alt="Charizard" 
                    className="w-1/4 h-auto p-2 transition-transform duration-300 hover:scale-105" 
                />
                <img 
                    src="https://img.pokemondb.net/artwork/large/bulbasaur.jpg" 
                    alt="Bulbasaur" 
                    className="w-1/4 h-auto p-2 transition-transform duration-300 hover:scale-105" 
                />
                <img 
                    src="https://img.pokemondb.net/artwork/large/squirtle.jpg" 
                    alt="Squirtle" 
                    className="w-1/4 h-auto p-2 transition-transform duration-300 hover:scale-105" 
                />
            </div>

            <h2 className="features-title text-4xl font-semibold mb-4">Fonctionnalités</h2>
            <ul className="features-list text-lg max-w-md mx-auto space-y-3 mb-10">
                <li>🌟 **Recevez des NFT** : Le propriétaire peut mint des cartes pour les utilisateurs.</li>
                <li>👁️ **Visualisez vos NFT** : Visualiser les cartes des utilisateurs.</li>
                <li>📦 **Accédez aux métadonnées** : Récupérez toutes les informations détaillées des NFT via notre API.</li>
                <li>📚 **Explorez les collections** : Découvrez les différents ensembles de cartes et les utilisateurs qui les possèdent.</li>
                <li>👥 **Échangez vos cartes** : Échangez avec d'autres utilisateurs vos cartes.</li>

            </ul>
        </div>
    );
}

export default HomePage;
