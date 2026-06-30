# Editor Profissional - Acesso Rápido

## 🚀 Como Acessar

### Opção 1: Via Templates (Recomendado)
1. Acesse `/dashboard/products/manage`
2. Clique na aba "Templates"
3. Escolha um template (ex: "Frutas - 40x60mm")
4. Clique no botão azul "Editor Pro"
5. Pronto! O editor abre com o template carregado

### Opção 2: URL Direta
```
http://localhost:3000/dashboard/labels/editor-pro
```

### Opção 3: Com Parâmetros
```
http://localhost:3000/dashboard/labels/editor-pro?templateId=TEMPLATE_ID
http://localhost:3000/dashboard/labels/editor-pro?productId=PRODUCT_ID
```

## 🎨 Interface do Editor

```
┌─────────────────────────────────────────────────────────────────┐
│  Editor de Etiquetas Profissional                    [Salvar] [X] │
├─────────────────────────────────────────────────────────────────┤
│ [Texto] [Retângulo] [Círculo] [Imagem] [QR] [Barcode]          │
│ [Duplicar] [Deletar] [Undo] [Redo]  [Zoom] [Grid] [Régua]      │
├─────────────────────────────────────────────────────────────────┤
│        │  CAMADAS                  │ CANVAS                  │ PROPRIEDADES
│        │                           │                         │
│        │ ▼ Texto "Produto"         │   ┌──────────────┐      │ Posição e Tamanho
│        │ ▼ Imagem "logo.png"       │   │   CANVAS     │      │ X: 100  Y: 50
│        │ ▼ QR Code                 │   │    2D        │      │ L: 200  A: 150
│        │                           │   │              │      │
│        │ [↑] [↓]                   │   └──────────────┘      │ Transformação
│        │                           │                         │ Rotação: 45°
│        │ [Duplicar] [Deletar]      │   Régua: 100px          │ Opacidade: 80%
│        │                           │                         │
│        └───────────────────────────┘                         │ Cores
│                                                              │ Preenchimento: #000
│                                                              │ Borda: #FFF
│                                                              │
│                                                              │ [Duplicar] [Deletar]
└──────────────────────────────────────────────────────────────┘
```

## 🎯 Principais Funcionalidades

### Adicionar Elementos
| Ícone | Descrição | Atalho |
|-------|-----------|--------|
| T | Texto | Click |
| ▭ | Retângulo | Click |
| ○ | Círculo | Click |
| 🖼 | Imagem | Click |
| ▨ | QR Code | Click |
| ▥ | Código de Barras | Click |

### Editar Elementos
- **Mover**: Clique e arraste
- **Redimensionar**: Arraste as alças dos cantos
- **Rotacionar**: Use o painel de propriedades
- **Duplicar**: Botão "Duplicar" ou Ctrl+D
- **Deletar**: Botão "Deletar" ou Delete
- **Bloquear**: Clique no ícone Lock no painel de camadas

### Controles de Zoom
- **Zoom In**: Botão [+]
- **Zoom Out**: Botão [-]
- **Percentual**: Exibido entre os botões
- **Range**: 10% a 800%

### Visualização
- **Régua**: Mostra marcadores a cada 100px (toggle com ícone)
- **Grade**: Grid inteligente opcional (toggle com ícone)
- **Snap**: Encaixe automático na grade (se habilitada)

## 📝 Exemplo: Criar uma Etiqueta

### Passo 1: Começar com um Template
1. Acesse `/dashboard/products/manage`
2. Clique em "Templates"
3. Escolha "Frutas - 40x60mm"
4. Clique "Editor Pro"

### Passo 2: Adicionar Texto Produto
1. Clique no ícone [T] para adicionar texto
2. Arraste na área do canvas
3. No painel direito, edite:
   - Conteúdo: "Maçã Vermelha"
   - Tamanho: 18px
   - Peso: Negrito

### Passo 3: Adicionar Logo
1. Clique no ícone [🖼] para adicionar imagem
2. Selecione uma imagem do seu PC
3. Redimensione e posicione no canvas

### Passo 4: Adicionar QR Code
1. Clique no ícone [▨] para QR Code
2. No painel de propriedades, defina o link
3. Posicione no canto inferior direito

### Passo 5: Adicionar Código de Barras
1. Clique no ícone [▥] para código de barras
2. Defina o número EAN no painel de propriedades
3. Posicione na parte inferior

### Passo 6: Salvar
1. Clique no botão azul "Salvar"
2. Aguarde o upload para o banco de dados
3. Pronto! Sua etiqueta está salva

## 🔧 Atalhos de Teclado (Planejados)

```
Ctrl+Z / Cmd+Z    - Desfazer
Ctrl+Y / Cmd+Y    - Refazer
Ctrl+D / Cmd+D    - Duplicar selecionado
Delete            - Deletar selecionado
Ctrl+A / Cmd+A    - Selecionar tudo
Ctrl+C / Cmd+C    - Copiar (futuro)
Ctrl+V / Cmd+V    - Colar (futuro)
```

## 💾 Salvando e Exportando

### Salvar Layout
- Clique "Salvar" para persistir no banco de dados Supabase
- Seu layout fica associado ao produto
- Você pode editar novamente depois

### Exportar (Futuro)
- PNG: Para visualizar com transparência
- JPEG: Para imprimir diretamente
- PDF: Formato pronto para impressão profissional
- SVG: Vetorial para edição posterior
- JSON: Para carregar em outro editor

## ⚡ Dicas e Truques

### Organização de Camadas
- Use o painel de camadas para reordenar elementos
- Clique em um elemento para selecioná-lo instantaneamente
- Veja a hierarquia visual com ícones

### Alinhamento Rápido
- Selecione múltiplos elementos (futuro)
- Use botões de alinhamento
- Distribua uniformemente

### Desfazer Ações
- Histórico ilimitado de undo/redo
- Navegue pelo histórico clicando nos botões
- Todas as mudanças são rastreadas

### Performance
- Com muitos objetos, reduza o zoom
- Use "Lock" para camadas que não vai editar mais
- A grade pode deixar mais lento com muitos objetos

## 🐛 Troubleshooting

### O canvas não aparece
- Recarregue a página
- Verifique a console do navegador (F12)
- Limpe o cache (Ctrl+Shift+Del)

### Elemento não se move
- Verifique se não está travado (ícone Lock)
- Clique para selecionar antes de mover
- Tente usar o painel de propriedades para definir X/Y

### Não consigo salvar
- Verifique a conexão com internet
- Confirme que você está logado
- Tente novamente em poucos segundos

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `PRO_EDITOR_GUIDE.md` - Guia técnico completo
- `FEATURES_ADVANCED.md` - Todas as funcionalidades
- `TESTING_GUIDE.md` - Como testar o editor

---

**Versão**: 1.0.0 Beta  
**Status**: ✅ Pronto para uso  
**Suporte**: Fabric.js 7.4.0 + Zustand 5.0.14
