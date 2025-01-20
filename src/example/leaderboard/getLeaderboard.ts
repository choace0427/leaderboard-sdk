import { LeaderboardSDK } from "leaderBoardSDK";
import { getLeaderboardAddress } from "example/factory/getLeaderboardAddress";

const ENVIRONMENT = "dev"; // Constant for environment
const CONTRACT_LABEL = "TEST LEADERBOARD"; // Constant for created leaderboard contract ID
const LEADERBOARD_ID = "TEST LEADERBOARD"; // Constant for leaderboard label

async function getLeaderboard() {
  const leaderboardAddress = await getLeaderboardAddress(
    ENVIRONMENT,
    CONTRACT_LABEL
  );

  if (leaderboardAddress) {
    // Initialize the LeaderboardSDK with the contract address and chain configuration
    const leaderboard = new LeaderboardSDK(ENVIRONMENT, "", leaderboardAddress);

    // Connect to the leaderboard contract
    const isConnected = leaderboard.leaderBoardConnect();
    if (!isConnected) {
      console.error("Failed to connect to the leaderboard contract.");
      return;
    }

    console.log("Connected to the leaderboard contract");

    try {
      // Fetch the leaderboard for a specific label
      const [players, scores] = await leaderboard.getLeaderboard(
        LEADERBOARD_ID
      );

      // Log the results
      console.log("Players:", players);
      console.log("Scores:", scores);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }
}

// Execute the getLeaderboard function and handle any uncaught errors
getLeaderboard().catch(console.error);
