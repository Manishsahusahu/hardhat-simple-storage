const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", function () {
    // describe is keyword in mocha js in hardhat for testing purpose.
    let simpleStorageFactory, simpleStorage;
    beforeEach(async function () {
        // beforeEach function works before it(), so that we can deploy the contract before actually testing it.
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it("should start with favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0";
        // assert.equal(currentValue.toString(), expectedValue);
        expect(currentValue.toString()).to.equal(expectedValue); // both checks works same.
    }); // it is test case;

    it("should update the favorite number when store is called", async function () {
        const expectedValue = "89";
        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);

        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue);
    });
});
