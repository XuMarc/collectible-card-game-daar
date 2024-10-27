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
    }
  }, [userA])

  useEffect(() => {
    if (userB) {
      fetchUserCardsB(userB)
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

  const handleTrade = async () => {
    if (
      userA &&
      userB &&
      (selectedCardsA.length > 0 || selectedCardsB.length > 0)
    ) {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)

          await window.ethereum.request({ method: 'eth_requestAccounts' })

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

          // Effectuer l'échange pour chaque carte sélectionnée
          const tradePromises = []

          // Échanger les cartes de userA à userB
          for (const cardIdA of selectedCardsA) {
            const txA = mainContract.tradeCard(userA, userB, cardIdA, {
              gasLimit: 300000,
            })
            tradePromises.push(txA)
          }

          // Échanger les cartes de userB à userA
          for (const cardIdB of selectedCardsB) {
            const txB = mainContract.tradeCard(userB, userA, cardIdB, {
              gasLimit: 300000,
            })
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
    <div className="p-6 bg-gray-800 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Échanger des cartes
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Sélectionnez le premier utilisateur :
        </h3>
        <select
          value={userA}
          onChange={e => setUserA(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded bg-gray-700 text-white focus:outline-none"
        >
          <option value="">Sélectionnez un utilisateur</option>
          {users.map(user => (
            <option key={user} value={user} className="bg-gray-700">
              {user}
            </option>
          ))}
        </select>
      </div>

      {userA && userACards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Cartes de {userA}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userACards.map(card => (
              <div
                key={card[0].hex}
                className={`border ${
                  selectedCardsA.includes(card[0].hex)
                    ? 'border-blue-500'
                    : 'border-gray-300'
                } rounded-lg p-4 cursor-pointer bg-gray-700 transition-transform hover:scale-105`}
                onClick={() =>
                  handleCardSelection(
                    card[0].hex,
                    selectedCardsA,
                    setSelectedCardsA
                  )
                }
              >
                <div className="flex justify-center">
                  <img src={card[2]} alt="Card Image" className="h-48" />
                </div>
                <p className="text-center text-sm">Token ID: {card[0].hex}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Sélectionnez le deuxième utilisateur :
        </h3>
        <select
          value={userB}
          onChange={e => setUserB(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded bg-gray-700 text-white focus:outline-none"
        >
          <option value="">Sélectionnez un utilisateur</option>
          {users.map(user => (
            <option key={user} value={user} className="bg-gray-700">
              {user}
            </option>
          ))}
        </select>
      </div>

      {userB && userBCards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Cartes de {userB}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userBCards.map(card => (
              <div
                key={card[0].hex}
                className={`border ${
                  selectedCardsB.includes(card[0].hex)
                    ? 'border-green-500'
                    : 'border-gray-300'
                } rounded-lg p-4 cursor-pointer bg-gray-700 transition-transform hover:scale-105`}
                onClick={() =>
                  handleCardSelection(
                    card[0].hex,
                    selectedCardsB,
                    setSelectedCardsB
                  )
                }
              >
                <div className="flex justify-center">
                  <img src={card[2]} alt="Card Image" className="h-48" />
                </div>
                <p className="text-center text-sm">Token ID: {card[0].hex}</p>
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
        className="w-full bg-yellow-500 text-gray-800 py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300"
      >
        Échanger les cartes
      </button>

      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  )
}

export default TradePage
