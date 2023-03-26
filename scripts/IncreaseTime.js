const { time } = require("@nomicfoundation/hardhat-network-helpers");
async function main() {
    // Our code will go here
    await time.increase(2236800);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });