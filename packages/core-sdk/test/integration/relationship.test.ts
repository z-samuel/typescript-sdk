import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Environment } from "../../src/index";
import * as dotenv from "dotenv";
import { Client } from "../../src/types/client";
import { privateKeyToAccount } from "viem/accounts";
import { getAddress, Hex, http } from "viem";
import { goerli } from "viem/chains";

dotenv.config();
chai.use(chaiAsPromised);

describe("Relationship Functions", () => {
  let client: Client;
  // TODO: need actually IPAsset data for it to work
  const mockRequest = {
    sourceIPAsset: {
      franchiseId: "66",
      ipAssetId: "1000000000001",
    },
    destIPAsset: {
      franchiseId: "66",
      ipAssetId: "1",
    },
  };

  before(function () {
    const config: StoryConfig = {
      environment: Environment.TEST,
      chain: goerli,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: privateKeyToAccount((process.env.WALLET_PRIVATE_KEY || "0x") as Hex),
    };

    client = StoryClient.newClient(config);
  });
});
