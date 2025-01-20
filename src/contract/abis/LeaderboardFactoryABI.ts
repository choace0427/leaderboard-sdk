export const LeaderboardFactoryABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "leaderBoardAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "label",
        type: "string",
      },
    ],
    name: "LeaderBoardCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
      {
        internalType: "string",
        name: "_label",
        type: "string",
      },
    ],
    name: "deployLeaderboardContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_label",
        type: "string",
      },
    ],
    name: "getLeaderBoards",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "label",
        type: "string",
      },
    ],
    name: "leaderBoards",
    outputs: [
      {
        internalType: "address",
        name: "leaderBoardAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;