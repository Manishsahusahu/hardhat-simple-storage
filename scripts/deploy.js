const { ethers, run, network } = require("hardhat");

const main = async () => {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );
    console.log("Deploying contract...");
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log(`Contract address is: ${simpleStorage.address}`);

    // what if our our contract is deployed on hardhat local network
    if (network.config.chainId == 5 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6); // let's wait for some blocks creation for verification because etherscan takes some time to update the transactions.
        await verify(simpleStorage.address, []);
    }

    let currentFavoriteNumber = await simpleStorage.retrieve(); // view function, doesn't change any state of contract.
    console.log(`current favorite number is ${currentFavoriteNumber}`);

    // update the favorite number.
    const transactionResponse = await simpleStorage.store(77); // changes the state of contract.
    await transactionResponse.wait(1);
    currentFavoriteNumber = await simpleStorage.retrieve();
    console.log(`updated favorite number is ${currentFavoriteNumber}`);
};
async function verify(contractAddress, args) {
    console.log("verifying contract...");
    try {
        await run("verify: verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().include("already verified"))
            console.log("Already verified");
        else console.log(e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.error(1);
    });
