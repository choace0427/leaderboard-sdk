export type Leaderboard = {
  contractAddress: string;
  label: string;
  isActive: boolean;
  maxLimit: string;
  startTime: string;
  endTime: string;
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageNumber: number;
  pageSize: number;
};

export type Score = {
  playerAddress: string;
  score: number;
};

export type ListLeaderboardsResponse = {
  getLeaderboardByLabel: Leaderboard;
  getScores: {
    pageInfo: PageInfo;
    scores: Score[];
  };
};

export type ProfileInfo = {
  wallet: string;
  score: number;
  username: string | null;
  avatar: string | null;
};
