import * as dotenv from "dotenv";
import { LeaderboardSDK } from "leaderBoardSDK";
import { getLeaderboardAddress } from "example/factory/getLeaderboardAddress";

dotenv.config();

const ENVIRONMENT = "dev"; // Constant for environment
const CONTRACT_LABEL = "TEST LEADERBOARD"; // Constant for created leaderboard contract ID
const LEADERBOARD_ID = "TEST LEADERBOARD"; // Constant for leaderboard ID
const ACCOUNT = `0x${process.env.YOUR_PRIVATE_KEY}`; // Constant for account

async function createLeaderboard() {
  const leaderboardAddress = await getLeaderboardAddress(
    ENVIRONMENT,
    CONTRACT_LABEL
  );

  if (leaderboardAddress) {
    // Initialize the LeaderboardSDK with the contract address and chain configuration
    const leaderboard = new LeaderboardSDK(
      ENVIRONMENT,
      ACCOUNT,
      leaderboardAddress
    );

    // Connect to the leaderboard contract
    const isConnected = leaderboard.leaderBoardConnect();
    if (!isConnected) {
      console.error("Failed to connect to the Leaderboard contract.");
      return;
    }

    console.log("Connected to the Leaderboard contract");

    try {
      // Create a leaderboard with specified parameters
      const entries = await leaderboard.createLeaderboard(
        LEADERBOARD_ID,
        Number.MAX_SAFE_INTEGER,
        0,
        Number.MAX_SAFE_INTEGER
      );
      console.log("Leaderboard created successfully:", entries);
    } catch (error) {
      console.error("Error creating leaderboard:", error);
    }
  }
}

// Execute the createLeaderboard function and handle any uncaught errors
createLeaderboard().catch(console.error);
