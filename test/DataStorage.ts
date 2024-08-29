import { ethers } from "hardhat";
import { expect } from "chai";

describe("DataStorage", function () {
    let dataStorage: any;
    let owner: any;
    let addr1: any;

    before(async function () {
        [owner, addr1] = await ethers.getSigners();

        const DataStorageFactory = await ethers.getContractFactory("DataStorage");
      dataStorage = await DataStorageFactory.deploy();
      await dataStorage.deployment();

      dataStorage = await ethers.getContractAt("DataStorage", dataStorage.address);
        dataStorage = await DataStorageFactory.deploy();
        await dataStorage.waitForDeployment();
    });

    it("Should set the right owner", async function () {
        const contractOwner = await dataStorage.owner();
        expect(contractOwner).to.equal(owner.address);
    });

    it("Should register verified data", async function () {
        const dataHash = "0x1234567890abcdef";
        const submitter = addr1.address;

        const tx = await dataStorage.registerVerifiedData(dataHash, submitter);
        await tx.wait();

        const verifiedDataCount = await dataStorage.verifiedDataCount();
        expect(verifiedDataCount).to.equal(1);

        const storedDataHash = await dataStorage.getDataHash(verifiedDataCount);
        const storedSubmitter = await dataStorage.getSubmitter(verifiedDataCount);
        const storedTimestamp = await dataStorage.getTimestamp(verifiedDataCount);

        expect(storedDataHash).to.equal(dataHash);
        expect(storedSubmitter).to.equal(submitter);
        expect(storedTimestamp).to.be.gt(0); // 타임스탬프가 0보다 큰지 확인
    });

    it("Should revert if non-owner tries to register data", async function () {
        const dataHash = "0xabcdef1234567890";
        await expect(dataStorage.connect(addr1).registerVerifiedData(dataHash, addr1.address)).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should return the correct data hash, submitter, and timestamp", async function () {
        const dataHash = "0x1234567890abcdef";
        const submitter = addr1.address;

        const tx = await dataStorage.registerVerifiedData(dataHash, submitter);
        await tx.wait();

        const verifiedDataCount = await dataStorage.verifiedDataCount();
        const storedDataHash = await dataStorage.getDataHash(verifiedDataCount);
        const storedSubmitter = await dataStorage.getSubmitter(verifiedDataCount);
        const storedTimestamp = await dataStorage.getTimestamp(verifiedDataCount);

        expect(storedDataHash).to.equal(dataHash);
        expect(storedSubmitter).to.equal(submitter);
        expect(storedTimestamp).to.be.gt(0);
    });
});
