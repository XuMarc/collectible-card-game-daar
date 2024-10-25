// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";

contract Main is Ownable {
  int private count;
  Collection[] collectionsArray;
  mapping(address => Collection.Card[]) private usersCards;

  constructor() Ownable(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199) {
    count = 1;
  }

  // Créer une collection avec les cartes associées
  function createCollectionWithCards(
    string calldata id,
    string calldata name,
    string calldata img,
    uint cardCount,
    Collection.Card[] memory _cards
  ) external onlyOwner {
    Collection collection = new Collection(
      id,
      address(this),
      name,
      img,
      cardCount,
      _cards
    );
    collectionsArray.push(collection);
  }

  function mint(
    string calldata collectionId,
    address to,
    Collection.Card memory card
  ) external onlyOwner returns (uint256) {
    // Parcours de collectionsArray pour trouver la collection avec l'ID correspondant
    for (uint i = 0; i < collectionsArray.length; i++) {
      if (
        keccak256(abi.encodePacked(collectionsArray[i].getId())) ==
        keccak256(abi.encodePacked(collectionId))
      ) {
        uint256 tokenId = collectionsArray[i].mintCard(to, card.uri);

        // Ajoutez la carte à la liste des cartes de l'utilisateur
        usersCards[to].push(card);

        return tokenId;
      }
    }
  }

  // Fonction pour récupérer toutes les collections
  function getCollections() public view returns (Collection[] memory) {
    return collectionsArray;
  }

  function getUserCardsDetailed(
    address to
  ) external view returns (Collection.Card[] memory) {
    return usersCards[to];
  }

  // function tradeCard(
  //   address from,
  //   address to,
  //   string calldata collectionId,
  //   uint256 cardId
  // ) external onlyOwner {
  //   // Parcourir `collectionsArray` pour trouver la collection avec l'ID donné
  //   for (uint i = 0; i < collectionsArray.length; i++) {
  //     if (
  //       keccak256(abi.encodePacked(collectionsArray[i].getId())) ==
  //       keccak256(abi.encodePacked(collectionId))
  //     ) {
  //       // Vérifier que l'utilisateur `from` possède bien la carte
  //       Collection.Card[] storage fromCards = usersCards[from];
  //       bool cardFound = false;
  //       uint cardIndex;

  //       for (uint j = 0; j < fromCards.length; j++) {
  //         if (fromCards[j].id == cardId) {
  //           cardFound = true;
  //           cardIndex = j;
  //           break;
  //         }
  //       }

  //       // Transférer le NFT dans le contrat `Collection`
  //       collectionsArray[i].safeTransferFrom(from, to, cardId);

  //       // Mettre à jour `usersCards`
  //       usersCards[to].push(fromCards[cardIndex]);
  //       fromCards[cardIndex] = fromCards[fromCards.length - 1];
  //       fromCards.pop();

  //       return;
  //     }
  //   }
  // }
  // function tradeCard(
  //   address from,
  //   address to,
  //   uint256 cardId
  // ) external onlyOwner {
  //   bool cardFound = false;

  //   // Parcourir toutes les collections pour trouver la carte avec l'ID donné
  //   for (uint i = 0; i < collectionsArray.length; i++) {
  //     Collection.Card[] storage fromCards = usersCards[from];

  //     for (uint j = 0; j < fromCards.length; j++) {
  //       if (fromCards[j].id == cardId) {
  //         // Carte trouvée
  //         cardFound = true;

  //         // Transférer le NFT dans le contrat `Collection`
  //         collectionsArray[i].safeTransferFrom(from, to, cardId);

  //         // Mettre à jour `usersCards`
  //         usersCards[to].push(fromCards[j]);
  //         fromCards[j] = fromCards[fromCards.length - 1];
  //         fromCards.pop();

  //         return;
  //       }
  //     }
  //   }
  //   require(cardFound, "Card not found");
  // }

  function tradeCard(
    address from,
    address to,
    uint256 cardId
  ) external onlyOwner {
    Collection.Card[] storage fromCards = usersCards[from];
    for (uint i = 0; i < fromCards.length; i++) {
      if (fromCards[i].id == cardId) {
        usersCards[to].push(fromCards[i]);
        fromCards[i] = fromCards[fromCards.length - 1];
        fromCards.pop();
        break;
      }
    }
  }

  // function tradeCard(
  //   address from,
  //   address to,
  //   uint256 cardId
  // ) external onlyOwner {
  //   bool cardFound = false;

  //   for (uint i = 0; i < collectionsArray.length; i++) {
  //     // Vérifie que le token existe dans la collection
  //     if (collectionsArray[i].ownerOf(cardId) == from) {
  //       cardFound = true;

  //       // Transférer le NFT dans le contrat `Collection`
  //       // collectionsArray[i].transferFrom(from, to, cardId);

  //       // Mettre à jour `usersCards`
  //       Collection.Card[] fromCards = usersCards[from];
  //       for (uint j = 0; j < fromCards.length; j++) {
  //         if (fromCards[j].id == cardId) {
  //           usersCards[to].push(fromCards[j]);
  //           fromCards[j] = fromCards[fromCards.length - 1];
  //           fromCards.pop();
  //           break;
  //         }
  //       }

  //       return;
  //     }
  //   }

  //   // require(cardFound, "Card not found or does not belong to sender");
  // }
}
