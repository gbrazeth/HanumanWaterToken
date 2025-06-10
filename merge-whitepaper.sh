#!/bin/bash

# Script para juntar as partes do whitepaper em um único arquivo
echo "Juntando as partes do whitepaper..."

# Criar o arquivo final
cat whitepaper-hwt-parte1.md whitepaper-hwt-parte2.md whitepaper-hwt-parte3.md whitepaper-hwt-parte4.md > whitepaper-hwt-completo.md

echo "Whitepaper completo criado como 'whitepaper-hwt-completo.md'"
