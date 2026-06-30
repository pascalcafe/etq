# EtiqueLabel - SaaS de Etiquetas Alimentícias ANVISA

Plataforma multi-tenant completa para geração de etiquetas alimentícias em conformidade com as regulamentações brasileiras (ANVISA RDC 429/2020).

## Características

### ✓ Implementado (MVP + Funcionalidades Avançadas)

#### Core Features
1. **Autenticação Multi-tenant**
   - Login/Signup com Supabase Auth em português
   - Proteção de rotas com middleware
   - Sistema de tenants com isolamento de dados via RLS

2. **Gerenciamento de Produtos**
   - CRUD completo de produtos
   - Validação ANVISA automática
   - Campos obrigatórios: nome, quantidade líquida, informações nutricionais
   - Cálculo automático de avisos (açúcar, sódio, gordura saturada)

3. **Sistema de Planos**
   - Plano Gratuito: até 5 produtos
   - Plano Profissional: produtos ilimitados
   - Trial de 30 dias para novos usuários

4. **Dashboard Completo**
   - Visão geral de produtos
   - Estatísticas de uso do plano
   - Configurações da empresa
   - Menu lateral responsivo

#### ⭐ Funcionalidades Avançadas (Nova Release)

5. **12+ Templates Predefinidos**
   - Frutas (40x60mm + Pêssego Nacional 50x80mm customizado)
   - Bebidas (50x30mm)
   - Lácteos (40x60mm)
   - Carnes (60x40mm)
   - Grãos (40x60mm)
   - Óleos (50x80mm)
   - Doces (40x60mm)
   - Panificados (50x60mm)
   - Conservas (60x40mm)
   - Temperos (30x50mm)
   - Congelados (50x40mm)
   - A4 Completa (210x297mm)

6. **Upload em Lote de Produtos**
   - Suporte para CSV e Excel
   - Preview das primeiras 5 linhas
   - Validação de colunas obrigatórias
   - Importação em massa com feedback em tempo real
   - Colunas suportadas: name, ean, brand, manufacturer_name, sugar_g, sodium_mg, saturated_fat_g

7. **Editor Visual Avançado com Drag-and-Drop**
   - Canvas interativo com Konva.js
   - Arraste elementos livremente pela etiqueta
   - Redimensione com alças de controle
   - Rotação de elementos
   - Painel de propriedades em tempo real
   - Adição de múltiplos tipos: Texto, Retângulo, QR Code, Código de Barras
   - Conversão automática mm ↔ pixels (96 DPI)
   - Duplicar e deletar elementos
   - Zoom e pan do canvas

8. **Gerenciador de Tamanhos Personalizados**
   - 6 tamanhos pré-configurados não deletáveis
   - Criar tamanhos personalizados ilimitados
   - Preview visual de aspect ratio
   - Seleção rápida entre tamanhos salvos
   - Persistência no banco de dados

9. **Galeria de Templates**
   - Filtro por categoria (frutas, bebidas, etc)
   - Duplicar templates para customização
   - Visualização de dimensões em mm e pixels
   - Identificação de templates padrão
   - Deletar templates personalizados

### 📋 Roadmap - Próximos Passos

**Fase 3 - Exportação e Impressão**
1. **Exportação PDF**
   - Geração de PDF pronto para impressão
   - Múltiplos formatos de etiqueta por página
   - Compressão de imagem para otimização

2. **Exportação SVG**
   - Formato vetorial para edição em ferramentas externas
   - Compatibilidade com softwares de design

3. **Impressão Direta**
   - Integração com impressoras térmicas
   - Suporte a diferentes resoluções DPI

**Fase 4 - Histórico e Versionamento**
1. **Histórico Completo de Produtos**
   - Rastreamento de todas as mudanças
   - Undo/Redo no editor
   - Restauração de versões anteriores

2. **Auditoria de Ações**
   - Log completo de ações de usuários
   - Relatórios de conformidade

**Fase 5 - Integração Stripe e Pagamentos**
1. **Checkout Stripe**
   - Pagamento de planos
   - Webhooks para mudanças de subscrição
   - Fatura automática

2. **Gerenciamento de Subscrição**
   - Upgrade/Downgrade de planos
   - Cancelamento com reembolso proporcional

**Fase 6 - API Pública e Integrações**
1. **REST API**
   - Endpoints para criar/listar/editar produtos
   - Endpoints para gerar etiquetas
   - Autenticação via API keys

2. **Integrações**
   - Conectores com ERPs populares
   - Webhook para eventos de produtos
   - Sincronização bidirecional com sistemas externos

## Stack Tecnológico

**Frontend**
- Next.js 16 (App Router)
- React 19.2 com Server Components
- TypeScript
- Tailwind CSS v4
- shadcn/ui (componentes customizados)
- Lucide Icons

**Backend & Infraestrutura**
- Next.js Server Actions
- Supabase (PostgreSQL + Auth + RLS)
- API REST customizados

**Editor Visual & Media**
- Konva.js (canvas interativo)
- React-Konva (React bindings)
- Papa Parse (CSV parsing)
- jsPDF/html2pdf (exportação PDF - próximo)

**Segurança & Autenticação**
- Supabase Auth (email/password)
- Supabase RLS (Row Level Security)
- Middleware de proteção de rotas
- CSRF protection nativa do Next.js

**Pagamentos** (próximo)
- Stripe (checkout e webhooks)

## Estrutura do Banco de Dados

```sql
-- Tabelas principais:
- subscription_plans        -- Planos disponíveis
- tenants                   -- Empresas/Usuários multi-tenant
- products                  -- Produtos cadastrados
- label_templates           -- Templates de etiquetas
- generated_labels          -- Etiquetas geradas
- product_history           -- Histórico de mudanças
```

Todas as tabelas têm **Row Level Security (RLS)** habilitado para proteção de dados.

## Como Usar

### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Adicionar NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

# Rodar dev server
pnpm dev
```

### Criar Conta

1. Acesse `http://localhost:3000`
2. Clique em "Começar Grátis"
3. Preencha email e senha
4. Confirme o email

### Cadastrar Produto

1. Acesse Dashboard > Meus Produtos
2. Clique em "Novo Produto"
3. Preencha informações obrigatórias
4. O sistema valida automaticamente contra limites ANVISA

### Usar Funcionalidades Avançadas

#### 1. Importar Produtos em Lote
1. Dashboard → "Gerenciar Produtos" → Aba "Upload em Lote"
2. Prepare um arquivo CSV com colunas: `name`, `ean`, (opcional: brand, manufacturer_name, sugar_g, sodium_mg, saturated_fat_g)
3. Clique "Selecionar arquivo" e escolha seu CSV
4. Visualize a prévia das primeiras 5 linhas
5. Clique "Enviar"
6. Produtos aparecem automaticamente em "Meus Produtos"

**Exemplo CSV**:
```
name,ean,brand,sugar_g,sodium_mg
Pêssego Nacional,0070180001,FrutaTag,15,450
Suco Natural,0071234567,JuiceMax,20,200
```

#### 2. Usar Templates Predefinidos
1. Dashboard → "Gerenciar Produtos" → Aba "Templates"
2. Navegue pelos 12+ templates (filtre por categoria se quiser)
3. Clique "Usar" no template desejado
4. Editor abre com o template pré-configurado
5. Customize os elementos (arraste, redimensione, edite texto)
6. Clique "Salvar Layout"

#### 3. Editor Visual Avançado
1. No editor de etiqueta, utilize os controles:
   - **Adicionar Elemento**: Botões no painel direito (Texto, Retângulo, QR Code, Código de Barras)
   - **Mover**: Clique e arraste o elemento
   - **Redimensionar**: Arraste as alças dos cantos
   - **Editar Propriedades**: Painel direito mostra posição (X/Y), tamanho, cores, fonte
   - **Duplicar**: Clique "Duplicar" (ou use Ctrl+D)
   - **Deletar**: Clique "Deletar" ou pressione Delete

#### 4. Criar Tamanho Personalizado
1. Dashboard → "Gerenciar Produtos" → Aba "Tamanhos"
2. Preencha "Nome", "Largura (mm)", "Altura (mm)"
3. Clique "Adicionar"
4. Novo tamanho aparece na lista
5. Clique "Selecionar" para usar no editor

#### 5. Gerar Etiqueta com Produto

1. Acesse "Meus Produtos"
2. Encontre o produto que deseja
3. Clique no ícone de edição
4. Use o editor visual avançado para customizar
5. Clique "Salvar Layout" para persistir as mudanças

## Conformidade ANVISA RDC 429/2020

O sistema valida automaticamente os seguintes limites:

- **Açúcar**: > 5g por porção = Aviso frontal obrigatório
- **Sódio**: > 400mg por porção = Aviso frontal obrigatório
- **Gordura Saturada**: > 5g por porção = Aviso frontal obrigatório

Avisos aparecem automaticamente em vermelho no canto da etiqueta.

## Rotas Principais

```
/                              -- Landing page
/auth/login                    -- Login
/auth/sign-up                  -- Signup
/dashboard                     -- Dashboard
/dashboard/products            -- Listagem de produtos
/dashboard/products/create     -- Criar produto
/dashboard/labels/editor/[id]  -- Editor de etiqueta
/dashboard/settings            -- Configurações
```

## Segurança

- ✓ Senhas com hash automático (Supabase)
- ✓ Sessões seguras com cookies HTTP-only
- ✓ CSRF protection
- ✓ RLS policies no banco de dados
- ✓ Validação de entrada em todas as formas

## Próximas Fases

**Fase 2 - Pagamentos e Escalabilidade**
- Integração Stripe completa
- Webhook handling
- Email de confirmação e recuperação de senha
- Notificações

**Fase 3 - Recursos Avançados**
- Exportação PDF/XML
- API pública
- Histórico completo
- Templates salvos
- Batch processing

**Fase 4 - Enterprise**
- Roles e permissões (admin, editor, viewer)
- Integração com ERPs
- SSO (SAML/OAuth)
- Relatórios avançados

## Suporte

Para dúvidas sobre o ANVISA ou regulamentações, consulte:
- [ANVISA - RDC 429/2020](https://www.gov.br/anvisa)
- [Regulamento Técnico de Rotulagem de Alimentos](https://www.gov.br/anvisa)

---

**Desenvolvido com ❤️ para a indústria alimentícia brasileira**
