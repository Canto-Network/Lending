import fs from "fs";
import "@nomiclabs/hardhat-ethers";
//import "@nomiclabs/hardhat-waffle";
import {HardhatUserConfig} from 'hardhat/types';
import "hardhat-deploy";
import "ethereum-waffle";
import "hardhat-preprocessor"; 

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts: [
        "a73db736315fd5eacec2785dd48a3e6d50dbadc8e7778a1cb24e0b6d75a5ffea",
      ]
    },
    canto_testnet : {
      url: "http://167.172.246.241:8545",
      accounts: [
        "87c6aa351b2a773106720c4c9a832440bc40cc3d11b600c2bee6bb097344ee06"
      ]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  namedAccounts : {
    deployer: 0,
    user1: 1,
    user2: 2,
    liquidator: 3 
  },
  preprocess: {
    eachLine: (hre) => ({
      transform: (line: string) => {
        if (line.match(/^\s*import /i)) {
          getRemappings().forEach(([find, replace]) => {
            if (line.match(find)) {
              line = line.replace(find, replace);
            }
          });
        }
        return line;
      },
    }),
  },
  paths: {
    deploy: "./deploy/canto",
    sources: "./src",
    tests: "./test/Treasury",
    cache:"./cache_hardhat",
    artifacts: "./artifacts"
  }
};

function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean) // remove empty lines
    .map((line) => line.trim().split("="));
}

export default config;