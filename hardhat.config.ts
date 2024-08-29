import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545/",
      accounts: ["0xf390f622b51f6f461a93e053839fa943fabcf4405dcd07eba4aa5256276d81c4"],
    },
  },
  solidity: "0.8.24",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
