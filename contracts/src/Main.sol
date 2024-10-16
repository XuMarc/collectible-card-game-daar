// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";

contract Main {
  uint private globalCardId; // idcard across all collections, (should it be unique globally or only in a collection ?)
  uint private count;
  mapping(uint => Collection) private collections; //hashmap(id,collection);

  address public owner;
  modifier onlyOwner() {
    require(msg.sender == owner, "SEUL L'ADMIN PEUT APPELER CETTE FONCTION !");
    _;
  }

  constructor() {
    count = 0;
    globalCardId = 1;
    owner = msg.sender; // Celui qui déploie le contrat(moi) est le owner 
  }

  function createCollection(string calldata name, uint cardCount) external onlyOwner{
    collections[count++] = new Collection(name, cardCount);
  }

  function mint(uint256 collectionId, address to, string memory tokenURI) external onlyOwner {
    require(collectionId < count, "COLLECTION DOES NOT EXIST");
    Collection collection = collections[collectionId];
    collection.mintCard(to, tokenURI, globalCardId);
    globalCardId++;
  }
}