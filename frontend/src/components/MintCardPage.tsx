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
  cards: Card[]
}

declare global {
  interface Window {
    ethereum: any
  }
}

const MintCardPage = ({ users }: { users: string[] }) => {
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

      handleMint();
    }
  }, [selectedCard]);

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
    console.log("HERE2222 : ",selectedCard,selectedCollection,selectedUser);


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
                indexed: false,
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
            ],
            name: 'CollectionCreated',
            type: 'event',
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
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
              },
            ],
            name: 'TOKENID',
            type: 'event',
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
                internalType: 'uint256',
                name: 'cardCount',
                type: 'uint256',
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
                internalType: 'int256',
                name: 'collectionId',
                type: 'int256',
              },
              {
                internalType: 'address',
                name: 'user',
                type: 'address',
              },
            ],
            name: 'getUserCards',
            outputs: [
              {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'getUsers',
            outputs: [
              {
                internalType: 'address[]',
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
                internalType: 'string',
                name: 'tokenURI',
                type: 'string',
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
          {
            inputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            name: 'users',
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
        ]
        // Adresse du contrat Main déployé
        const mainContract = new ethers.Contract(
          '0x5fbdb2315678afecb367f032d93f642f64180aa3',
          abi,
          signer
        )

        console.log("JUST BEFORE CALL TO MAINCONTRACT : COLLID,USER,CARDURI:",selectedCollection.id, selectedUser,selectedCard.uri);
        // Appeler la fonction de mint sur le contrat
        const tx = await mainContract.mint(
          selectedCollection.id,
          selectedUser,
          selectedCard.uri
        )

        console.log("passed everything so far2");

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
    <div>
      <h2>Mint une carte</h2>

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

      <div>
        <h3>Collections disponibles :</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {collections.map(collection => (
            <div
              key={collection.id}
              style={{
                border: '1px solid #ddd',
                padding: '20px',
                margin: '10px',
                width: '300px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={() => setSelectedCollection(collection)}
            >
              <h4>{collection.name}</h4>
              {collection.cards.length > 0 && (
                <img
                  src={collection.cards[0].uri}
                  alt={collection.name}
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedCollection && (
        <div>
          <h3>Cartes dans la collection : {selectedCollection.name}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {selectedCollection.cards.map(card => (
              <div
                key={card.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '20px',
                  margin: '10px',
                  width: '200px',
                  textAlign: 'center',
                }}
              >
                <h4>{card.name}</h4>
                <img
                  src={card.uri}
                  alt={card.name}
                  style={{ width: '100%', height: 'auto' }}
                />
                <button
                  onClick={() => setSelectedCard(card)}
                  style={{ marginTop: '10px' }}
                >
                  Mint {card.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  )
}

export default MintCardPage
