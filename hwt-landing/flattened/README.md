# 📄 Contratos Flattened

Estes são os contratos compilados e "achatados" (flattened) para verificação no Etherscan.

---

## 📋 **Arquivos:**

### **HanumanWaterTokenV2_flattened.sol**
- Token principal ERC-20
- Inclui todas as dependências (OpenZeppelin)
- Usado para verificação no Etherscan

### **HanumanWaterTokenPresale_flattened.sol**
- Contrato de pré-venda
- Inclui integração com Chainlink Oracle
- Usado para verificação no Etherscan

---

## 🔧 **Como Usar:**

### **Verificar no Etherscan:**

1. Acesse o contrato no Etherscan
2. Vá em "Contract" → "Verify and Publish"
3. Selecione:
   - Compiler: `v0.8.20+commit.a1b79de6`
   - Optimization: `Yes` (200 runs)
   - License: `MIT`
4. Cole o conteúdo do arquivo flattened
5. Adicione os constructor arguments
6. Clique em "Verify and Publish"

### **Gerar Novos Flattened:**

```bash
# Compilar contratos
npx hardhat compile

# Flatten HWT Token
npx hardhat flatten contracts/HanumanWaterTokenV2.sol > flattened/HanumanWaterTokenV2_flattened.sol

# Flatten Presale
npx hardhat flatten contracts/HanumanWaterTokenPresale.sol > flattened/HanumanWaterTokenPresale_flattened.sol
```

---

## ⚠️ **IMPORTANTE:**

### **NÃO EDITE ESTES ARQUIVOS MANUALMENTE!**

Eles são gerados automaticamente pelo Hardhat. Qualquer edição manual será perdida na próxima compilação.

### **Para Modificar:**

1. Edite o contrato original em `contracts/`
2. Recompile com `npx hardhat compile`
3. Gere novo flattened com `npx hardhat flatten`

---

## 📚 **Referências:**

- [Hardhat Flatten](https://hardhat.org/hardhat-runner/docs/advanced/flattening)
- [Etherscan Verification](https://docs.etherscan.io/tutorials/verifying-contracts-programmatically)
- [Documentação do Projeto](../docs/)

---

**Última Atualização**: 13 de Novembro de 2025
