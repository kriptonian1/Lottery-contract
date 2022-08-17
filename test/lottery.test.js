const { expect, assert } = require("chai");

let contract;
let accounts;

beforeEach(async () => {
  accounts = await ethers.getSigners();
});

describe("Deploy Contract", () => {
  it("should deploy the contract with Wei", async () => {
    const Lottery = await ethers.getContractFactory("Lottery");
    const amount = ethers.utils.parseEther("0.0000001"); // 0.0000001 ETH
    // deployed by accounts[0] (Address: account[0].address)
    contract = await Lottery.deploy({ value: amount });

    await contract.deployed();

    expect(contract.address).to.exist;
  });

  it("should Not deploy the contract without Wei", async () => {
    const Lottery = await ethers.getContractFactory("Lottery");
    await expect(Lottery.deploy()).to.revertedWith("No min value");
  });
});

describe("Players Entering The Lottery", () => {
  it("should add a player to the lottery", async () => {
    const player = accounts[1];
    const amount = ethers.utils.parseEther("1"); // 1 ETH
    await contract.connect(player).enterLottery({ value: amount });
    const players = await contract.getPlayers();
    assert.equal(players.length, 1);
  });

  it("should add multiple players to the lottery", async () => {
    const [player1, player2, player3] = accounts.slice(1);
    const amount = ethers.utils.parseEther("1"); // 1 ETH
    await contract.connect(player1).enterLottery({ value: amount });
    await contract.connect(player2).enterLottery({ value: amount });
    await contract.connect(player3).enterLottery({ value: amount });
    const players = await contract.getPlayers();
    assert.equal(players.length, 4); // 1 player is there from the first test
  });
});

describe("Lottery Winner", () => {
  it("only the lottery owner can call the winner function", async () => {
    const player = accounts[1];
    const amount = ethers.utils.parseEther("1"); // 1 ETH
    await contract.connect(player).enterLottery({ value: amount });
    await expect(contract.connect(player).getWinner()).to.revertedWith("Not Auth"); // player is not the owner
  });

  it("should get the winner", async () => {
    const [player1, player2, player3] = accounts.slice(1);
    const amount = ethers.utils.parseEther("1"); // 1 ETH
    await contract.connect(player1).enterLottery({ value: amount });
    await contract.connect(player2).enterLottery({ value: amount });
    await contract.connect(player3).enterLottery({ value: amount });
    const players = await contract.getPlayers();
    const winner = await contract.getWinner();
    assert.equal(true, players.includes(winner) >= 0);
  });
});
