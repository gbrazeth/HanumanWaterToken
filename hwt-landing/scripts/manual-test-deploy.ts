import * as hre from "hardhat";
const { ethers } = hre;

async function main() {
  const [owner, user1, user2, user3] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", owner.address);

  // Deploy HanumanWaterTokenV2
  const HanumanWaterTokenV2 = await ethers.getContractFactory("HanumanWaterTokenV2");
  const hwtToken = await HanumanWaterTokenV2.deploy(
    owner.address, // Development team wallet
    user1.address, // Liquidity reserve wallet
    user2.address  // Strategic partnerships wallet
  );
  
  await hwtToken.deployed();
  console.log("HanumanWaterTokenV2 deployed to:", hwtToken.address);

  // Deploy mock price feed for testing
  const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
  const mockPriceFeed = await MockPriceFeed.deploy();
  await mockPriceFeed.deployed();
  console.log("Mock Price Feed deployed to:", mockPriceFeed.address);
  
  // Deploy mock USDT for testing
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockUSDT = await MockERC20.deploy("Mock USDT", "USDT", 6);
  await mockUSDT.deployed();
  console.log("Mock USDT deployed to:", mockUSDT.address);
  
  // Deploy presale contract
  const HanumanWaterTokenPresale = await ethers.getContractFactory("HanumanWaterTokenPresale");
  const presaleContract = await HanumanWaterTokenPresale.deploy(
    hwtToken.address,
    mockUSDT.address,
    mockPriceFeed.address,
    user3.address, // Treasury wallet
    30 // 30 days presale
  );
  
  await presaleContract.deployed();
  console.log("HanumanWaterTokenPresale deployed to:", presaleContract.address);
  
  // Configure the HWT token to recognize the presale contract
  await hwtToken.updatePresaleContract(presaleContract.address);
  console.log("Presale contract configured in HWT token");
  
  // Verify constants and initial state
  const tokenPriceUSD = await hwtToken.TOKEN_PRICE_USD();
  const minRedemptionAmount = await hwtToken.MIN_REDEMPTION_AMOUNT();
  const maxSupply = await hwtToken.MAX_SUPPLY();
  
  console.log("Token Price (USD):", tokenPriceUSD.toString());
  console.log("Minimum Redemption Amount (tokens):", minRedemptionAmount.toString());
  console.log("Maximum Supply (tokens):", maxSupply.toString());
  
  // Verify wallets set correctly
  console.log("Development Team Wallet:", await hwtToken.developmentTeamWallet());
  console.log("Liquidity Reserve Wallet:", await hwtToken.liquidityReserveWallet());
  console.log("Strategic Partnerships Wallet:", await hwtToken.strategicPartnershipsWallet());
  
  // Verify presale contract
  console.log("Presale Contract Address:", await hwtToken.presaleContractAddress());
  
  console.log("Initial setup complete and verified!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
