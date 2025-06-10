import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

describe("HanumanWaterToken V2", function () {
  let hwtToken: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let developmentTeamWallet: SignerWithAddress;
  let liquidityReserveWallet: SignerWithAddress;
  let strategicPartnershipsWallet: SignerWithAddress;
  let presaleContractAddress: string;

  beforeEach(async function () {
    // Obter signers para testes
    [owner, user1, user2, developmentTeamWallet, liquidityReserveWallet, strategicPartnershipsWallet] = await ethers.getSigners();
    
    // Implantar o contrato HanumanWaterTokenV2
    const HanumanWaterTokenV2Factory = await ethers.getContractFactory("HanumanWaterTokenV2");
    hwtToken = await HanumanWaterTokenV2Factory.deploy(
      developmentTeamWallet.address,
      liquidityReserveWallet.address,
      strategicPartnershipsWallet.address
    );
    
    // Simular um endereço de contrato de pré-venda
    presaleContractAddress = user2.address;
    await hwtToken.updatePresaleContract(presaleContractAddress);
    
    // Aprovar KYC para user1
    await hwtToken.updateKycStatus(user1.address, true);
  });

  describe("Inicialização", function () {
    it("Deve definir corretamente as carteiras administrativas", async function () {
      expect(await hwtToken.developmentTeamWallet()).to.equal(developmentTeamWallet.address);
      expect(await hwtToken.liquidityReserveWallet()).to.equal(liquidityReserveWallet.address);
      expect(await hwtToken.strategicPartnershipsWallet()).to.equal(strategicPartnershipsWallet.address);
    });

    it("Deve definir corretamente as constantes", async function () {
      expect(await hwtToken.TOKEN_PRICE_USD()).to.equal(2);
      expect(await hwtToken.MIN_REDEMPTION_AMOUNT()).to.equal(100); // 100 litros
      expect(await hwtToken.MAX_SUPPLY()).to.equal(ethers.parseEther("500000000")); // 500 milhões
      expect(await hwtToken.PUBLIC_ALLOCATION_PERCENTAGE()).to.equal(80);
    });
  });

  describe("Controle de KYC", function () {
    it("Deve permitir que o owner atualize o status KYC", async function () {
      await hwtToken.updateKycStatus(user2.address, true);
      expect(await hwtToken.kycApproved(user2.address)).to.be.true;
      
      await hwtToken.updateKycStatus(user2.address, false);
      expect(await hwtToken.kycApproved(user2.address)).to.be.false;
    });

    it("Deve permitir atualização em lote do status KYC", async function () {
      const addresses = [user1.address, user2.address];
      await hwtToken.batchUpdateKycStatus(addresses, true);
      
      expect(await hwtToken.kycApproved(user1.address)).to.be.true;
      expect(await hwtToken.kycApproved(user2.address)).to.be.true;
    });

    it("Deve rejeitar atualizações KYC de não-owners", async function () {
      await expect(
        hwtToken.connect(user1).updateKycStatus(user2.address, true)
      ).to.be.revertedWithCustomError(hwtToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("Mintagem de Tokens", function () {
    it("Deve permitir que o contrato de pré-venda emita tokens públicos", async function () {
      const amount = ethers.parseEther("1000");
      
      await hwtToken.connect(user2).mintPresaleTokens(user1.address, amount);
      
      expect(await hwtToken.balanceOf(user1.address)).to.equal(amount);
      expect(await hwtToken.totalPublicAllocation()).to.equal(amount);
    });

    it("Deve rejeitar mintagem pública que exceda a alocação máxima", async function () {
      const excessiveAmount = (await hwtToken.MAX_PUBLIC_ALLOCATION()) + BigInt(1);
      
      await expect(
        hwtToken.connect(user2).mintPresaleTokens(user1.address, excessiveAmount)
      ).to.be.revertedWith("Exceeds public allocation");
    });

    it("Deve permitir que o owner emita tokens para a equipe", async function () {
      const amount = ethers.parseEther("1000");
      
      await hwtToken.mintTeamTokens(amount);
      
      expect(await hwtToken.balanceOf(developmentTeamWallet.address)).to.equal(amount);
      expect(await hwtToken.totalTeamAllocation()).to.equal(amount);
    });
  });

  describe("Resgate de Água", function () {
    beforeEach(async function () {
      // Emitir alguns tokens para user1 para testes de resgate
      const amount = ethers.parseEther("1000");
      await hwtToken.connect(user2).mintPresaleTokens(user1.address, amount);
    });

    it("Deve permitir resgate de água por usuários aprovados no KYC", async function () {
      const redeemAmount = ethers.parseEther("100"); // 100 tokens = 100 litros
      
      await expect(hwtToken.connect(user1).redeemWater(redeemAmount))
        .to.emit(hwtToken, "WaterRedeemed")
        .withArgs(user1.address, redeemAmount, redeemAmount);
      
      expect(await hwtToken.balanceOf(user1.address)).to.equal(ethers.parseEther("900"));
    });

    it("Deve rejeitar resgate abaixo do mínimo", async function () {
      const belowMinimum = ethers.parseEther("99"); // Abaixo de 100 tokens
      
      await expect(
        hwtToken.connect(user1).redeemWater(belowMinimum)
      ).to.be.revertedWith("Amount below minimum redemption");
    });

    it("Deve rejeitar resgate de usuários sem KYC aprovado", async function () {
      const redeemAmount = ethers.parseEther("100");
      
      // user2 não tem KYC aprovado
      await expect(
        hwtToken.connect(user2).redeemWater(redeemAmount)
      ).to.be.revertedWith("Address not KYC approved");
    });
  });

  describe("Pausabilidade", function () {
    it("Deve permitir que o owner pause e despause o contrato", async function () {
      await hwtToken.pause();
      expect(await hwtToken.paused()).to.be.true;
      
      await hwtToken.unpause();
      expect(await hwtToken.paused()).to.be.false;
    });

    it("Deve impedir transferências quando pausado", async function () {
      const amount = ethers.parseEther("100");
      await hwtToken.connect(user2).mintPresaleTokens(user1.address, amount);
      
      await hwtToken.pause();
      
      await expect(
        hwtToken.connect(user1).transfer(user2.address, amount)
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Controle de Alocações", function () {
    it("Deve rastrear corretamente as alocações de tokens", async function () {
      const publicAmount = ethers.parseEther("1000");
      const teamAmount = ethers.parseEther("500");
      const liquidityAmount = ethers.parseEther("300");
      
      await hwtToken.connect(user2).mintPresaleTokens(user1.address, publicAmount);
      await hwtToken.mintTeamTokens(teamAmount);
      await hwtToken.mintLiquidityTokens(liquidityAmount);
      
      expect(await hwtToken.totalPublicAllocation()).to.equal(publicAmount);
      expect(await hwtToken.totalTeamAllocation()).to.equal(teamAmount);
      expect(await hwtToken.totalLiquidityAllocation()).to.equal(liquidityAmount);
    });
  });
});
