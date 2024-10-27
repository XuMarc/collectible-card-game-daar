const axios = require('axios')

const { ethers } = require('ethers')

const contract = require('../contracts/artifacts/src/Main.sol/Main.json')
const collection = require('../contracts/artifacts/src/Collection.sol/Collection.json')

const mainContractAbi = contract.abi
const collectionContractAbi = collection.abi

// Adresse du contrat Main déployé
const mainContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

// Configuration du fournisseur (Provider)
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')

const wallet = new ethers.Wallet(
  '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e',
  provider
)

// Initialisation du contrat
const mainContract = new ethers.Contract(
  mainContractAddress,
  mainContractAbi,
  wallet
)

const getCollections = async (req, res) => {
  try {
    const response = await axios.get('https://api.pokemontcg.io/v2/sets')
    const data = response.data
    console.log('getCollections data: ', data)
    res.json(data)
  } catch (err) {
    console.error('Erreur getCollections: ', err)
    res.send(err)
  }
}

const getCollectionById = async (req, res) => {
  try {
    const id = req.params.id
    console.log('getCollectionById req.params.is : ', id)

    const response = await axios.get('https://api.pokemontcg.io/v2/sets/' + id)
    const data = response.data
    console.log('getCollectionById data:', data)
    res.json(data)
  } catch (err) {
    console.error('Erreur getCollectionById : ', err)
    res.send(err)
  }
}

const getCollectionsWithCards = async (req, res) => { //
  try {
    const collectionsResponse = await axios.get(
      'https://api.pokemontcg.io/v2/sets'
    )
    const collections = collectionsResponse.data.data.slice(0, 5) // Limite aux 5 premières collections

    let collectionsWithCards = []

    for (const collection of collections) {
      const cardsResponse = await axios.get(
        `https://api.pokemontcg.io/v2/cards?q=set.id:${collection.id}`
      )
      const cards = cardsResponse.data.data

      // Ajoute les cartes à la collection
      collectionsWithCards.push({
        id: collection.id,
        name: collection.name,
        cards: cards.map(card => ({
          id: card.id,
          name: card.name,
          uri: card.images.large, // URI de l'image pour les NFTs
        })),
      })
    }

    res.json({ collections: collectionsWithCards })
  } catch (err) {
    console.error(
      'Erreur lors de la récupération des collections avec cartes:',
      err
    )
    res.status(500).send(err)
  }
}

const getCollectionsFromContract = async (req, res) => { //
  try {
    // Appel du contrat pour récupérer toutes les adresses des collections
    const collectionsAddresses = await mainContract.getCollections()

    let collectionsWithCards = []

    // Pour chaque adresse de collection, interroger le contrat Collection pour obtenir les détails
    for (const address of collectionsAddresses) {
      const collectionContract = new ethers.Contract(
        address,
        collectionContractAbi,
        provider
      )

      const name = await collectionContract.collectionName()
      const img = await collectionContract.getLogo()
      const cardCount = await collectionContract.cardCount()
      const cards = await collectionContract.getCards()
      const id = await collectionContract.getId()
      collectionsWithCards.push({
        id: id,
        name: name,
        logo: img,
        cardCount: cardCount,
        cards: cards.map(card => ({
          id: card.id,
          name: card.name,
          uri: card.uri,
        })),
      })
    }

    res.json({ collections: collectionsWithCards })
  } catch (err) {
    console.error(
      'Erreur lors de la récupération des collections depuis le contrat:',
      err
    )
    res.status(500).send(err)
  }
}

const getUserCards = async (req, res) => { //
  try {
    const { user } = req.params
    // Appel du contrat pour obtenir les cartes d'un utilisateur dans une collection
    const userCards = await mainContract.getUserCardsDetailed(user)

    res.json({ cards: userCards })
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des cartes de l'utilisateur:",
      err
    )
    res.status(500).send(err)
  }
}

const mintCard = async (req, res) => {
  try {
    const { collectionId, user, tokenURI } = req.body

    // Mint la carte via le contrat
    const tx = await mainContract.mint(collectionId, user, tokenURI)
    console.log(`Transaction envoyée avec hash : ${tx.hash}`)

    const receipt = await tx.wait()
    console.log('Transaction confirmée : ', receipt)

    const tokenId = tokenURI // Remplace par l'ID de ton token si tu le connais

    res.json({
      message: `Carte ${tokenURI} mintée avec succès pour l'utilisateur ${user}`,
    })
  } catch (err) {
    console.error('Erreur lors du mint api.js:', err)
    res.status(500).send(err)
  }
}

// Création d'une collection et des cartes associées dans le contrat
const createCollectionWithCards = async (req, res) => { //
  try {
    const { id, name, img } = req.body

    // Appelle l'API Pokémon TCG pour récupérer les cartes de la collection
    const cardsResponse = await axios.get(
      `https://api.pokemontcg.io/v2/cards?q=set.id:${id}`
    )
    const cards = cardsResponse.data.data

    // Prépare un tableau de cartes à passer dans le contrat (ID, name, URI)
    const cardsForContract = cards.map((card, index) => ({
      id: index, // Utilisation de l'index comme identifiant numérique
      name: card.name,
      uri: card.images.large, // URL de l'image
    }))

    // Appel du contrat pour créer la collection avec les cartes
    const tx = await mainContract.createCollectionWithCards(
      id,
      name,
      img,
      cardsForContract.length,
      cardsForContract
    )
    const receipt = await tx.wait()

    res.json({
      message: `Collection ${name} créée avec succès dans le contrat et voici la data : ${receipt}`,
    })
  } catch (err) {
    console.error(
      'Erreur lors de la création de la collection et des cartes:',
      err
    )
    res
      .status(500)
      .json({
        error: 'Erreur lors de la création de la collection et des cartes.',
      })
  }
}

const getUserCardsByCollection = async (req, res) => {
  try {
    const { collectionId, user } = req.params

    // Appel du contrat pour obtenir les cartes d'un utilisateur dans une collection
    const userCards = await mainContract.getUserCards(collectionId, user)

    res.json({ cards: userCards })
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des cartes de l'utilisateur:",
      err
    )
    res.status(500).send(err)
  }
}

module.exports = {
  getCollections,
  getCollectionById,
  mintCard,
  createCollectionWithCards,
  getUserCardsByCollection,
  getCollectionsWithCards,
  getCollectionsFromContract,
  getUserCards,
}
