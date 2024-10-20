// Import Hardhat Runtime Environment
const hre = require("hardhat");

async function main() {
  // On récupère le contract factory pour le déploiement
  const Main = await hre.ethers.getContractFactory("Main");
  console.log("Déploiement du contrat Main...");

  // Déploiement du contrat
  const mainContract = await Main.deploy();
  await mainContract.deployed();

  console.log("Contrat Main déployé à l'adresse:", mainContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  