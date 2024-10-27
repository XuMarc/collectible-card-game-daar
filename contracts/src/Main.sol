// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";

contract Main is Ownable {
  int private count;
  Collection[] collectionsArray;
  mapping(address => Collection.Card[]) private usersCards;

  // uint256 private boosterIdCounter;
  // mapping(uint256 => Booster) public boosters;
  // mapping(uint256 => bool) public redeemedBoosters;


  // struct Booster {
  //   uint256 id;
  //   address owner;
  //   Collection.Card[] cards;
  //   string boosterURI;
  // }

  constructor() Ownable(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199) {}
  // constructor() ERC721("BoosterNFT", "BSTR") Ownable(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199) {}


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
  //   uint256 cardId
  // ) external onlyOwner {
  //   Collection.Card[] storage fromCards = usersCards[from];
  //   for (uint i = 0; i < fromCards.length; i++) {
  //     if (fromCards[i].id == cardId) {
  //       usersCards[to].push(fromCards[i]);
  //       fromCards[i] = fromCards[fromCards.length - 1];
  //       fromCards.pop();
  //       break;
  //     }
  //   }
  // }

  function tradeCard(
    address from,
    address to,
    uint256 cardId
  ) external onlyOwner {
    bool cardFound = false;

    for (uint i = 0; i < collectionsArray.length; i++) {
      // Vérifie que le token existe dans la collection
      if (collectionsArray[i].ownerOf(cardId) == from) {
        cardFound = true;

        // Transférer le NFT dans le contrat `Collection`
        collectionsArray[i].safeTransferFrom(from, to, cardId);

        // Mettre à jour `usersCards`
        Collection.Card[] fromCards = usersCards[from];
        for (uint j = 0; j < fromCards.length; j++) {
          if (fromCards[j].id == cardId) {
            usersCards[to].push(fromCards[j]);
            fromCards[j] = fromCards[fromCards.length - 1];
            fromCards.pop();
            break;
          }
        }

        return;
      }
    }
  }

  // Mint un booster avec des cartes données depuis l'api
  // function mintBooster(
  //   address to,
  //   Collection.Card[] memory cards,
  //   string calldata boosterURI
  // ) external onlyOwner returns (uint256) {
  //   boosterIdCounter++;
  //   uint256 newBoosterId = boosterIdCounter;

  //   _mint(to, newBoosterId);
  //   _setTokenURI(newBoosterId, boosterURI);

  //   // store les infos du boosters
  //   boosters[newBoosterId] = Booster(newBoosterId, to, cards, boosterURI);

  //   return newBoosterId;
  // }

  // claim un booster 
  // function redeemBooster(uint256 boosterId) external {
  //   require(ownerOf(boosterId) == msg.sender, "pas le bon owner du booster");
  //   require(!redeemedBoosters[boosterId], "booster deja claimed");

  //   redeemedBoosters[boosterId] = true;

  //   Booster memory booster = boosters[boosterId];
  //   for (uint i = 0; i < booster.cards.length; i++) {
  //     usersCards[msg.sender].push(booster.cards[i]);
  //   }
  //   _burn(boosterId);
  // }
}
