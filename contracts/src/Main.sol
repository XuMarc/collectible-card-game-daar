// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";

contract Main is Ownable {
  int private count;
  mapping(int => Collection) private collections;
  mapping(string => Collection) private collectionsById;
  // address[] public users;
  mapping(address => Collection.Card[]) private usersCards;

  // event CollectionCreated(string name);
  // event TOKENID(uint256 id);

  constructor() Ownable(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199) {
    count = 1;
  }

  // Créer une collection avec les cartes associées
  function createCollectionWithCards(
    string calldata id,
    string calldata name,
    uint cardCount,
    Collection.Card[] memory _cards
  ) external onlyOwner {
    // emit CollectionCreated(name);

    // Utilisation du contrat Collection pour créer la collection
    Collection collection = new Collection(
      id,
      address(this),
      name,
      cardCount,
      _cards
    );
    collections[count++] = collection;
    collectionsById[id] = collections[count - 1];
  }

  function mint(
    string calldata collectionId,
    address to,
    Collection.Card memory card
  ) external onlyOwner returns (uint256) {
    uint256 tokenId = collectionsById[collectionId].mintCard(to, card.uri);

    // Créez une nouvelle carte à partir des arguments
    // Collection.Card memory newCard = Collection.Card({
    //   id: cardId,
    //   name: cardName,
    //   uri: cardUri
    // });

    // Ajoutez la carte à la liste des cartes de l'utilisateur
    usersCards[to].push(card);

    return tokenId;
  }

  //     function mint(
  //     Collection.Card memory newCard,
  //     string calldata collectionId,
  //     address to,
  //     string memory tokenURI
  //   ) external onlyOwner returns (uint256) {
  //     uint256 tokenId = collectionsById[collectionId].mintCard(to, tokenURI);
  //     usersCards[to].push(newCard); // Ajout de la carte à la liste de l'utilisateur
  //     return tokenId;
  //   }

  // Fonction pour récupérer toutes les collections
  function getCollections() public view returns (Collection[] memory) {
    Collection[] memory _collections = new Collection[](uint(count - 1));
    for (int i = 1; i < count; i++) {
      _collections[uint(i - 1)] = collections[i];
    }
    return _collections;
  }

  // Fonction pour récupérer une collection par son ID
  function getCollectionById(
    string calldata id
  ) public view returns (Collection) {
    return collectionsById[id];
  }

  // Fonction pour obtenir les cartes d'une collection spécifique
  function getCardsInCollection(
    string calldata id
  ) public view returns (Collection.Card[] memory) {
    return collectionsById[id].getCards();
  }

  // Récupérer les cartes d'un utilisateur dans une collection spécifique
  // function getUserCards(int collectionId, address user) external view returns (uint256[] memory) {
  //     return collections[collectionId].getUserTokens(user);
  // }

  function getUserCardsDetailed(
    address to
  ) external view returns (Collection.Card[] memory) {
    return usersCards[to];
  }

  // function getUsers() public view returns (address[] memory) {
  //     return users;
  // }
}
