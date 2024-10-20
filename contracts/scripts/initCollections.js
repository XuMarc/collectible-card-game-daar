const { ethers } = require('ethers')
const { JsonRpcProvider } = ethers.providers
const https = require('https')
const axios = require('axios')

// Désactiver la vérification SSL
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

// Connect to Ethereum network
const provider = new JsonRpcProvider('http://localhost:8545') // Note: 8545 est le port par défaut de HardHat
const wallet = new ethers.Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e', provider);
console.log("Adresse du portefeuille administrateur:", wallet.address);


// Load your NFT smart contract (replace with your contract address and ABI)
const contractAddress = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'
const contract = require('../artifacts/src/Main.sol/Main.json')
const contractABI = contract.abi
const nftContract = new ethers.Contract(contractAddress, contractABI, wallet) // Utilise directement le wallet

const initCollections = async () => {
  const response = await axios.get('https://api.pokemontcg.io/v2/sets')
  const data = response.data
  for (let i = 0; i < 5; i++) {
    const set = data.data[i]
    console.log(set.id, set.name, set.total)
    const transaction = await nftContract.createCollection(
      set.id,
      set.name,
      set.total
    )
    console.log("TRANSACTION ::::::::::::::",transaction)
  }
}

module.exports = {
  initCollections,
}
