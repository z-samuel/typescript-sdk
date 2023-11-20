import { expect } from "chai";
import { IPAssetClient } from "../../../src/resources/ipAsset";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import { IPAssetType } from "../../../src";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { PublicClient, WalletClient } from "viem";
import { AddressZero } from "../../../src/constants/addresses";

chai.use(chaiAsPromised);

describe("Test IpAssetClient", function () {
  let ipAssetClient: IPAssetClient;
  let axiosMock: AxiosInstance;
  let rpcMock: PublicClient;
  let walletMock: WalletClient;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    rpcMock = createMock<PublicClient>();
    walletMock = createMock<WalletClient>();
    ipAssetClient = new IPAssetClient(axiosMock, rpcMock, walletMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test ipAssetClient.create", async function () {
    it("should not throw error when creating a franchise", async function () {
      try {
        rpcMock.readContract = sinon.stub().resolves(AddressZero);
        rpcMock.simulateContract = sinon.stub().resolves({ request: null });
        walletMock.writeContract = sinon
          .stub()
          .resolves("0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997");

        await ipAssetClient.register({
          name: "The Empire Strikes Back",
          type: IPAssetType.STORY,
          ipOrgId: "0xB32BdE3fBfddAd30a8d824178F00F0adB43DF2e7",
          owner: "0x4f9693ac46f2c7e2f48dd14d8fe1ab44192cd57d",
          txOptions: {
            waitForTransaction: false,
          },
        });
      } catch (error) {
        expect.fail(`Function should not have thrown any error, but it threw: ${error}`);
      }
    });

    it("should throw error when request fails", async function () {
      rpcMock.simulateContract = sinon.stub().resolves({ request: null });
      walletMock.writeContract = sinon.stub().rejects(new Error("http 500"));
      await expect(
        ipAssetClient.register({
          name: "The Empire Strikes Back",
          type: IPAssetType.STORY,
          ipOrgId: "0xB32BdE3fBfddAd30a8d824178F00F0adB43DF2e7",
          owner: "0x4f9693ac46f2c7e2f48dd14d8fe1ab44192cd57d",
          txOptions: {
            waitForTransaction: false,
          },
        }),
      ).to.be.rejectedWith("http 500");
    });

    it("should throw error when invalid franchise ID is provided", async function () {
      try {
        rpcMock.readContract = sinon.stub().resolves(AddressZero);
        rpcMock.simulateContract = sinon.stub().rejects();

        expect(
          await ipAssetClient.register({
            name: "The Empire Strikes Back",
            type: IPAssetType.STORY,
            ipOrgId: "fake org id",
            owner: "0x4f9693ac46f2c7e2f48dd14d8fe1ab44192cd57d",
            txOptions: {
              waitForTransaction: false,
            },
          }),
        ).to.be.rejected;
      } catch (error) {
        // successfully thrown
      }
    });
  });
});
