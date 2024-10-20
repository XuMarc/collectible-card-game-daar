// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";

contract Main is Ownable {
    int private count;
    mapping(int => Collection) private collections;
    mapping(string => Collection) private collectionsById;
    // mapping(string => uint) public maxMintPerCard; // Limite maximale pour chaque carte
    // mapping(string => uint) public mintedCountPerCard; // Compteur de cartes mintées pour chaque type de carte

    address[] public users;

    event CollectionCreated(string name);
    event TOKENID(uint256 id);
    // address public owner;

    constructor() Ownable(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199) {
        count = 1;
        // owner = msg.sender;
    }

  // Créer une collection avec les cartes associées
    function createCollectionWithCards(string calldata id, string calldata name, uint cardCount) external onlyOwner {
        emit CollectionCreated(name);

        address owner = address(this);
        Collection collection = new Collection(owner, name, cardCount);
        collections[count++] = collection;
        collectionsById[id] = collections[count-1];

        // for (uint i = 0; i < cardCount; i++) {
        //     // Définir une limite de mint de 5 pour chaque carte
        //     maxMintPerCard[cardNames[i]] = 5;
        // }
    }

    // Mint une carte après vérification de la limite
    function mint(string calldata collectionId, address to, string memory tokenURI) external onlyOwner returns(uint256){
        // require(mintedCountPerCard[cardName] < maxMintPerCard[cardName], "Limite de mint atteinte pour cette carte");

        uint256 tokenId = collectionsById[collectionId].mintCard(to, tokenURI);
        emit TOKENID(tokenId);

        return tokenId;
        // Collection collection = collections[collectionId];
        // uint256 tokenId = collection.mintCard(to, tokenURI, globalCardId);

        // mintedCountPerCard[cardName] += 1;
        // globalCardId++;
    }

    // // Obtenir le nombre de cartes mintées pour une carte spécifique
    // function getMintedCountForCard(string memory cardName) external view returns (uint) {
    //     return mintedCountPerCard[cardName];
    // }

    // // Obtenir la limite de mint pour une carte spécifique
    // function getMaxMintForCard(string memory cardName) external view returns (uint) {
    //     return maxMintPerCard[cardName];
    // }
    
    // Fonction pour récupérer les cartes d'un utilisateur dans une collection spécifique
    function getUserCards(int collectionId, address user) external view returns (uint256[] memory) {
        Collection collection = collections[collectionId];
        return collection.getUserTokens(user);
    }

    function getUsers() public view returns(address[] memory) {
      return users;

    }
}
