// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";


contract Collection is ERC721URIStorage,ERC721Enumerable, Ownable {
    string public collectionName;
    uint public cardCount; // Nombre total de cartes possibles dans cette collection
    uint public mintedCount; // Nombre de cartes mintées
    uint256 private tokenIds = 0;


    mapping(address => uint256[]) public usersTokens;

    constructor(address owner, string memory _name, uint _cardCount) Ownable(owner) ERC721(_name, "TCG") {
        collectionName = _name;
        cardCount = _cardCount;
        console.log("Collection.sol : Collection created");
        mintedCount = 0;
    }

    // function mintCard(address to, string memory _tokenURI) public onlyOwner returns (uint256){
    //     tokenIds++;
    //     uint256 newCardId = tokenIds;
    //     _mint(to, newCardId);
    //     _setTokenURI(newCardId, _tokenURI);
    //     console.log("Minted : ", _tokenURI, newCardId);
    //     // usersTokens[to].push(globalCardId); // Ajoute le token minté à l'utilisateur
    //     // mintedCount += 1;
    //     return newCardId;
    // }

    function mintCard(address to, string memory _tokenURI) public onlyOwner returns (uint256) {
      tokenIds++;
      uint256 newCardId = tokenIds;
      _mint(to, newCardId);
      _setTokenURI(newCardId, _tokenURI);
      
      // Ajoute le token minté à l'utilisateur
      usersTokens[to].push(newCardId);
      
      console.log("Minted : ", _tokenURI, newCardId);
    return newCardId;
}


    // Nouvelle fonction pour renvoyer les tokens de l'utilisateur sous forme de tableau
    function getUserTokens(address user) external view returns (uint256[] memory) {
        return usersTokens[user];
    }
    /* Overriding functions */
  function _increaseBalance(address account, uint128 initialValue) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, initialValue);
  }
  function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable)
    returns(address)
  {
    return super._update(to, tokenId, auth);
  }
  function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable)
    returns(bool)
  {
    return super.supportsInterface(interfaceId);
  }
  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }
  function _baseURI() internal pure override(ERC721)
    returns(string memory)
  {
    return "http://localhost:3030/getCard/";
  }

}
