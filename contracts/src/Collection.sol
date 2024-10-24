// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract Collection is ERC721URIStorage, Ownable {
    string public collectionName;
    string public img;
    uint public cardCount; // Nombre total de cartes dans la collection
    uint256 private tokenIds;
    string public id;
    struct Card {
        uint256 id;
        string name;
        string uri; // URL de l'image de la carte
    }

    Card[] public cards; // Tableau de cartes dans cette collection
    // mapping(address => uint256[]) public usersTokens;

    constructor(
        string memory _id,
        address owner, 
        string memory _name, 
        string memory _img,
        uint _cardCount, 
        Card[] memory _cards
    ) Ownable(owner) ERC721(_name, "TCG") {
        id = _id;
        collectionName = _name;
        img = _img;
        cardCount = _cardCount;
        for (uint i = 0; i < _cards.length; i++) {
            cards.push(_cards[i]);
        }
    }

    // Mint une carte
    function mintCard(address to, string memory _tokenURI) public onlyOwner returns (uint256) {
        tokenIds++;
        uint256 newCardId = tokenIds;
        _mint(to, newCardId);
        _setTokenURI(newCardId, _tokenURI);

        // Assigner le token à l'utilisateur
        // usersTokens[to].push(newCardId);

        console.log("Minted : ", _tokenURI, newCardId);
        return newCardId;
    }

    // Obtenir les tokens d'un utilisateur
    // function getUserTokens(address user) external view returns (uint256[] memory) {
    //     return usersTokens[user];
    // }

    // Obtenir toutes les cartes de la collection
    function getCards() public view returns (Card[] memory) {
        return cards;
    }

    function getId() public view returns (string memory) {
        return id;
    }

    // Override pour assurer la compatibilité
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:3001/";
    }
    function getLogo() public view returns (string memory) {
        return img;
    }
}