import chai, { expect } from "chai";
import { IPOrgClient } from "../../../src/resources/ipOrg";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import chaiAsPromised from "chai-as-promised";
import { PublicClient, WalletClient } from "viem";
import { IPAssetType } from "../../../src";

chai.use(chaiAsPromised);

describe(`Test IPOrgClient`, function () {
  let ipOrgClient: IPOrgClient;
  let axiosMock: AxiosInstance;
  let rpcMock: PublicClient;
  let walletMock: WalletClient;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    rpcMock = createMock<PublicClient>();
    walletMock = createMock<WalletClient>();
    ipOrgClient = new IPOrgClient(axiosMock, rpcMock, walletMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test ipOrgClient.create", async function () {
    it("should not throw error when creating a ipOrgClient", async function () {
      rpcMock.simulateContract = sinon.stub().resolves({ request: null });
      walletMock.writeContract = sinon
        .stub()
        .resolves("0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997");

      await expect(
        ipOrgClient.register({
          name: "Star Wars",
          symbol: "STAR",
          owner: "0x4f9693ac46f2c7e2f48dd14d8fe1ab44192cd57d",
          ipAssetTypes: [IPAssetType.STORY.toString(), IPAssetType.CHARACTER.toString()],
          txOptions: {
            waitForTransaction: false,
          },
        }),
      ).not.to.be.rejected;
    });

    it("should throw error when registerIPOrg reverts", async function () {
      rpcMock.simulateContract = sinon.stub().rejects(new Error("revert"));
      await expect(
        ipOrgClient.register({
          name: "Star Wars",
          symbol: "STAR",
          owner: "0x4f9693ac46f2c7e2f48dd14d8fe1ab44192cd57d",
          ipAssetTypes: [IPAssetType.STORY.toString(), IPAssetType.CHARACTER.toString()],
          txOptions: {
            waitForTransaction: false,
          },
        }),
      ).to.be.rejectedWith("revert");
    });
  });
});
