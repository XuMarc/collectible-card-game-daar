const axios = require('axios');

const { ethers, NonceManager } = require('ethers');

// ABI de ton contrat Main
// const contract = require('../contracts/artifacts/src/Main.sol/Main.json')
// const mainContractAbi = contract.abi; // Assurez-vous que Main.json contient l'ABI du contrat


// // Adresse du contrat Main déployé
// const mainContractAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

// // Configuration du fournisseur (Provider)
// const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // Utilisez votre RPC provider (Hardhat, Infura, etc.)

// const wallet = new ethers.Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e', provider);


// // // Configuration du portefeuille (si nécessaire)
// const signer = provider.getSigner(); // Si vous utilisez un compte spécifique

// // Initialisation du contrat
// // const nonceManager = new NonceManager(wallet);

// const mainContract = new ethers.Contract(mainContractAddress, mainContractAbi, signer);

// ABI de ton contrat Main
const contract = require('../contracts/artifacts/src/Main.sol/Main.json');
const collection = require('../contracts/artifacts/src/Collection.sol/Collection.json');

const mainContractAbi = contract.abi; // Assurez-vous que Main.json contient l'ABI du contrat
const collectionContractAbi = collection.abi;
// Adresse du contrat Main déployé
const mainContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Configuration du fournisseur (Provider)
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // Utilisez votre RPC provider (Hardhat, Infura, etc.)

const wallet = new ethers.Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e', provider);

// Initialisation du contrat
// const managedWallet = new NonceManager(wallet);
const mainContract = new ethers.Contract(mainContractAddress, mainContractAbi, wallet);

/**
 * initialisation des collections dans le contrat
 */
// // Limiter l'initialisation aux 10 premières collections
// const initCollections = async () => {
//     try {
//         // Récupérer toutes les collections depuis l'API TCG Pokémon
//         const collectionsResponse = await axios.get('https://api.pokemontcg.io/v2/sets');
//         const collections = collectionsResponse.data.data;

//         // Limiter aux 10 premières collections
//         const limitedCollections = collections.slice(0, 5);

//         for (const collection of limitedCollections) {
//             console.log(`Traitement de la collection ${collection.name}`);

//             // Récupérer toutes les cartes de cette collection
//             const cardsResponse = await axios.get(`https://api.pokemontcg.io/v2/cards?q=set.id:${collection.id}`);
//             const cards = cardsResponse.data.data;

//             for (const card of cards) {
//                 // Définir une limite de mint pour chaque carte (ici, une limite arbitraire)
//                 const maxMint = Math.floor(Math.random() * 100) + 1; // Limite aléatoire entre 1 et 100

//                 try {
//                     // Appeler le contrat pour définir la limite de mint pour cette carte
//                     const tx = await mainContract.setMaxMintForCard(card.name, maxMint);
//                     await tx.wait();
//                     console.log(`Limite de ${maxMint} définie pour la carte ${card.name}`);
//                 } catch (err) {
//                     console.error(`Erreur lors de l'initialisation de la carte ${card.name}:`, err);
//                 }
//             }
//         }

//         console.log('Initialisation des 10 premières collections et des cartes terminée.');
//     } catch (err) {
//         console.error('Erreur lors de la récupération des collections ou des cartes:', err);
//     }
// };



/**
 * Collections
 */
const getCollections = async (req, res) => {
    try {

        const response = await axios.get('https://api.pokemontcg.io/v2/sets');
        const data = response.data;        
        console.log("getCollections data: ",data);
        res.json(data);

    } catch (err) {
        console.error('Erreur getCollections: ', err);        
        res.send(err)
    }
};

const getCollectionById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("getCollectionById req.params.is : ",id);
        
        const response = await axios.get('https://api.pokemontcg.io/v2/sets/'+id);
        const data = response.data;        
        console.log("getCollectionById data:",data);
        res.json(data);

    } catch (err) {
        console.error('Erreur getCollectionById : ', err);
        res.send(err)
    }
};


/**
 * Cards
 */
const getCards = async (req, res) => {
    try {

        const response = await axios.get('https://api.pokemontcg.io/v2/cards');
        const data = response.data;        
        console.log("getCards data: ",data);

        let cards= [{}];
        cards = []; 
        data.data.forEach((card) => { // on épure un peu le json 
            cards.push({
                "id": card.id,
                "name": card.name,
                "number": card.number,
                "image": card.images.large
            })
        });
        console.log("getCards cards data: ", cards);

        res.json(cards);


    } catch (err) {
        console.error('Erreur getCards: ', err); 
        res.send(err)
    }
};

const getCardById = async (req, res) => {

    try {
        const id = req.params.id;
        console.log("getCardById id: ",id)
        
        const response = await axios.get('https://api.pokemontcg.io/v2/cards/'+id);
        const data = response.data;        
        console.log("getCardById data: ", data)

        res.json({
            "id": data.data.id,
            "name": data.data.name,
            "number": data.data.number,
            "image": data.data.images.large
        });

        
    } catch (err) {
        console.error('Erreur getCardById:', err);
        res.send(err)
    }
};


/**
 * Users
 */




const getCollectionsWithCards = async (req, res) => {
    try {
        const collectionsResponse = await axios.get('https://api.pokemontcg.io/v2/sets');
        const collections = collectionsResponse.data.data.slice(0, 5); // Limite aux 5 premières collections

        let collectionsWithCards = [];

        for (const collection of collections) {
            const cardsResponse = await axios.get(`https://api.pokemontcg.io/v2/cards?q=set.id:${collection.id}`);
            const cards = cardsResponse.data.data;

            // Ajoute les cartes à la collection
            collectionsWithCards.push({
                id: collection.id,
                name: collection.name,
                cards: cards.map(card => ({
                    id: card.id,
                    name: card.name,
                    uri: card.images.large, // URI de l'image pour les NFTs
                }))
            });
        }

        res.json({ collections: collectionsWithCards });
    } catch (err) {
        console.error('Erreur lors de la récupération des collections avec cartes:', err);
        res.status(500).send(err);
    }
};


/**
 * Obtenir les cartes disponibles avec leur statut de mint
 */
const getCardsByCollection = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Récupérer les cartes depuis l'API externe ou une base de données
        const response = await axios.get(`https://api.pokemontcg.io/v2/cards?q=set.id:${id}`);
        const cardsData = response.data.data;

        let cards = [];
        for (const card of cardsData) {
            // Appel au contrat pour obtenir le statut de mint de chaque carte
            const mintedCount = await mainContract.getMintedCountForCard(card.name);
            const maxMint = await mainContract.getMaxMintForCard(card.name);

            cards.push({
                id: card.id,
                name: card.name,
                number: card.number,
                image: card.images.large,
                minted: mintedCount,
                maxMint: maxMint,
            });
        }

        res.json({ cards });
    } catch (err) {
        console.error('Erreur lors de la récupération des cartes:', err);
        res.status(500).send(err);
    }
};


const getCollectionsFromContract = async (req, res) => {
    try {
        // Appel du contrat pour récupérer toutes les adresses des collections
        const collectionsAddresses = await mainContract.getCollections();
        console.log("getCollectionsFromContract : ", collectionsAddresses);

        let collectionsWithCards = [];

        // Pour chaque adresse de collection, interroger le contrat Collection pour obtenir les détails
        for (const address of collectionsAddresses) {
            const collectionContract = new ethers.Contract(address, collectionContractAbi, provider);
            
            const name = await collectionContract.collectionName();
            const img = await collectionContract.getLogo();
            const cardCount = await collectionContract.cardCount();
            const cards = await collectionContract.getCards();
            const id = await collectionContract.getId();
            collectionsWithCards.push({
                id: id,
                name: name,
                logo: img,
                cardCount: cardCount,
                cards: cards.map(card => ({
                    id: card.id,
                    name: card.name,
                    uri: card.uri
                }))
            });
        }

        res.json({ collections: collectionsWithCards });
    } catch (err) {
        console.error('Erreur lors de la récupération des collections depuis le contrat:', err);
        res.status(500).send(err);
    }
};


const getUserCards = async (req, res) => {
    try {
        const { user } = req.params;
        // Appel du contrat pour obtenir les cartes d'un utilisateur dans une collection
        const userCards = await mainContract.getUserCardsDetailed(user);

        res.json({ cards: userCards });
    } catch (err) {
        console.error('Erreur lors de la récupération des cartes de l\'utilisateur:', err);
        res.status(500).send(err);
    }
};



/**
 * Mint une carte pour un utilisateur
 */
const mintCard = async (req, res) => {
    try {
        const { collectionId, user, tokenURI} = req.body;


        // Mint la carte via le contrat
        const tx = await mainContract.mint(collectionId, user, tokenURI);
        console.log(`Transaction envoyée avec hash : ${tx.hash}`);

        const receipt = await tx.wait();
        console.log("Transaction confirmée : ", receipt);

        const tokenId = tokenURI;  // Remplace par l'ID de ton token si tu le connais
        // const owner = await mainContract.ownerOf(tokenId);
        // console.log(`Le propriétaire du token ${tokenId} est : ${owner}`);

        res.json({ message: `Carte ${tokenURI} mintée avec succès pour l'utilisateur ${user}` });
    } catch (err) {
        console.error('Erreur lors du mint api.js:', err);
        res.status(500).send(err);
    }
};

// Création d'une collection et des cartes associées dans le contrat
const createCollectionWithCards = async (req, res) => {
    try {
        const { id, name, img } = req.body;

        // Appelle l'API Pokémon TCG pour récupérer les cartes de la collection
        const cardsResponse = await axios.get(`https://api.pokemontcg.io/v2/cards?q=set.id:${id}`);
        const cards = cardsResponse.data.data;

        // Prépare un tableau de cartes à passer dans le contrat (ID, name, URI)
        const cardsForContract = cards.map((card, index) => ({
            id: index, // Utilisation de l'index comme identifiant numérique
            name: card.name,
            uri: card.images.large // URL de l'image
        }));

        // Appel du contrat pour créer la collection avec les cartes
        const tx = await mainContract.createCollectionWithCards(id, name, img, cardsForContract.length, cardsForContract);
        const receipt = await tx.wait();

        res.json({ message: `Collection ${name} créée avec succès dans le contrat et voici la data : ${receipt}` });
    } catch (err) {
        console.error('Erreur lors de la création de la collection et des cartes:', err);
        res.status(500).json({ error: 'Erreur lors de la création de la collection et des cartes.' });
    }
};

// const createCollectionWithCards = async (collectionName, cards) => {
//     try {
//         // On récupère juste les noms des cartes à partir des données de l'API
//         const cardNames = cards.map(card => card.name);

//         // Appel du contrat pour créer la collection et les cartes associées
//         const txCollection = await mainContract.createCollectionWithCards(collectionName, cards.length, cardNames);
//         await txCollection.wait();

//         console.log(`Collection ${collectionName} créée avec ${cards.length} cartes.`);
//     } catch (err) {
//         console.error('Erreur lors de la création de la collection et des cartes:', err);
//     }
// };

// Exemple d'appel à cette fonction
const initCollections = async () => {
    try {
        const collectionsResponse = await axios.get('https://api.pokemontcg.io/v2/sets');
        const collections = collectionsResponse.data;
        // for (const collection of collections) {
        //     console.log(`Traitement de la collection ${collection.name}`);

        //     const set = data.data[i]
        //     const cardsResponse = await axios.get(`https://api.pokemontcg.io/v2/cards?q=set.id:${collection.id}`);
        //     const cards = cardsResponse.data.data;

        //     await createCollectionWithCards(collection.name, cards);
        // }
        for (let i = 0; i < 3; i++) {
            const set = collections.data[i];
            console.log("API.JS INITCOLLECTIONS : ",set.id,set.name,set.total);
            const tx = await mainContract.createCollectionWithCards(set.id,set.name, set.total);
            await tx.wait();

            console.log(tx);
            console.log(i)
        }
        console.log('Initialisation des collections et des cartes terminée.');
    } catch (err) {
        console.error('Erreur lors de l\'initialisation des collections:', err);
    }
};

const getUserCardsByCollection = async (req, res) => {
    try {
        const { collectionId, user } = req.params;

        // Appel du contrat pour obtenir les cartes d'un utilisateur dans une collection
        const userCards = await mainContract.getUserCards(collectionId, user);

        res.json({ cards: userCards });
    } catch (err) {
        console.error('Erreur lors de la récupération des cartes de l\'utilisateur:', err);
        res.status(500).send(err);
    }
};


// Fonction pour récupérer et afficher la limite max pour une carte spécifique
const getMaxMintForCard = async (cardName) => {
    try {
        const maxMint = await mainContract.getMaxMintForCard(cardName);
        console.log(`La limite de mint pour la carte ${cardName} est de : ${maxMint}`);
    } catch (err) {
        console.error('Erreur lors de la récupération de la limite de mint:', err);
    }
};

module.exports = {
    getCollections,
    getCollectionById,
    getCards,
    getCardById,
    mintCard,
    getCardsByCollection,
    initCollections,
    createCollectionWithCards,
    getUserCardsByCollection,
    getCollectionsWithCards,
    getMaxMintForCard,
    getCollectionsFromContract,
    getUserCards
};

