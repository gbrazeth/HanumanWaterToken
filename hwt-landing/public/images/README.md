# 🖼️ Assets de Imagem - HWT

Esta pasta contém todos os assets de imagem organizados por categoria para melhor manutenibilidade.

## 📁 Estrutura Organizada

### 🏷️ `/logos/`
Logotipos e ícones da marca:
- `favicon.png` - Ícone do site (favicon)
- `hanuman-logo.png` - Logo principal Hanuman
- `hanuman-original-logo.png` - Logo original/backup
- `hwt-logo.png` - Logo do Hanuman Water Token

### 🎭 `/placeholders/`
Imagens placeholder para desenvolvimento:
- `placeholder-logo.png` - Logo placeholder (PNG)
- `placeholder-logo.svg` - Logo placeholder (SVG)
- `placeholder-user.jpg` - Avatar placeholder de usuário
- `placeholder.jpg` - Imagem genérica placeholder (JPG)
- `placeholder.svg` - Imagem genérica placeholder (SVG)

### 🏞️ `/jazida/`
Imagens relacionadas à jazida de água:
- [Conteúdo específico da jazida]

## 🎯 Como Usar

### Referenciando Imagens no Next.js:
```tsx
// Logos
import Image from 'next/image'

<Image 
  src="/images/logos/hanuman-logo.png" 
  alt="Hanuman Logo"
  width={200}
  height={100}
/>

// Placeholders
<Image 
  src="/images/placeholders/placeholder-user.jpg" 
  alt="User placeholder"
  width={50}
  height={50}
/>
```

### URLs Diretas:
```
/images/logos/favicon.png
/images/logos/hwt-logo.png
/images/placeholders/placeholder.svg
```

## 📝 Convenções

- **Logos**: Usar formatos PNG para melhor qualidade
- **Placeholders**: Manter múltiplos formatos (PNG, SVG, JPG)
- **Nomes**: kebab-case (ex: `hanuman-logo.png`)
- **Otimização**: Sempre otimizar imagens antes de adicionar

## 🔄 Manutenção

- Novos logos → `/logos/`
- Novos placeholders → `/placeholders/`
- Imagens específicas → criar nova categoria
- Sempre atualizar este README ao adicionar categorias

Esta organização facilita a localização e manutenção dos assets visuais.
