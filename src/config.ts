import type { Address } from "viem";
import type { Chain } from "viem/chains";
import { b3, b3Sepolia } from "viem/chains";
import {
  B3SepoliaLeaderBoardFactoryContractAddress,
  MainnetLeaderBoardFactoryContractAddress,
  B3SepoliaIndexerUrl,
  B3MainnetIndexerUrl,
} from "./constants";

interface Config {
  chain: Chain;
  leaderboardFactoryContractAddress: Address;
  indexerUrl: string;
}

export const b3SepoliaConfig: Config = {
  chain: b3Sepolia,
  leaderboardFactoryContractAddress: B3SepoliaLeaderBoardFactoryContractAddress,
  indexerUrl: B3SepoliaIndexerUrl,
};

export const b3MainnetConfig: Config = {
  chain: b3,
  leaderboardFactoryContractAddress: MainnetLeaderBoardFactoryContractAddress,
  indexerUrl: B3MainnetIndexerUrl,
};
