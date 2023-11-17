import { AxiosInstance } from "axios";
import * as sinon from "sinon";
import { PlatformClient } from "../../../src/utils/platform";
import chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { createMock, createFileReaderMock } from "../testUtils";
import { PublicClient, WalletClient } from "viem";

chai.use(chaiAsPromised);

describe("Test PlatformClient", function () {
  let platformClient: PlatformClient;
  let axiosMock: AxiosInstance;
  let rpcMock: PublicClient;
  let walletMock: WalletClient;

  let mockFile = new File([""], "test.png", { type: "image/png" });
  let mockBuffer = Buffer.from("test");
  this.beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    rpcMock = createMock<PublicClient>();
    walletMock = createMock<WalletClient>();
    platformClient = new PlatformClient(axiosMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test platform.uploadFile", function () {
    before(() => {
      const onLoadEvent = new Event("load") as unknown as ProgressEvent<FileReader>;
      global.FileReader = createFileReaderMock(
        "data:base64,dGVzdCBzdHJpbmcgYmxvYg==",
        onLoadEvent,
      ) as any;
    });

    it("should return url when the upload file transaction is successful on the client", async function () {
      const mockArweaveUrl = "https://arweave.net/SVBYzNCI8-GdUCe1_N9eA2Nol0rYi_AH-CBw1vo2YUM";
      // Stub the PlatformClient uploadFile transaction call
      axiosMock.post = sinon.stub().resolves({
        data: {
          uri: mockArweaveUrl,
        },
      });

      const response = await platformClient.uploadFile(mockFile, "image/png");

      expect(response.uri).to.equal(mockArweaveUrl);
    });

    it("should return url when the upload file transaction is successful on the server", async function () {
      const mockArweaveUrl = "https://arweave.net/SVBYzNCI8-GdUCe1_N9eA2Nol0rYi_AH-CBw1vo2YUM";
      // Stub the PlatformClient uploadFile transaction call
      axiosMock.post = sinon.stub().resolves({
        data: {
          uri: mockArweaveUrl,
        },
      });

      const response = await platformClient.uploadFile(mockBuffer, "image/png");

      expect(response.uri).to.equal(mockArweaveUrl);
    });

    it("should throw error when file is not a File or Buffer", async function () {
      await expect(platformClient.uploadFile("test" as any, "image/png")).to.be.rejectedWith(
        "Invalid file type",
      );
    });

    it("should throw error", async function () {
      axiosMock.post = sinon.stub().rejects(new Error("revert"));
      await expect(platformClient.uploadFile(mockFile, "image/png")).to.be.rejectedWith("revert");
    });
  });

  describe("Test platform.uploadFile - Invalid base64 string", function () {
    before(() => {
      global.FileReader = createFileReaderMock(
        "x",
        new Event("load") as unknown as ProgressEvent<FileReader>,
      ) as any;
    });

    it("should throw error when the file is not valid", async function () {
      await expect(platformClient.uploadFile(mockFile, "image/png")).to.be.rejectedWith(
        "Failed to upload file",
      );
    });
  });

  describe("Test platform.uploadFile - Error on file reader", function () {
    before(() => {
      global.FileReader = createFileReaderMock(
        "data:base64,dGVzdCBzdHJpbmcgYmxvYg==",
        undefined,
        new Event("error") as unknown as ProgressEvent<FileReader>,
      ) as any;
    });

    it("should throw error when the file is not valid", async function () {
      await expect(platformClient.uploadFile(mockFile, "image/png")).to.be.rejectedWith(
        "Failed to upload file",
      );
    });
  });
});
