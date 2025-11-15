# 🧩 Componentes - HWT Frontend

Esta pasta contém todos os componentes React organizados por categoria para melhor manutenibilidade.

## 📁 Estrutura Organizada

### 🔐 `/auth/`
Componentes relacionados à autenticação:
- `auth-dialog.tsx` - Modal de login/registro com Google e email

### 🌐 `/web3/`
Componentes para integração Web3:
- `web3-provider.tsx` - Provider principal para Wagmi e Web3Modal
- `web3-modal-init.tsx` - Inicialização do Web3Modal

### 🎨 `/layout/`
Componentes de layout e interface:
- `language-switcher.tsx` - Seletor de idioma (PT/EN)
- `theme-provider.tsx` - Provider de temas

### 🛠️ `/common/`
Componentes utilitários comuns:
- `error-boundary.tsx` - Tratamento de erros React
- `icons.tsx` - Ícones personalizados

### 🎯 `/ui/`
Componentes base do design system (shadcn/ui):
- 50+ componentes base (Button, Card, Dialog, etc.)
- Hooks utilitários (`use-mobile.tsx`, `use-toast.ts`)

## 🎯 Como Usar

### Importar Componentes por Categoria:
```tsx
// Autenticação
import { AuthDialog } from '@/components/auth/auth-dialog'

// Web3
import { Web3Provider } from '@/components/web3/web3-provider'

// Layout
import { LanguageSwitcher } from '@/components/layout/language-switcher'

// Comuns
import { ErrorBoundary } from '@/components/common/error-boundary'

// UI Base
import { Button } from '@/components/ui/button'
```

## 📝 Convenções

- **Nomes de arquivo**: kebab-case (ex: `auth-dialog.tsx`)
- **Nomes de componente**: PascalCase (ex: `AuthDialog`)
- **Organização**: Por funcionalidade, não por tipo
- **Imports**: Sempre usar paths absolutos com `@/components/`

## 🔄 Manutenção

- Componentes em `/ui/` são gerados pelo shadcn/ui
- Componentes customizados ficam nas outras pastas
- Sempre atualizar este README ao adicionar novas categorias

Esta organização facilita a localização, manutenção e reutilização de componentes.
