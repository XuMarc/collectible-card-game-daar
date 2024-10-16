// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Comment ça marche pour nous dans notre tête :
// ON CRÉE UNE COLLECTION "PIKACHU" 100,
// ON MINT DES CARTES PIKACHU JUSQUA CE QUON NE PUISSE PLUS (DONC 100 CARTES PIKACHU)
contract Collection is ERC721URIStorage {
  // string public name; // NOM DE LA COLLECTTION, NOM DE LA CARTE SPÉCIFIQUE A CETTE COLLECTION (?)
  uint public cardCount; // = RARETE JE SUPPOSE
  uint public mintedCount; // TOTAL EN CIRCULATION SUR LA CHAIN

  constructor(string memory _name, uint _cardCount) ERC721(_name, "TCG") {
    cardCount = _cardCount;
    mintedCount = 0;
  }

  function mintCard(
    address to,
    string memory tokenURI,
    uint globalCardId
  ) external {
    require(
      mintedCount < cardCount,
      "ALL CARDS IN THIS COLLECTION ARE ALREADY MINTED"
    );
    _mint(to, globalCardId);
    _setTokenURI(globalCardId, tokenURI);

    mintedCount += 1;
  }
}