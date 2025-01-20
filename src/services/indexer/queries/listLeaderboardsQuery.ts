export const listLeaderboardsQuery = `
  query MyQuery(
    $label: String!
    $contractAddress: String!
    $pageNumber: Int!
    $pageSize: Int!
  ) {
    getLeaderboardByLabel(label: $label, contractAddress: $contractAddress) {
      contractAddress
      label
      isActive
      maxLimit
      startTime
      endTime
    }
    getScores(contractAddress: $contractAddress, label: $label, pageInfo: {pageNumber: $pageNumber, pageSize: $pageSize}) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        pageNumber
        pageSize
      }
      scores {
        contractAddress
        leaderboardLabel
        playerAddress
        rank
        score
        updatedAt
      }
    }
  }
`;
