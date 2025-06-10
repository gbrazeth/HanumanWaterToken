import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { Contract } from "ethers";

describe("HanumanWaterTokenPresale", function () {
  let hwtToken: Contract;
  let presaleContract: Contract;
  let mockUSDT: Contract;
  let mockPriceFeed: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let treasuryWallet: SignerWithAddress;

  const TOKEN_PRICE_USD = 2;
  const MIN_PURCHASE_AMOUNT_USD = 10;
  const MAX_PURCHASE_AMOUNT_USD = 100000;
  const PRESALE_DURATION_DAYS = 5;

  beforeEach(async function () {
    // Obter signers para testes
    [owner, user1, user2, treasuryWallet] = await ethers.getSigners();
    
    // Implantar contrato HanumanWaterTokenV2
    const HanumanWaterTokenV2Factory = await ethers.getContractFactory("HanumanWaterTokenV2");
    hwtToken = await HanumanWaterTokenV2Factory.deploy(
      owner.address,
      owner.address,
      owner.address
    );
    
    // Implantar mock USDT
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDT = await MockERC20.deploy("Mock USDT", "USDT", 6); // USDT tem 6 casas decimais
    
    // Implantar mock price feed
    const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
    mockPriceFeed = await MockPriceFeed.deploy();
    await mockPriceFeed.setLatestPrice(200000000000); // $2000 com 8 casas decimais
    
    // Implantar contrato de pré-venda
    const HanumanWaterTokenPresaleFactory = await ethers.getContractFactory("HanumanWaterTokenPresale");
    presaleContract = await HanumanWaterTokenPresaleFactory.deploy(
      await hwtToken.getAddress(),
      await mockUSDT.getAddress(),
      await mockPriceFeed.getAddress(),
      treasuryWallet.address,
      PRESALE_DURATION_DAYS
    );
    
    // Configurar o contrato HWT para reconhecer o contrato de pré-venda
    await hwtToken.updatePresaleContract(await presaleContract.getAddress());
    
    // Cunhar USDT para os usuários de teste
    await mockUSDT.mint(user1.address, ethers.parseUnits("10000", 6)); // 10,000 USDT
    await mockUSDT.mint(user2.address, ethers.parseUnits("10000", 6)); // 10,000 USDT
    
    // Aprovar o contrato de pré-venda para gastar USDT
    await mockUSDT.connect(user1).approve(await presaleContract.getAddress(), ethers.parseUnits("10000", 6));
    await mockUSDT.connect(user2).approve(await presaleContract.getAddress(), ethers.parseUnits("10000", 6));
  });

  describe("Inicialização", function () {
    it("Deve definir corretamente os endereços dos contratos", async function () {
      expect(await presaleContract.hwtToken()).to.equal(await hwtToken.getAddress());
      expect(await presaleContract.usdtToken()).to.equal(await mockUSDT.getAddress());
      expect(await presaleContract.ethUsdPriceFeed()).to.equal(await mockPriceFeed.getAddress());
      expect(await presaleContract.treasuryWallet()).to.equal(treasuryWallet.address);
    });

    it("Deve definir corretamente as constantes", async function () {
      expect(await presaleContract.TOKEN_PRICE_USD()).to.equal(TOKEN_PRICE_USD);
      expect(await presaleContract.MIN_PURCHASE_AMOUNT_USD()).to.equal(MIN_PURCHASE_AMOUNT_USD);
      expect(await presaleContract.MAX_PURCHASE_AMOUNT_USD()).to.equal(MAX_PURCHASE_AMOUNT_USD);
    });
  });

  describe("Compra com USDT", function () {
    it("Deve permitir compra com USDT dentro dos limites", async function () {
      const usdtAmount = ethers.parseUnits("100", 6); // 100 USDT
      const expectedTokens = ethers.parseEther("50"); // 100 / 2 = 50 tokens
      
      await presaleContract.connect(user1).buyWithUSDT(usdtAmount);
      
      expect(await hwtToken.balanceOf(user1.address)).to.equal(expectedTokens);
      expect(await mockUSDT.balanceOf(treasuryWallet.address)).to.equal(usdtAmount);
      expect(await presaleContract.totalTokensSold()).to.equal(expectedTokens);
    });

    it("Deve rejeitar compra com USDT abaixo do mínimo", async function () {
      const usdtAmount = ethers.parseUnits("5", 6); // 5 USDT (abaixo do mínimo de 10)
      
      await expect(
        presaleContract.connect(user1).buyWithUSDT(usdtAmount)
      ).to.be.revertedWith("Purchase below minimum amount");
    });

    it("Deve rejeitar compra com USDT acima do máximo", async function () {
      const usdtAmount = ethers.parseUnits("200000", 6); // 200,000 USDT (acima do máximo de 100,000)
      
      await expect(
        presaleContract.connect(user1).buyWithUSDT(usdtAmount)
      ).to.be.revertedWith("Purchase above maximum amount");
    });
  });

  describe("Compra com ETH", function () {
    it("Deve permitir compra com ETH dentro dos limites", async function () {
      // Com preço ETH = $2000, 0.01 ETH = $20
      const ethAmount = ethers.parseEther("0.01");
      const expectedTokens = ethers.parseEther("10"); // $20 / $2 = 10 tokens
      
      const treasuryBalanceBefore = await ethers.provider.getBalance(treasuryWallet.address);
      
      await presaleContract.connect(user1).buyWithETH({ value: ethAmount });
      
      const treasuryBalanceAfter = await ethers.provider.getBalance(treasuryWallet.address);
      
      expect(await hwtToken.balanceOf(user1.address)).to.equal(expectedTokens);
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(ethAmount);
      expect(await presaleContract.totalTokensSold()).to.equal(expectedTokens);
    });

    it("Deve rejeitar compra com ETH abaixo do mínimo", async function () {
      // Com preço ETH = $2000, 0.001 ETH = $2 (abaixo do mínimo de $10)
      const ethAmount = ethers.parseEther("0.001");
      
      await expect(
        presaleContract.connect(user1).buyWithETH({ value: ethAmount })
      ).to.be.revertedWith("Purchase below minimum amount");
    });

    it("Deve rejeitar compra com ETH acima do máximo", async function () {
      // Com preço ETH = $2000, 100 ETH = $200,000 (acima do máximo de $100,000)
      const ethAmount = ethers.parseEther("100");
      
      await expect(
        presaleContract.connect(user1).buyWithETH({ value: ethAmount })
      ).to.be.revertedWith("Purchase above maximum amount");
    });
  });

  describe("Pausabilidade", function () {
    it("Deve permitir que o owner pause e despause o contrato", async function () {
      await presaleContract.pause();
      expect(await presaleContract.paused()).to.be.true;
      
      await presaleContract.unpause();
      expect(await presaleContract.paused()).to.be.false;
    });

    it("Deve impedir compras quando pausado", async function () {
      await presaleContract.pause();
      
      const usdtAmount = ethers.parseUnits("100", 6);
      const ethAmount = ethers.parseEther("0.01");
      
      await expect(
        presaleContract.connect(user1).buyWithUSDT(usdtAmount)
      ).to.be.revertedWith("Pausable: paused");
      
      await expect(
        presaleContract.connect(user1).buyWithETH({ value: ethAmount })
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Funções administrativas", function () {
    it("Deve permitir atualização do oráculo de preço", async function () {
      const newMockPriceFeed = await (await ethers.getContractFactory("MockPriceFeed")).deploy();
      
      await presaleContract.updatePriceFeed(await newMockPriceFeed.getAddress());
      
      expect(await presaleContract.ethUsdPriceFeed()).to.equal(await newMockPriceFeed.getAddress());
    });

    it("Deve permitir atualização da carteira do tesouro", async function () {
      const newTreasuryWallet = user2.address;
      
      await presaleContract.updateTreasuryWallet(newTreasuryWallet);
      
      expect(await presaleContract.treasuryWallet()).to.equal(newTreasuryWallet);
    });

    it("Deve permitir extensão do período de pré-venda", async function () {
      const currentEndTime = await presaleContract.presaleEndTime();
      const newEndTime = currentEndTime + BigInt(30 * 24 * 60 * 60); // +30 dias
      
      await presaleContract.extendPresale(newEndTime);
      
      expect(await presaleContract.presaleEndTime()).to.equal(newEndTime);
    });
  });
});
