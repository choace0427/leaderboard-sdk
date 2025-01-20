# Leaderboard Smart Contract - TypeScript SDK

NPC Labs presents the TypeScript SDK for our On-Chain Leaderboard Smart Contract, a key contributor to B3 - the gaming ecosystem. This SDK enables game developers to seamlessly incorporate secure on-chain leaderboards for tracking and displaying player scores on the blockchain.

## Installation

You can install our TypeScript SDK using the commands below:

```
yarn add @b3dotfun/leaderboards
```

```
npm install @b3dotfun/leaderboards
```

## Getting Started

### LeaderboardSDK Props

- **`ENV`**: (`"dev"` | `"prod"`)

  - This parameter specifies the environment in which the SDK is operating. It can either be `"dev"` for development or `"prod"` for production. The SDK will use the corresponding configuration settings based on this value.

- **`walletKey`**: `string` (optional)

  - This is an optional parameter that represents the wallet key used for transactions. If provided, it should be a hexadecimal string starting with `0x`.
  - The `walletKey` is required for write operations that modify the state of the blockchain (e.g., deploying contracts, adding/removing admins, setting scores). For read operations (e.g., retrieving leaderboard data, player scores), the `walletKey` is **not required**.

- **`contractAddress`**: `string` (optional)
  - This optional parameter specifies the address of the leaderboard contract. It should be a hexadecimal string starting with `0x`.
  - The `contractAddress` is used to interact with the specific leaderboard contract. If a valid contract address is provided, the SDK will use it for operations that require interaction with that contract.

### Initialize SDK

Factory Contract

```typescript
import { LeaderboardSDK } from "@b3dotfun/leaderboards";

const ENV = "dev" | "prod";
const factoryContract = new LeaderboardSDK(ENV);

const isFactoryConnected = factoryContract.factoryConnect();
if (!isFactoryConnected) {
  console.error("Failed to connect to the Factory contract.");
  return;
}

console.log("Connected to the Factory contract");
```

Leaderboard Contract

```typescript
import { LeaderboardSDK } from "@b3dotfun/leaderboards";

const ENV = "dev" | "prod";
const CONTRACT_LABEL = "label";

const factoryContract = new LeaderboardSDK(ENV);

const isFactoryConnected = factoryContract.factoryConnect();
if (!isFactoryConnected) {
  console.error("Failed to connect to the Factory contract.");
  return;
}

console.log("Connected to the Factory contract");

const leaderboardAddress = await factoryContract.getLeaderBoards(
  CONTRACT_LABEL
);

if (leaderboardAddress) {
  const leaderboard = new LeaderboardSDK(ENV, "", leaderboardAddress);

  const isConnected = leaderboard.leaderBoardConnect();
  if (!isConnected) {
    console.error("Failed to connect to the Leaderboard contract.");
    return;
  }

  console.log("Connected to the Leaderboard contract");
}
```

## Setting Up Account

Contract write call requires wallet account which can be initiated in two ways.

### JSON-RPC Account

A JSON-RPC Account is an Account whose signing keys are stored on the external Wallet
A JSON-RPC Account can just be initialized as an Address string.
In the usage below, we are extracting the address from a Browser
Extension Wallet (e.g. MetaMask) with the window.ethereum
Provider via eth_requestAccounts

```typescript
import "viem/window";

const [account] = await window.ethereum.request({
  method: "eth_requestAccounts",
});
```

#### Local Accounts (Private Key etc)

A Local Account is an Account whose signing keys are stored on
the consuming user's machine. It performs signing of
transactions & messages with a private key before broadcasting
the transaction or message over JSON-RPC.

```typescript
const account = `0x${process.env.YOUR_PRIVATE_KEY}` || `{0x}`;
```

## Examples of interacting with contracts (Write & Read)

### Deploy Leaderboard Contract

The `deployLeaderboardContract` method deploys a new leaderboard by a factory contract.

```typescript
const ENV = "dev" | "prod";
const ACCOUNT = `0x${YOUR_PRIVATE_KEY}`; // Constant for account
const ADMIN_ADDRESS = "0x...";
const CONTRACT_LABEL = "label";

// Initialize the LeaderboardSDK with the ENV and ACCOUNT
const factoryContract = new LeaderboardSDK(ENV, ACCOUNT);

// Connect to the factory contract
const isFactoryConnected = factoryContract.factoryConnect();
if (!isFactoryConnected) {
  console.error("Failed to connect to the Factory contract.");
  return;
}

console.log("Connected to the Factory contract");

// Create a leaderboard by factory contract
const response = await factoryContract.deployLeaderboardContract(
  ADMIN_ADDRESS,
  CONTRACT_LABEL
);
```

### Get Deployed Leaderboard Contract Address

The `getLeaderBoards` method gets the address of the deployed leaderboard contract by a factory contract.

```typescript
const ENV = "dev" | "prod";
const CONTRACT_LABEL = "label";

// Initialize the LeaderboardSDK with ENV
const factoryContract = new LeaderboardSDK(ENV);

// Connect to the factory contract
const isFactoryConnected = factoryContract.factoryConnect();
if (!isFactoryConnected) {
  console.error("Failed to connect to the Factory contract.");
  return;
}

console.log("Connected to the Factory contract");

const leaderboardAddress = await factoryContract.getLeaderBoards(
  CONTRACT_LABEL
);
```

### Create Leaderboard Contract

The `createLeaderboardContract` method creates a new leaderboard with specified parameters.

```typescript
const ENV = "dev" | "prod";
const ACCOUNT = `0x${YOUR_PRIVATE_KEY}`;

if (leaderboardAddress) {
  // Initialize the LeaderboardSDK with the contract address and chain configuration
  const leaderboard = new LeaderboardSDK(ENV, ACCOUNT, leaderboardAddress);

  // Connect to the leaderboard contract
  const isConnected = leaderboard.leaderBoardConnect();
  if (!isConnected) {
    console.error("Failed to connect to the Leaderboard contract.");
    return;
  }

  console.log("Connected to the Leaderboard contract");

  try {
    const LEADERBOARD_ID = "TEST LEADERBOARD";
    const MAX_LIMIT = Number.MAX_SAFE_INTEGER;
    const START_TIME = 0;
    const END_TIME = Number.MAX_SAFE_INTEGER;

    // Create a leaderboard with specified parameters
    const entries = await leaderboard.createLeaderboard(
      LEADERBOARD_ID,
      MAX_LIMIT,
      START_TIME,
      END_TIME
    );
    console.log("Leaderboard created successfully:", entries);
  } catch (error) {
    console.error("Error creating leaderboard:", error);
  }
}
```

### Set Score

The `setScore` method sets the scores for a leaderboard with specificed parameters.

```typescript
const ENVIRONMENT = "dev" | "prod";
const ACCOUNT = `0x${YOUR_PRIVATE_KEY}`;
const PLAYERS = ["0x...", "0x...", "0x..."];
const SCORES = [100, 200, 300];

if (leaderboardAddress) {
  // Initialize the LeaderboardSDK with the contract address and chain configuration
  const leaderboard = new LeaderboardSDK(ENV, ACCOUNT, leaderboardAddress);

  // Connect to the leaderboard contract
  const isConnected = leaderboard.leaderBoardConnect();
  if (!isConnected) {
    console.error("Failed to connect to the Leaderboard contract.");
    return;
  }

  console.log("Connected to the Leaderboard contract");

  const LEADERBOARD_ID = "label";
  const response = await leaderboard.setScore(LEADERBOARD_ID, PLAYERS, SCORES);
}
```

### Fetch Leaderboard

The `getLeaderboard` method fetches the leaderboard.

```typescript
const ENVIRONMENT = "dev" | "prod";
const CONTRACT_LABEL = "label";
const LEADERBOARD_ID = "label";

if (leaderboardAddress) {
  // Initialize the LeaderboardSDK with the contract address and chain configuration
  const leaderboard = new LeaderboardSDK(ENV, ACCOUNT, leaderboardAddress);

  // Connect to the leaderboard contract
  const isConnected = leaderboard.leaderBoardConnect();
  if (!isConnected) {
    console.error("Failed to connect to the Leaderboard contract.");
    return;
  }

  console.log("Connected to the Leaderboard contract");

  const response = await leaderboard.getLeaderboard(LEADERBOARD_ID);
}
```

The `getHydratedLeaderboard` method fetches the leaderboard data including usernames and avatars.

```typescript
// Initialize the LeaderboardSDK and etc like `getLeaderboard`
const response = await leaderboard.getHydratedLeaderboard();
```

### Fetch Leaderboard and Score via GraphQL

The `listLeaderboards` method fetches the leaderboard and score for a specific label and player address.

```typescript
const ENVIRONMENT = "dev" | "prod";
const LEADERBOARD_ID = "label";
const leaderboardAddress = "0xF577588bF5B0AF78Cb92711C3Eb66e03383af275";
const PAGE_NUMBER = 1;
const PAGE_SIZE = 10;

// Initialize the LeaderboardSDK with ENV
const leaderboard = new LeaderboardSDK(ENVIRONMENT);

// Connect to the Leaderboard contract
...

const response = await leaderboard.listLeaderboards(
  LEADERBOARD_ID,
  leaderboardAddress,
  PAGE_NUMBER,
  PAGE_SIZE
);
```

Example methods can be found in `src/example` in the SDK package repository.
