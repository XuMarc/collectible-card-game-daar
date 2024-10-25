import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import axios from 'axios'
interface Card {
  id: string
  name: string
  uri: string
}

interface Collection {
  id: string
  name: string
  logo: string
  cards: Card[]
}

declare global {
  interface Window {
    ethereum: any
  }
}

const MintCardPage = (props: any) => {
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [message, setMessage] = useState('')

  // Récupère les collections avec les cartes associées
  // useEffect(() => {
  //   axios
  //     .get('http://localhost:3001/getCollectionsWithCards')
  //     .then(response => {
  //       setCollections(response.data.collections)
  //     })
  //     .catch(error => {
  //       console.error('Erreur lors de la récupération des collections:', error)
  //     })
  // }, [])
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/getCollectionsFromContract'
        )
        setCollections(response.data.collections)
        console.log('COLLECTIONS : ', response.data.collections)
      } catch (error) {
        console.error('Erreur lors de la récupération des collections:', error)
        setMessage('Erreur lors de la récupération des collections.')
      }
    }

    fetchCollections()
  }, [])

  useEffect(() => {
    if (selectedCard) {
      handleMint()
    }
  }, [selectedCard])

  //   const handleMint = () => {
  //     if (!selectedUser || !selectedCard || !selectedCollection) {
  //       setMessage(
  //         'Veuillez sélectionner un utilisateur, une collection et une carte.'
  //       )
  //       return
  //     }
  //     console.log(
  //       'handleMint : ',
  //       selectedCollection.id,
  //       selectedUser,
  //       selectedCard.id
  //     )
  //     axios
  //       .post('http://localhost:3001/mintCard', {
  //         collectionId: selectedCollection.id,
  //         user: selectedUser,
  //         tokenURI: selectedCard.uri,
  //       })
  //       .then(response => {
  //         setMessage(`Mint réussi : ${response.data.message}`)
  //       })
  //       .catch(err => {
  //         setMessage(`Erreur lors du mint : ${err.response.data.message}`)
  //       })
  //   }

  // const handleMint = async () => {
  //   if (!selectedUser || !selectedCard || !selectedCollection) {
  //     setMessage(
  //       'Veuillez sélectionner un utilisateur, une collection et une carte.'
  //     )
  //     return
  //   }

  //   // Se connecter à MetaMask
  //   try {
  //     if (window.ethereum) {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum)
  //       // Demander à MetaMask de se connecter
  //       await provider.send('eth_requestAccounts', [])
  //       const signer = provider.getSigner()
  //       const userAddress = await signer.getAddress()

  //       console.log('Minting with account:', userAddress)

  //       // Appel au backend pour mint la carte (via MetaMask)
  //       const tx = await axios.post('http://localhost:3001/mintCard', {
  //         collectionId: selectedCollection.id,
  //         user: userAddress, // Utilise l'adresse obtenue de MetaMask
  //         tokenURI: selectedCard.uri,
  //       })

  //       setMessage(`Mint réussi : ${tx.data.message}`)
  //     } else {
  //       setMessage("MetaMask non détecté. Veuillez l'installer.")
  //     }
  //   } catch (err) {
  //     // Affinement du type de 'err' pour qu'il soit typé comme une 'Error'
  //     if (err instanceof Error) {
  //       setMessage(
  //         `Erreur lors de la connexion à MetaMask ou du mint : ${err.message}`
  //       )
  //       console.error('Erreur : ', err.message)
  //     } else {
  //       setMessage('Une erreur inconnue est survenue.')
  //       console.error('Erreur inconnue : ', err)
  //     }
  //   }
  // }

  const handleMint = async () => {
    if (!selectedUser || !selectedCard || !selectedCollection) {
      setMessage(
        'Veuillez sélectionner un utilisateur, une collection et une carte.'
      )
      return
    }
    console.log('HERE2222 : ', selectedCard, selectedCollection, selectedUser)

    try {
      // Vérifiez si MetaMask est disponible
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // Demander à MetaMask la permission de se connecter
        await window.ethereum.request({ method: 'eth_requestAccounts' })

        // Obtenir le signer (utilisateur connecté via MetaMask)
        const signer = provider.getSigner()
        const userAddress = await signer.getAddress()

        console.log('Minting with account:', userAddress)

        // Initialiser le contrat avec le signer de MetaMask
        // const contract = require('../../contracts/artifacts/src/Main.sol/Main.json');
        // const mainContractAbi = contract.abi; // Assurez-vous que Main.json contient l'ABI du contrat
        let abi = [
          {
            inputs: [],
            stateMutability: 'nonpayable',
            type: 'constructor',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
            ],
            name: 'OwnableInvalidOwner',
            type: 'error',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
              },
            ],
            name: 'OwnableUnauthorizedAccount',
            type: 'error',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
              },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'to',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                  },
                  {
                    internalType: 'string',
                    name: 'name',
                    type: 'string',
                  },
                  {
                    internalType: 'string',
                    name: 'uri',
                    type: 'string',
                  },
                ],
                internalType: 'struct Collection.Card[]',
                name: 'cards',
                type: 'tuple[]',
              },
            ],
            name: 'createBooster',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'string',
                name: 'id',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'img',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'cardCount',
                type: 'uint256',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                  },
                  {
                    internalType: 'string',
                    name: 'name',
                    type: 'string',
                  },
                  {
                    internalType: 'string',
                    name: 'uri',
                    type: 'string',
                  },
                ],
                internalType: 'struct Collection.Card[]',
                name: '_cards',
                type: 'tuple[]',
              },
            ],
            name: 'createCollectionWithCards',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'boosterId',
                type: 'uint256',
              },
            ],
            name: 'getBoosterCards',
            outputs: [
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                  },
                  {
                    internalType: 'string',
                    name: 'name',
                    type: 'string',
                  },
                  {
                    internalType: 'string',
                    name: 'uri',
                    type: 'string',
                  },
                ],
                internalType: 'struct Collection.Card[]',
                name: '',
                type: 'tuple[]',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'getCollections',
            outputs: [
              {
                internalType: 'contract Collection[]',
                name: '',
                type: 'address[]',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'user',
                type: 'address',
              },
            ],
            name: 'getUserBoosters',
            outputs: [
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'owner',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'boosterId',
                    type: 'uint256',
                  },
                  {
                    internalType: 'bool',
                    name: 'claimed',
                    type: 'bool',
                  },
                ],
                internalType: 'struct Booster.BoosterPack[]',
                name: '',
                type: 'tuple[]',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'to',
                type: 'address',
              },
            ],
            name: 'getUserCardsDetailed',
            outputs: [
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                  },
                  {
                    internalType: 'string',
                    name: 'name',
                    type: 'string',
                  },
                  {
                    internalType: 'string',
                    name: 'uri',
                    type: 'string',
                  },
                ],
                internalType: 'struct Collection.Card[]',
                name: '',
                type: 'tuple[]',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'string',
                name: 'collectionId',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'to',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                  },
                  {
                    internalType: 'string',
                    name: 'name',
                    type: 'string',
                  },
                  {
                    internalType: 'string',
                    name: 'uri',
                    type: 'string',
                  },
                ],
                internalType: 'struct Collection.Card',
                name: 'card',
                type: 'tuple',
              },
            ],
            name: 'mint',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'owner',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
              },
            ],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]
        // Adresse du contrat Main déployé
        const mainContract = new ethers.Contract(
          '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          abi,
          signer
        )

        console.log(
          'JUST BEFORE CALL TO MAINCONTRACT : COLLID,USER,CARDURI:',
          selectedCollection.id,
          selectedUser,
          selectedCard
        )
        // Appeler la fonction de mint sur le contrat
        const tx = await mainContract.mint(
          selectedCollection.id, // Identifiant de la collection
          selectedUser, // Adresse de l'utilisateur
          selectedCard
        )

        console.log('passed everything so far2')

        // Attendre que la transaction soit confirmée
        await tx.wait()

        setMessage('Mint réussi ! Transaction confirmée.')
      } else {
        setMessage("MetaMask non détecté. Veuillez l'installer.")
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Erreur lors du mint : ${err.message}`)
        console.error('Erreur : ', err.message)
      } else {
        setMessage('Une erreur inconnue est survenue.')
        console.error('Erreur inconnue : ', err)
      }
    }
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Mint une carte</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Sélectionnez un utilisateur :
        </h3>
        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded bg-gray-700 text-white focus:outline-none"
        >
          <option value="">Sélectionnez un utilisateur</option>
          {props.users.map(user => (
            <option key={user} value={user} className="bg-gray-700">
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Collections disponibles :
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collections.map(collection => (
            <div
              key={collection.id}
              className="border border-gray-300 rounded-lg p-4 h-64 cursor-pointer text-center bg-gray-700 transition-transform hover:scale-105"
              onClick={() => setSelectedCollection(collection)}
            >
              <h4 className="text-lg font-medium mb-2 h-12 overflow-hidden">
                {collection.name}
              </h4>
              {collection.cards.length > 0 && (
                <div className="flex justify-center">
                  <img
                    src={collection.logo}
                    alt={collection.name}
                    className="object-contain w-32 h-32"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedCollection && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Cartes dans la collection : {selectedCollection.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedCollection.cards.map(card => (
              <div
                key={card.id}
                className="border border-gray-300 rounded-lg p-4 h-64 bg-gray-700 text-center transition-transform hover:scale-105"
              >
                <h4 className="text-lg font-medium mb-2 h-12 overflow-hidden">
                  {card.name}
                </h4>
                <div className="flex justify-center">
                  <img
                    src={card.uri}
                    alt={card.name}
                    className="object-contain w-24 h-24"
                  />
                </div>
                <button
                  onClick={() => setSelectedCard(card)}
                  className="bg-yellow-500 text-gray-800 py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300 mt-2"
                >
                  Mint {card.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  )
}

export default MintCardPage
