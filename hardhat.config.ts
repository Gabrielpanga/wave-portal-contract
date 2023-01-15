import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const {
  PRIVATE_KEY = "",
  STAGING_QUICKNODE_KEY,
  PROD_QUICKNODE_KEY,
} = process.env;

if (!PROD_QUICKNODE_KEY) {
  console.info("PROD_QUICKNODE_KEY was not set");
}

if (!STAGING_QUICKNODE_KEY) {
  console.info("STAGING_QUICKNODE_KEY was not set");
}

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: STAGING_QUICKNODE_KEY,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: PROD_QUICKNODE_KEY,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
