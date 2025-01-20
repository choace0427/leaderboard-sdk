import * as dotenv from "dotenv";
import { LeaderboardSDK } from "leaderBoardSDK";
import { getLeaderboardAddress } from "example/factory/getLeaderboardAddress";

dotenv.config();

const ENVIRONMENT = "dev"; // Constant for environment
const CONTRACT_LABEL = "TEST LEADERBOARD"; // Constant for created leaderboard contract ID
const LEADERBOARD_ID = "TEST LEADERBOARD"; // Constant for leaderboard ID
const ACCOUNT = `ox${process.env.YOUR_PRIVATE_KEY}`; // Constant for account

async function setScore() {
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
      const entries = await leaderboard.setScore(
        LEADERBOARD_ID,
        [
          "0xDaed2A2b14d9769eAC43c63121718af7ca4Ac5D1",
          "0xD0501094c315899D15fbF1FC6d7F814049cFb8d7",
          "0x95dEa4e91fea10cEa93c4c7Ac7C7E8DB5E03ccEB",
        ],
        [2000, 1000, 500]
      );
      console.log("Set Score successfully:", entries);
    } catch (error) {
      console.error("Error setting score:", error);
    }
  }
}

// Execute the setScore function and handle any uncaught errors
setScore().catch(console.error);
