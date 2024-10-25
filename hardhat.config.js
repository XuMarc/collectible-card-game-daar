/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.27',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
}
require('@nomiclabs/hardhat-ethers')
