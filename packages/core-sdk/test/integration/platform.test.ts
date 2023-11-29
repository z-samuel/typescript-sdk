import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig } from "../../src/index";
import * as dotenv from "dotenv";
import { Client } from "../../src/types/client";
import { createFileReaderMock } from "../unit/testUtils";
import { goerli } from "viem/chains";
import { getAddress, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();
chai.use(chaiAsPromised);

describe("Platform client integration tests", () => {
  let client: Client;
  before(() => {
    global.FileReader = createFileReaderMock(
      "data:base64,dGVzdCBzdHJpbmcgYmxvYg==",
      new Event("onload") as unknown as ProgressEvent<FileReader>,
    ) as any;
  });

  beforeEach(function () {
    const config: StoryConfig = {
      chain: goerli,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: privateKeyToAccount((process.env.WALLET_PRIVATE_KEY || "0x") as Hex),
    };

    client = StoryClient.newClient(config);
  });

  describe("Collect an IP Asset", async function () {
    it("should return txHash when the collect transaction is successful on the client", async () => {
      const response = await client.platform.uploadFile(
        new File([""], "test.png", { type: "image/png" }),
        "image/png",
      );

      expect(response).to.have.property("uri");
      expect(response.uri).to.be.a("string");
    });
  });

  it("should return txHash when the collect transaction is successful on the server", async () => {
    const response = await client.platform.uploadFile(Buffer.from("test"), "image/png");

    expect(response).to.have.property("uri");
    expect(response.uri).to.be.a("string");
  });
});
