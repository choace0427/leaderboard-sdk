import { LeaderboardSDK } from "leaderBoardSDK";

/**
 * Fetches the leaderboard address for a given environment and contract label.
 *
 * @param ENVIRONMENT - The environment to use ("dev" or "prod").
 * @param CONTRACT_LABEL - The label of the leaderboard to retrieve.
 * @returns The address of the leaderboard or undefined if an error occurs.
 */
export async function getLeaderboardAddress(
  ENVIRONMENT: "dev" | "prod",
  CONTRACT_LABEL: string
): Promise<string | undefined> {
  const leaderboardSDK = new LeaderboardSDK(ENVIRONMENT);

  // Attempt to connect to the factory contract
  const isFactoryConnected = leaderboardSDK.factoryConnect();
  if (!isFactoryConnected) {
    console.error("Failed to connect to the Factory contract.");
    return undefined; // Return undefined if connection fails
  }

  try {
    // Fetch the leaderboard address
    const leaderboardAddress = await leaderboardSDK.getLeaderBoards(
      CONTRACT_LABEL
    );

    if (!leaderboardAddress) {
      console.log(`No leaderboard found for label: ${CONTRACT_LABEL}`);
      return undefined; // Handle case where no address is found
    }

    console.log("Leaderboard address:", leaderboardAddress);
    return leaderboardAddress; // Return the fetched address
  } catch (error) {
    console.error(
      "Error getting leaderboard address:",
      error instanceof Error ? error.message : error
    );
    return undefined; // Return undefined on error
  }
}
