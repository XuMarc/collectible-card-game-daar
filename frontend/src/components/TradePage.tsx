import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum: any
  }
}

interface Card {
  id: string
  uri: string
}

const TradePage = ({ users }: { users: string[] }) => {
  const [userA, setUserA] = useState<string>('')
  const [userB, setUserB] = useState<string>('')
  const [userACards, setUserACards] = useState<Card[]>([])
  const [userBCards, setUserBCards] = useState<Card[]>([])
  const [selectedCardsA, setSelectedCardsA] = useState<string[]>([])
  const [selectedCardsB, setSelectedCardsB] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')

  const fetchUserCardsA = async (user: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getUserCards/${user}`
      )
      // console.log('CARDS A : ', response.data.cards)
      setUserACards(response.data.cards)
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des cartes de l'utilisateur:",
        error
      )
      setMessage('Erreur lors de la récupération des cartes.')
    }
  }
  const fetchUserCardsB = async (user: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getUserCards/${user}`
      )
      setUserBCards(response.data.cards)
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des cartes de l'utilisateur:",
        error
      )
      setMessage('Erreur lors de la récupération des cartes.')
    }
  }

  useEffect(() => {
    if (userA) {
      fetchUserCardsA(userA)
      // console.log('UserA cards : ', userACards)
    }
  }, [userA])

  useEffect(() => {
    if (userB) {
      fetchUserCardsB(userB)
      // console.log('UserB cards : ', userBCards)
    }
  }, [userB])

  const handleCardSelection = (
    cardId: string,
    selectedCards: string[],
    setSelectedCards: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId))
    } else {
      setSelectedCards([...selectedCards, cardId])
    }
  }

  const fetchCollections = async (mainContract: ethers.Contract
  ) => {
    try {
      // Appel de la fonction getCollections pour obtenir les adresses des collections
      const collectionAddresses = await mainContract.getCollections()

      // Initialisez chaque collection avec son ABI et son adresse
      let CollectionAbi = [
        {
          inputs: [
            {
              internalType: 'string',
              name: '_id',
              type: 'string',
            },
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'string',
              name: '_name',
              type: 'string',
            },
            {
              internalType: 'string',
              name: '_img',
              type: 'string',
            },
            {
              internalType: 'uint256',
              name: '_cardCount',
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
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'ERC721IncorrectOwner',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'ERC721InsufficientApproval',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'approver',
              type: 'address',
            },
          ],
          name: 'ERC721InvalidApprover',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'ERC721InvalidOperator',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'ERC721InvalidOwner',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'receiver',
              type: 'address',
            },
          ],
          name: 'ERC721InvalidReceiver',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
          ],
          name: 'ERC721InvalidSender',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'ERC721NonexistentToken',
          type: 'error',
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
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'approved',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'Approval',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'ApprovalForAll',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: '_fromTokenId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: '_toTokenId',
              type: 'uint256',
            },
          ],
          name: 'BatchMetadataUpdate',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: '_tokenId',
              type: 'uint256',
            },
          ],
          name: 'MetadataUpdate',
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
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'Transfer',
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
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'approve',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'cardCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
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
          name: 'cards',
          outputs: [
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
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'collectionName',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'getApproved',
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
          name: 'getCards',
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
          name: 'getId',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getLogo',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'id',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'img',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'isApprovedForAll',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
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
            {
              internalType: 'string',
              name: '_tokenURI',
              type: 'string',
            },
          ],
          name: 'mintCard',
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
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'ownerOf',
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
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'setApprovalForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes4',
              name: 'interfaceId',
              type: 'bytes4',
            },
          ],
          name: 'supportsInterface',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'tokenURI',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'transferFrom',
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
      const collections = collectionAddresses.map((address: string) => {
        return new ethers.Contract(
          address,
          CollectionAbi,
          mainContract.provider
        )
      })

      return collections
    } catch (error) {
      console.error('Erreur lors de la récupération des collections :', error)
      return []
    }
  }

  const handleTrade = async () => {
    if (
      userA &&
      userB &&
      (selectedCardsA.length > 0 || selectedCardsB.length > 0)
    ) {
      try {
        // Vérifiez si MetaMask est disponible
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)

          // Demander à MetaMask la permission de se connecter
          await window.ethereum.request({ method: 'eth_requestAccounts' })

          // Obtenir le signer (utilisateur connecté via MetaMask)
          const signer = provider.getSigner()
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
                  name: 'from',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'cardId',
                  type: 'uint256',
                },
              ],
              name: 'tradeCard',
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

          // // Récupérez les collections et initialisez-les
          // const collections = await fetchCollections(mainContract)

          // // Donnez l'approbation pour que mainContract puisse transférer les tokens pour chaque collection
          // for (const collection of collections) {
          //   await collection
          //     .connect(signer)
          //     .setApprovalForAll(mainContract.address, true)
          // }
          // Effectuer l'échange pour chaque carte sélectionnée
          const tradePromises = []

          // Échanger les cartes de userA à userB
          for (const cardIdA of selectedCardsA) {
            const txA = mainContract.tradeCard(userA, userB, cardIdA,{ gasLimit: 300000 });
            tradePromises.push(txA)
          }

          // Échanger les cartes de userB à userA
          for (const cardIdB of selectedCardsB) {
            const txB = mainContract.tradeCard(userB, userA, cardIdB, { gasLimit: 300000 });
            tradePromises.push(txB)
          }

          // Attendre que toutes les transactions soient confirmées
          const txResults = await Promise.all(tradePromises)

          // Attendre que toutes les transactions soient validées
          await Promise.all(txResults.map(tx => tx.wait()))

          setMessage('Échange réussi ! Transaction confirmée.')
          setSelectedCardsA([])
          setSelectedCardsB([])
        } else {
          setMessage("MetaMask non détecté. Veuillez l'installer.")
        }
      } catch (err) {
        if (err instanceof Error) {
          setMessage(`Erreur lors de l'échange : ${err.message}`)
          console.error('Erreur : ', err.message)
        } else {
          setMessage('Une erreur inconnue est survesnue.')
          console.error('Erreur inconnue : ', err)
        }
      }
    } else {
      setMessage(
        "Veuillez sélectionner des utilisateurs et au moins une carte pour l'échange."
      )
    }
  }

  return (
    <div>
      <h2>Échanger des cartes</h2>

      <div>
        <h3>Sélectionnez le premier utilisateur :</h3>
        <select value={userA} onChange={e => setUserA(e.target.value)}>
          <option value="">Sélectionnez un utilisateur</option>
          {users.map(user => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      {userA && userACards.length > 0 && (
        <div>
          <h3>Cartes de {userA}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {userACards.map(card => (
              <div
                key={card[0].hex}
                style={{
                  margin: '10px',
                  border: selectedCardsA.includes(card[0].hex)
                    ? '2px solid blue'
                    : '1px solid #ddd',
                  padding: '10px',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  handleCardSelection(
                    card[0].hex,
                    selectedCardsA,
                    setSelectedCardsA
                  )
                }
              >
                <img
                  src={card[2]}
                  alt="Card Image"
                  style={{ width: '100px', height: 'auto' }}
                />
                <p>Token ID: {card[0].hex}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3>Sélectionnez le deuxième utilisateur :</h3>
        <select value={userB} onChange={e => setUserB(e.target.value)}>
          <option value="">Sélectionnez un utilisateur</option>
          {users.map(user => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      {userB && userBCards.length > 0 && (
        <div>
          <h3>Cartes de {userB}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {userBCards.map(card => (
              <div
                key={card.id}
                style={{
                  margin: '10px',
                  border: selectedCardsB.includes(card[0].hex)
                    ? '2px solid green'
                    : '1px solid #ddd',
                  padding: '10px',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  handleCardSelection(
                    card[0].hex,
                    selectedCardsB,
                    setSelectedCardsB
                  )
                }
              >
                <img
                  src={card[2]}
                  alt="Card Image"
                  style={{ width: '100px', height: 'auto' }}
                />
                <p>Token ID: {card[0].hex}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleTrade}
        disabled={
          !userA ||
          !userB ||
          (selectedCardsA.length === 0 && selectedCardsB.length === 0)
        }
      >
        Échanger les cartes
      </button>

      {message && <p>{message}</p>}
    </div>
  )
}

export default TradePage
