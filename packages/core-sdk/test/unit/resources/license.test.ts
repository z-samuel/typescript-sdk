import { expect } from "chai";
import { LicenseClient, AddressZero } from "../../../src";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { PublicClient, WalletClient } from "viem";

chai.use(chaiAsPromised);

describe("Test LicenseClient", function () {
  let licenseClient: LicenseClient;
  let axiosMock: AxiosInstance;
  let rpcMock: PublicClient;
  let walletMock: WalletClient;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    rpcMock = createMock<PublicClient>();
    walletMock = createMock<WalletClient>();
    licenseClient = new LicenseClient(axiosMock, rpcMock, walletMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test licenseClient.create", async function () {
    it("should create a license NFT (don't wait txn)", async function () {
      rpcMock.readContract = sinon.stub().resolves(AddressZero);
      rpcMock.simulateContract = sinon.stub().resolves({ request: null });
      walletMock.writeContract = sinon
        .stub()
        .resolves("0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997");

      const createLicenseNftRequest = {
        ipOrgId: "0xB32BdE3fBfddAd30a8d824178F00F0adB43DF2e7",
        isCommercial: false,
        licensee: "0x4f9693ac46f2c7e2f48dd14d8fe1ab44192cd57d",
        preHooksCalldata: [],
        postHooksCalldata: [],
        txOptions: {
          waitForTransaction: false,
        },
      };

      const createTxn = await licenseClient.create(createLicenseNftRequest);
      expect(createTxn).to.be.a("object");
      expect(createTxn).to.have.property("txHash");
      expect(createTxn.txHash).to.be.a("string");
    });

    it("should create a license NFT (wait txn)", async function () {
      rpcMock.readContract = sinon.stub().resolves(AddressZero);
      rpcMock.simulateContract = sinon.stub().resolves({ request: null });
      rpcMock.waitForTransactionReceipt = sinon.stub().resolves({
        logs: [
          {
            address: "0xa906e2589a7f8385a376babbb70a39dad551603b",
            topics: [
              "0x72c6855bff66b2a4daf5a2d61ef3d326f9e7fafd2e7533b78d922b90086b4f3f",
              "0x0000000000000000000000000000000000000000000000000000000000000014",
            ],
            data: "0x",
            blockNumber: 4747616n,
            transactionHash: "0x335bcd5601de74a2440b1eda601c633a06022542e98a98bbe3f273443dd30b87",
            transactionIndex: 69,
            blockHash: "0xe5a6de427915ad2998f920676a877466fd19e290b326a67b5c8b49a6b5174d2e",
            logIndex: 134,
            removed: false,
          },
        ],
      });
      walletMock.writeContract = sinon
        .stub()
        .resolves("0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997");

      const createLicenseNftRequest = {
        ipOrgId: "0xB32BdE3fBfddAd30a8d824178F00F0adB43DF2e7",
        isCommercial: false,
        licensee: "0x4f9693ac46f2c7e2f48dd14d8fe1ab44192cd57d",
        preHooksCalldata: [],
        postHooksCalldata: [],
        txOptions: {
          waitForTransaction: true,
        },
      };

      const createTxn = await licenseClient.create(createLicenseNftRequest);

      expect(createTxn).to.be.a("object");
      expect(createTxn).to.have.property("txHash");
      expect(createTxn.txHash).to.be.a("string");
      expect(createTxn).to.have.property("licenseId");
      expect(createTxn.licenseId).to.be.a("string");
    });

    it("should create an IPA-bound license (don't wait txn)", async function () {
      rpcMock.readContract = sinon.stub().resolves(AddressZero);
      rpcMock.simulateContract = sinon.stub().resolves({ request: null });
      walletMock.writeContract = sinon
        .stub()
        .resolves("0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997");

      const createIpaBoundLicenseRequest = {
        ipOrgId: "0xB32BdE3fBfddAd30a8d824178F00F0adB43DF2e7",
        isCommercial: false,
        ipaId: 1,
        preHooksCalldata: [],
        postHooksCalldata: [],
        txOptions: {
          waitForTransaction: false,
        },
      };

      const createTxn = await licenseClient.create(createIpaBoundLicenseRequest);
      expect(createTxn).to.be.a("object");
      expect(createTxn).to.have.property("txHash");
      expect(createTxn.txHash).to.be.a("string");
    });

    it("should create an IPA-bound license (wait txn)", async function () {
      rpcMock.readContract = sinon.stub().resolves(AddressZero);
      rpcMock.simulateContract = sinon.stub().resolves({ request: null });
      rpcMock.waitForTransactionReceipt = sinon.stub().resolves({
        logs: [
          {
            address: "0xa906e2589a7f8385a376babbb70a39dad551603b",
            topics: [
              "0x72c6855bff66b2a4daf5a2d61ef3d326f9e7fafd2e7533b78d922b90086b4f3f",
              "0x0000000000000000000000000000000000000000000000000000000000000014",
            ],
            data: "0x",
            blockNumber: 4747616n,
            transactionHash: "0x335bcd5601de74a2440b1eda601c633a06022542e98a98bbe3f273443dd30b87",
            transactionIndex: 69,
            blockHash: "0xe5a6de427915ad2998f920676a877466fd19e290b326a67b5c8b49a6b5174d2e",
            logIndex: 134,
            removed: false,
          },
        ],
      });
      walletMock.writeContract = sinon
        .stub()
        .resolves("0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997");

      const createIpaBoundLicenseRequest = {
        ipOrgId: "0xB32BdE3fBfddAd30a8d824178F00F0adB43DF2e7",
        isCommercial: false,
        ipaId: 1,
        preHooksCalldata: [],
        postHooksCalldata: [],
        txOptions: {
          waitForTransaction: true,
        },
      };

      const createTxn = await licenseClient.create(createIpaBoundLicenseRequest);
      expect(createTxn).to.be.a("object");
      expect(createTxn).to.have.property("txHash");
      expect(createTxn.txHash).to.be.a("string");
      expect(createTxn).to.have.property("licenseId");
      expect(createTxn.licenseId).to.be.a("string");
    });

    it("should throw error when request fails", async function () {
      rpcMock.simulateContract = sinon.stub().resolves({ request: null });
      walletMock.writeContract = sinon.stub().rejects(new Error("http 500"));
      const createLicenseNftRequest = {
        ipOrgId: "1",
        isCommercial: false,
        licensee: "0x4f9693ac46f2c7e2f48dd14d8fe1ab44192cd57d",
        txOptions: {
          waitForTransaction: false,
        },
      };

      await expect(licenseClient.create(createLicenseNftRequest)).to.be.rejectedWith("http 500");
    });

    it("should throw error when invalid franchise ID is provided", async function () {
      rpcMock.readContract = sinon.stub().resolves(AddressZero);
      rpcMock.simulateContract = sinon.stub().rejects();
      const createLicenseNftRequest = {
        ipOrgId: "0xB32BdE3fBfddAd30a8d824178F00F0adB43DF2e7",
        isCommercial: false,
        licensee: "0x4f9693ac46f2c7e2f48dd14d8fe1ab44192cd57d",
        preHooksCalldata: [],
        postHooksCalldata: [],
        txOptions: {
          waitForTransaction: false,
        },
      };

      await expect(licenseClient.create(createLicenseNftRequest)).to.be.rejectedWith(
        "Failed to register license: Error",
      );
    });

    it("should throw error when request object is invalid", async function () {
      rpcMock.readContract = sinon.stub().resolves(AddressZero);
      rpcMock.simulateContract = sinon.stub().rejects();
      const createLicenseNftRequest = {
        foo: "bar",
      };

      //@ts-ignore
      await expect(licenseClient.create(createLicenseNftRequest)).to.be.rejected;
    });
  });
});
