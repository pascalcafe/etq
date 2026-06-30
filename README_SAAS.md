# EtiqueLabel - SaaS de Etiquetas Alimentícias ANVISA

Plataforma multi-tenant completa para geração de etiquetas alimentícias em conformidade com as regulamentações brasileiras (ANVISA RDC 429/2020).

## Características

### ✓ Implementado (MVP)

1. **Autenticação Multi-tenant**
   - Login/Signup com Supabase Auth
   - Proteção de rotas com middleware
   - Sistema de tenants com isolamento de dados via RLS

2. **Gerenciamento de Produtos**
   - CRUD completo de produtos
   - Validação ANVISA automática
   - Campos obrigatórios: nome, quantidade líquida, informações nutricionais
   - Cálculo automático de avisos (açúcar, sódio, gordura saturada)

3. **Editor Visual de Etiquetas**
   - Canvas com Konva.js para edição visual
   - Múltiplos tamanhos de etiqueta (40x60mm, 50x30mm, A4)
   - Exportação em PNG

4. **Sistema de Planos**
   - Plano Gratuito: até 5 produtos
   - Plano Profissional: produtos ilimitados
   - Trial de 30 dias para novos usuários

5. **Dashboard**
   - Visão geral de produtos
   - Estatísticas de uso do plano
   - Configurações da empresa

### 📋 Próximos Passos

1. **Integração Stripe**
   - Checkout e pagamento
   - Webhooks para mudanças de subscrição

2. **Exportação PDF**
   - Geração de PDF pronto para impressão
   - Múltiplos formatos de etiqueta

3. **Histórico e Auditoria**
   - Rastreamento de mudanças em produtos
   - Log de ações de usuários

4. **Templates Personalizados**
   - Biblioteca de templates pré-definidos
   - Salvamento de templates customizados

5. **API Pública**
   - Endpoints REST para integração
   - Autenticação via API keys

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions, Supabase
- **Database**: PostgreSQL (Supabase)
- **Autenticação**: Supabase Auth
- **Editor Visual**: Konva.js + React-Konva
- **Pagamentos**: Stripe (próximo)

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

### Gerar Etiqueta

1. Clique no ícone de edição no produto
2. Use o editor visual para customizar
3. Exporte em PNG

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
