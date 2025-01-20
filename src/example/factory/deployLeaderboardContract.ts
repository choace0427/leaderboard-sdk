import * as dotenv from "dotenv";
import { LeaderboardSDK } from "leaderBoardSDK";

dotenv.config();

const ENVIRONMENT = "dev"; // Constant for environment
const ACCOUNT = `0x${process.env.YOUR_PRIVATE_KEY}`; // Constant for account
const ADMIN_ADDRESS = "0x..."; // Constant for contract address
const CONTRACT_LABEL = "label"; // Constant for created leaderboard contract ID

async function deployLeaderboardContract() {
  // Initialize the LeaderboardSDK with the contract address and chain configuration
  const leaderboard = new LeaderboardSDK(ENVIRONMENT, ACCOUNT);

  // Connect to the factory contract
  const isConnected = leaderboard.factoryConnect();
  if (!isConnected) {
    console.error("Failed to connect to the Factory contract.");
    return;
  }

  console.log("Connected to the Factory contract");

  try {
    // Create a leaderboard by factory contract
    const entries = await leaderboard.deployLeaderboardContract(
      ADMIN_ADDRESS,
      CONTRACT_LABEL
    );
    console.log("Leaderboard created successfully:", entries);
  } catch (error) {
    console.error("Error creating leaderboard:", error);
  }
}

// Execute the deployLeaderboardContract function and handle any uncaught errors
deployLeaderboardContract().catch(console.error);
