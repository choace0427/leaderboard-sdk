import { LeaderboardSDK } from "leaderBoardSDK";

const ENVIRONMENT = "dev"; // Constant for environment
const LEADERBOARD_ID = "neighborhood-defense"; // Constant for leaderboard label
const CONTRACT_ADDRESS = "0xF577588bF5B0AF78Cb92711C3Eb66e03383af275"; // Constant for contract address
const PAGE_NUMBER = 1; // Constant for page number
const PAGE_SIZE = 10; // Constant for page size

async function getListLeaderboard() {
  // Initialize the LeaderboardSDK with ENVIRONMENT
  const leaderboard = new LeaderboardSDK(ENVIRONMENT);

  // Connect to the leaderboard contract
  const isConnected = leaderboard.leaderBoardConnect();
  if (!isConnected) {
    console.error("Failed to connect to the leaderboard contract.");
    return;
  }

  console.log("Connected to the leaderboard contract");

  try {
    // Fetch the leaderboard for a specific label
    const result = await leaderboard.listLeaderboards(
      LEADERBOARD_ID,
      CONTRACT_ADDRESS,
      PAGE_NUMBER,
      PAGE_SIZE
    );

    // Log the results
    console.log("results:", result);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
}

// Execute the getListLeaderboard function and handle any uncaught errors
getListLeaderboard().catch(console.error);
