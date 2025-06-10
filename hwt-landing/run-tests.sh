#!/bin/bash

# Script para executar testes dos contratos HanumanWaterToken V2
echo "Iniciando testes dos contratos HanumanWaterToken V2..."

# Compilar os contratos
echo "Compilando contratos..."
npx hardhat compile

# Executar os testes
echo "Executando testes..."
npx hardhat test

echo "Testes concluídos!"
