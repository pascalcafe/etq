# Funcionalidades Avançadas do EtiqueLabel

## 📊 Novo Sistema de Gerenciamento Completo

### 1. **Upload em Lote de Produtos (CSV/Excel)**
- **Localização**: Dashboard → Gerenciar Produtos → Upload em Lote
- **Suportados**: Arquivos CSV e Excel (.xlsx, .xls)
- **Colunas Obrigatórias**:
  - `name` - Nome do produto
  - `ean` - Código de barras

- **Colunas Opcionais**:
  - `brand` - Marca
  - `manufacturer_name` - Nome do fabricante
  - `net_quantity` - Quantidade líquida
  - `sugar_g` - Açúcar em gramas
  - `sodium_mg` - Sódio em miligramas
  - `saturated_fat_g` - Gordura saturada em gramas

**Exemplo CSV**:
```
name,ean,brand,manufacturer_name,sugar_g,sodium_mg
Pêssego Nacional,0070180001,FrutaTag,Passo Fundo,15,450
Suco Natural,0071234567,JuiceMax,São Paulo,20,200
```

### 2. **Galeria de 12+ Templates Predefinidos**
- **Localização**: Dashboard → Gerenciar Produtos → Templates
- **Templates Disponíveis**:
  - ✅ Frutas - 40x60mm (inclui Pêssego Nacional - 50x80mm customizado)
  - ✅ Bebidas - 50x30mm
  - ✅ Lácteos - 40x60mm
  - ✅ Carnes - 60x40mm
  - ✅ Grãos - 40x60mm
  - ✅ Óleos - 50x80mm
  - ✅ Doces - 40x60mm
  - ✅ Panificados - 50x60mm
  - ✅ Conservas - 60x40mm
  - ✅ Temperos - 30x50mm
  - ✅ Congelados - 50x40mm
  - ✅ A4 Completa - 210x297mm

**Funcionalidades**:
- Filtrar por categoria
- Duplicar templates para customização
- Deletar templates personalizados
- Visualizar dimensões em mm e pixels

### 3. **Editor Visual Avançado com Drag-and-Drop**
- **Localização**: Dashboard → Meus Produtos → (selecionar produto) → Editar Etiqueta
- **Canvas Interativo com Konva.js**:
  - ✅ Drag-and-drop de elementos
  - ✅ Resize com alças de redimensionamento
  - ✅ Rotação de elementos
  - ✅ Painel de propriedades em tempo real
  - ✅ Adição de elementos: Texto, Retângulo, QR Code, Código de Barras
  - ✅ Conversão automática mm ↔ pixels (96 DPI)

**Propriedades Editáveis**:
- Posição X/Y (em mm)
- Largura/Altura (em mm)
- Para Texto:
  - Conteúdo do texto
  - Tamanho da fonte
  - Peso da fonte (bold, normal)
  - Cor (fill)

**Ações**:
- Duplicar elemento (Ctrl+D ou botão)
- Deletar elemento (Delete ou botão)
- Salvar layout

### 4. **Gerenciador de Tamanhos Personalizados**
- **Localização**: Dashboard → Gerenciar Produtos → Tamanhos
- **Tamanhos Pré-configurados** (não deletáveis):
  - 40x60mm, 50x30mm, 50x80mm, 60x40mm, 30x50mm, A4

**Criar Novo Tamanho**:
1. Preencher: Nome, Largura (mm), Altura (mm)
2. Clicar em "Adicionar"
3. O tamanho aparecerá na lista para seleção

**Visualização**:
- Preview visual do aspect ratio
- Conversão automática para pixels
- Botões de seleção e exclusão

---

## 🎯 Fluxo de Uso Recomendado

### Cenário 1: Importar Produtos em Lote
1. Prepare um arquivo CSV com `name` e `ean`
2. Vá em Dashboard → Gerenciar Produtos → Upload em Lote
3. Selecione o arquivo
4. Visualize a prévia das primeiras 5 linhas
5. Clique "Enviar"
6. Produtos aparecerão em "Meus Produtos"

### Cenário 2: Criar Etiqueta com Template
1. Vá em Dashboard → Gerenciar Produtos → Templates
2. Escolha um template (ex: Frutas - 40x60mm)
3. Clique "Usar" no template desejado
4. Editor abrirá com o template pré-configurado
5. Personalize os elementos conforme necessário
6. Clique "Salvar Layout"

### Cenário 3: Tamanho Customizado
1. Vá em Dashboard → Gerenciar Produtos → Tamanhos
2. Crie um novo tamanho (ex: 45x70mm para seu produto especial)
3. Clique "Selecionar"
4. Editor abrirá com as dimensões escolhidas
5. Adicione e posicione elementos como desejado

---

## 🗄️ Banco de Dados - Novas Tabelas

### `product_imports`
Registra cada importação de produtos em lote
- `id` - UUID único
- `tenant_id` - Empresa que fez a importação
- `filename` - Nome do arquivo
- `total_rows` - Total de linhas no arquivo
- `imported_rows` - Linhas importadas com sucesso
- `status` - pending, completed, failed
- `error_message` - Mensagem de erro se houver

### `label_versions`
Histórico de versões de etiquetas (para future implementation de undo/redo)
- `id` - UUID único
- `label_id` - Referência à etiqueta
- `version_number` - Número da versão
- `label_data` - Snapshot do layout JSONB
- `created_at` - Quando foi criada

---

## 📝 API Endpoints

### POST `/api/products/import`
Importa produtos a partir de um arquivo CSV/Excel
- **Parâmetros**: FormData com `file` e `tenantId`
- **Retorna**: `{ success: true, imported: 5, total: 5 }`

---

## 🎨 Componentes Criados

1. **`ProductUploader`** - Upload de CSV com preview
2. **`TemplatesGallery`** - Galeria de 12+ templates
3. **`AdvancedLabelEditor`** - Editor visual com Konva.js
4. **`CustomSizesManager`** - Gerenciador de tamanhos
5. **`useTenant`** - Hook para obter tenant_id do usuário

---

## 📦 Dependências Adicionadas

- `papaparse` - Parsing de CSV
- `konva` - Canvas interativo
- `react-konva` - React bindings para Konva

---

## 🔒 Segurança

Todas as novas funcionalidades utilizam:
- **RLS (Row Level Security)** - Acesso restrito por tenant
- **Autenticação Supabase** - Verificação de user_id
- **Validação de entrada** - Verificação de colunas e tipos
- **Parameterized queries** - Proteção contra SQL injection

---

## 🚀 Próximos Passos

- [ ] Exportação em PDF com múltiplas etiquetas por página
- [ ] Impressão direta de etiquetas
- [ ] Histórico completo com undo/redo
- [ ] Integração com impressoras térmicas
- [ ] Análise de conformidade ANVISA automática
- [ ] Exportação de templates como presets reutilizáveis
