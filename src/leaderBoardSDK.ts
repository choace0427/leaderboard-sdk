import type {
  Chain,
  Hex,
  GetContractReturnType,
  WalletClient,
  WriteContractReturnType,
  EIP1193Provider,
  Address,
} from "viem";
import { createWalletClient, getContract, http, custom } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { b3MainnetConfig, b3SepoliaConfig } from "./config";
import { B3APIUrl } from "./constants";
import { LeaderboardABI } from "./contract/abis/LeaderboardABI";
import { LeaderboardFactoryABI } from "./contract/abis/LeaderboardFactoryABI";
import { listLeaderboardsQuery } from "./services/indexer/queries/listLeaderboardsQuery";
import { fetchQuery } from "./services/indexer/fetcher";
import { ListLeaderboardsResponse, ProfileInfo } from "./type";

export type QueryResponse<T> = {
  data: T;
};

export class LeaderboardSDK {
  private leaderboardFactoryContract: GetContractReturnType<
    typeof LeaderboardFactoryABI,
    WalletClient
  >;

  private leaderboardContract: GetContractReturnType<
    typeof LeaderboardABI,
    WalletClient
  >;

  private leaderboardFactoryContractAddress: Hex;
  private leaderboardContractAddress: Hex;
  private chain: Chain;
  private indexerEndpoint: string;
  private walletKey: string;

  constructor(
    ENV: "dev" | "prod",
    walletKey?: string,
    contractAddress?: string
  ) {
    if (walletKey && !walletKey.startsWith("0x")) {
      walletKey = `0x${walletKey}`;
    }

    if (contractAddress && !contractAddress.startsWith("0x")) {
      contractAddress = `0x${contractAddress}`;
    }

    const config = ENV === "dev" ? b3SepoliaConfig : b3MainnetConfig;
    this.chain = config.chain;
    this.indexerEndpoint = config.indexerUrl;
    this.walletKey = walletKey || "";

    this.leaderboardFactoryContractAddress =
      config.leaderboardFactoryContractAddress;
    this.leaderboardContractAddress = (contractAddress || "0x") as Hex;
  }

  public factoryConnect(provider?: EIP1193Provider): boolean {
    try {
      const client = createWalletClient({
        chain: this.chain,
        transport: provider ? custom(provider) : http(),
      });

      this.leaderboardFactoryContract = getContract({
        address: this.leaderboardFactoryContractAddress,
        abi: LeaderboardFactoryABI,
        client: client,
      });

      return true; // Connection successful
    } catch (error) {
      console.error("Connection failed:", error);
      return false; // Connection failed
    }
  }

  public leaderBoardConnect(provider?: EIP1193Provider): boolean {
    try {
      const client = createWalletClient({
        chain: this.chain,
        transport: provider ? custom(provider) : http(),
      });

      this.leaderboardContract = getContract({
        address: this.leaderboardContractAddress,
        abi: LeaderboardABI,
        client: client,
      });

      return true; // Connection successful
    } catch (error) {
      console.error("Connection failed:", error);
      return false; // Connection failed
    }
  }

  private async handleError(error: any): Promise<never> {
    if (error.data === "0xce967011") {
      throw new Error("Leaderboard already created");
    } else if (error.data === "0x72f68b1f") {
      throw new Error("Leaderboard not created");
    } else if (error.data === "0xa741a045") {
      throw new Error("Score already set for this player");
    } else if (error.data === "0x4456a11e") {
      throw new Error("Cannot decrement score below zero");
    } else if (error.data === "0x441dfbd6") {
      throw new Error("Score not set for this player");
    } else if (error.data === "0xb8b000dd") {
      throw new Error("Leaderboard has not started yet");
    } else if (error.data === "0x9fde1257") {
      throw new Error("Leaderboard has ended");
    } else if (error.data === "0x929fcbb9") {
      throw new Error("Leaderboard capacity reached");
    } else {
      throw error;
    }
  }

  /**
   * Creates a new leaderboard using the factory contract.
   * @param admin - The address of the admin for the new leaderboard.
   * @param label - The label of the leaderboard.
   * @param maxLimit - The maximum number of players in the leaderboard.
   * @param startTime - The start time of the leaderboard.
   * @param endTime - The end time of the leaderboard.
   */
  public async deployLeaderboardContract(
    admin: Address,
    label: string
  ): Promise<WriteContractReturnType> {
    if (!this.walletKey) {
      throw new Error("Wallet key not set");
    }

    try {
      return await this.leaderboardFactoryContract.write.deployLeaderboardContract(
        [admin, label],
        {
          account: privateKeyToAccount(<Hex>this.walletKey),
          chain: this.chain,
        }
      );
    } catch (error) {
      return await this.handleError(error);
    }
  }

  public async getLeaderBoards(label: string): Promise<Hex> {
    try {
      return (await this.leaderboardFactoryContract.read.getLeaderBoards([
        label,
      ])) as Hex;
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Adds a new admin to the leaderboard contract.
   * @param newAdmin - The address of the new admin to add.
   */
  public async addAdmin(newAdmin: Address): Promise<WriteContractReturnType> {
    if (!this.walletKey) {
      throw new Error("Wallet key not set");
    }

    try {
      return await this.leaderboardContract.write.addAdmin([newAdmin], {
        account: privateKeyToAccount(<Hex>this.walletKey),
        chain: this.chain,
      });
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Removes an admin from the leaderboard contract.
   * @param admin - The address of the admin to remove.
   */
  public async removeAdmin(admin: Address): Promise<WriteContractReturnType> {
    if (!this.walletKey) {
      throw new Error("Wallet key not set");
    }

    try {
      return await this.leaderboardContract.write.removeAdmin([admin], {
        account: privateKeyToAccount(<Hex>this.walletKey),
        chain: this.chain,
      });
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Creates a new leaderboard.
   * @param label - The label of the leaderboard.
   * @param maxLimit - The maximum number of players in the leaderboard.
   * @param startTime - The start time of the leaderboard.
   * @param endTime - The end time of the leaderboard.
   */
  public async createLeaderboard(
    label: string,
    maxLimit: number,
    startTime: number,
    endTime: number
  ): Promise<WriteContractReturnType> {
    if (!this.walletKey) {
      throw new Error("Wallet key not set");
    }

    try {
      return await this.leaderboardContract.write.createLeaderboard(
        [label, BigInt(maxLimit), BigInt(startTime), BigInt(endTime)],
        {
          account: privateKeyToAccount(<Hex>this.walletKey),
          chain: this.chain,
        }
      );
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Updates an existing leaderboard.
   * @param label - The label of the leaderboard.
   * @param maxLimit - The maximum number of players in the leaderboard.
   * @param startTime - The start time of the leaderboard.
   * @param endTime - The end time of the leaderboard.
   */
  public async updateLeaderboard(
    label: string,
    maxLimit: number,
    startTime: number,
    endTime: number
  ): Promise<WriteContractReturnType> {
    const contract = this.leaderboardContract.write;
    if (!this.walletKey) {
      throw new Error("Wallet key not set");
    }

    if (!this.leaderboardContractAddress) {
      throw new Error("Contract address not set");
    }

    try {
      return await contract.updateLeaderboard(
        [label, BigInt(maxLimit), BigInt(startTime), BigInt(endTime)],
        {
          account: privateKeyToAccount(<Hex>this.walletKey),
          chain: this.chain,
        }
      );
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Sets the score for a player in the leaderboard.
   * @param label - The label of the leaderboard.
   * @param players - An array of addresses of the players.
   * @param scores - An array of scores corresponding to the players.
   */
  public async setScore(
    label: string,
    players: Address[],
    scores: number[]
  ): Promise<WriteContractReturnType> {
    if (!this.walletKey) {
      throw new Error("Wallet key not set");
    }

    if (!this.leaderboardContractAddress) {
      throw new Error("Contract address not set");
    }

    try {
      return await this.leaderboardContract.write.setScoresBatch(
        [label, players, scores.map(score => BigInt(score))],
        {
          account: privateKeyToAccount(<Hex>this.walletKey),
          chain: this.chain,
        }
      );
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Increments the score for a player in the leaderboard.
   * @param label - The label of the leaderboard.
   * @param players - An array of addresses of the players.
   * @param increments - An array of amounts to increment the scores for the corresponding players.
   */
  public async incrementScore(
    label: string,
    players: Address[],
    increments: number[]
  ): Promise<WriteContractReturnType> {
    if (!this.walletKey) {
      throw new Error("Wallet key not set");
    }

    if (!this.leaderboardContractAddress) {
      throw new Error("Contract address not set");
    }

    try {
      return await this.leaderboardContract.write.incrementScoresBatch(
        [label, players, increments.map(increment => BigInt(increment))],
        {
          account: privateKeyToAccount(<Hex>this.walletKey),
          chain: this.chain,
        }
      );
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Decrements the score for a player in the leaderboard.
   * @param label - The label of the leaderboard.
   * @param players - An array of addresses of the players.
   * @param decrements - An array of amounts to decrement the scores for the corresponding players.
   */
  public async decrementScore(
    label: string,
    players: Address[],
    decrements: number[]
  ): Promise<WriteContractReturnType> {
    if (!this.walletKey) {
      throw new Error("Wallet key not set");
    }

    if (!this.leaderboardContractAddress) {
      throw new Error("Contract address not set");
    }

    try {
      return await this.leaderboardContract.write.decrementScoresBatch(
        [label, players, decrements.map(decrement => BigInt(decrement))],
        {
          account: privateKeyToAccount(<Hex>this.walletKey),
          chain: this.chain,
        }
      );
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Gets the leaderboard for a given label.
   * @param label - The label of the leaderboard.
   */
  public async getLeaderboard(label: string): Promise<[string[], number[]]> {
    try {
      if (this.leaderboardContractAddress === "0x") {
        return [[], []];
      }

      const [addresses, scores] = (await this.leaderboardContract.read.getLeaderboard([label])) as unknown as [string[], bigint[]];

      return [addresses as string[], scores.map(score => Number(score))];
    } catch (error) {
      return [[], []];
    }
  }

  /**
   * Gets the leaderboard for a given label.
   * @param label - The label of the leaderboard.
   */
  public async getHydratedLeaderboard(label: string): Promise<ProfileInfo[]> {
    try {
      if (!this.leaderboardContractAddress) {
        throw new Error("Contract address not set");
      }

      const [addresses, scores] =
        (await this.leaderboardContract.read.getLeaderboard([label])) as unknown as [string[], bigint[]];

      const addressQueries = addresses
        .map((address) => `address[$in]=${address}`)
        .join("&");

      const apiUrl = `${B3APIUrl}?${addressQueries}&$limit=${addresses.length}`;

      const profilesApiResponse = await fetch(apiUrl);
      const profilesApiResult = await profilesApiResponse.json();

      // Map the results to include usernames and avatars
      const profilesInfo = addresses.map((address, index) => {
        const profile = profilesApiResult.data.find(
          (p: any) => p.address.toLowerCase() === address.toLowerCase()
        );
        return {
          wallet: address,
          score: Number(scores[index]),
          username: profile ? profile.username : null,
          avatar: profile ? profile.avatar : null,
        };
      });

      return profilesInfo;
    } catch (error) {
      return [];
    }
  }

  /**
   * Gets the score for a player in the leaderboard.
   * @param label - The label of the leaderboard.
   * @param player - The address of the player.
   */
  public async getScore(
    label: string,
    player: Address
  ): Promise<number | undefined> {
    try {
      if (!this.leaderboardContractAddress) {
        throw new Error("Contract address not set");
      }

      return Number(await this.leaderboardContract.read.getScore([
        label,
        player,
      ]));
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Gets the number of players in the leaderboard.
   * @param label - The label of the leaderboard.
   */
  public async getPlayerCount(label: string): Promise<number | undefined> {
    try {
      if (!this.leaderboardContractAddress) {
        throw new Error("Contract address not set");
      }

      return Number(await this.leaderboardContract.read.getPlayerCount([
        label,
      ]));
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Gets the size of the leaderboard.
   * @param label - The label of the leaderboard.
   */
  public async getLeaderboardSize(label: string): Promise<number | undefined> {
    try {
      if (!this.leaderboardContractAddress) {
        throw new Error("Contract address not set");
      }

      return Number(await this.leaderboardContract.read.getLeaderboardSize([
        label,
      ]));
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Gets the top percentage of players in the leaderboard.
   * @param label - The label of the leaderboard.
   * @param percentage - The percentage of players to get.
   */
  public async getTopPercentage(
    label: string,
    percentage: bigint
  ): Promise<[string[], number[]]> {
    try {
      if (!this.leaderboardContractAddress) {
        throw new Error("Contract address not set");
      }

      const [addresses, scores] =
        await this.leaderboardContract.read.getTopPercentage([
          label,
          percentage,
        ]);

      return [
        addresses.map((addr) => addr.toString()),
        scores.map((score) => Number(score)),
      ];
    } catch (error) {
      return [[], []];
    }
  }

  /**
   * Gets the start time of the leaderboard.
   * @param label - The label of the leaderboard.
   */
  public async getLeaderboardStartTime(
    label: string
  ): Promise<number | undefined> {
    try {
      if (!this.leaderboardContractAddress) {
        throw new Error("Contract address not set");
      }

      return Number(await this.leaderboardContract.read.getLeaderboardStartTime([
        label,
      ]));
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Gets the end time of the leaderboard.
   * @param label - The label of the leaderboard.
   */
  public async getLeaderboardEndTime(
    label: string
  ): Promise<number | undefined> {
    try {
      if (!this.leaderboardContractAddress) {
        throw new Error("Contract address not set");
      }

      return Number(await this.leaderboardContract.read.getLeaderboardEndTime([
        label,
      ]));
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Checks if the leaderboard is active.
   * @param label - The label of the leaderboard.
   */
  public async isLeaderboardActive(label: string): Promise<boolean> {
    try {
      if (!this.leaderboardContractAddress) {
        throw new Error("Contract address not set");
      }

      return (await this.leaderboardContract.read.isLeaderboardActive([
        label,
      ])) as boolean;
    } catch (error) {
      return false;
    }
  }

  /**
   * Retrieves the list of admin addresses.
   * @return An array of admin addresses.
   */
  public async getAdmins(): Promise<string[]> {
    try {
      if (!this.leaderboardContractAddress) {
        throw new Error("Contract address not set");
      }

      return (await this.leaderboardContract.read.getAdmins()) as string[]; // Call the new getAdmins function
    } catch (error) {
      return [];
    }
  }

  public async listLeaderboards(
    label: string,
    contractAddress: string,
    pageNumber: number,
    pageSize: number
  ): Promise<ListLeaderboardsResponse> {
    const response = await fetchQuery<QueryResponse<ListLeaderboardsResponse>>(
      this.indexerEndpoint,
      listLeaderboardsQuery,
      {
        label,
        contractAddress,
        pageNumber,
        pageSize,
      }
    );
    return response.data;
  }
}
