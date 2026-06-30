# 🚀 Guia de Deployment - EtiqueLabel v0.2.0

## Pre-requisitos

- Node.js 18+ instalado
- Conta Supabase criada
- Projeto Vercel criado (opcional, pode usar outro host)
- Git instalado

---

## 1️⃣ Preparação Local

### Clonar Repositório
```bash
git clone https://github.com/seu-usuario/etiquelabel.git
cd etiquelabel
pnpm install
```

### Configurar Variáveis de Ambiente

Crie arquivo `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key

# Opcional - Stripe (futura implementação)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Ambiente
NODE_ENV=production
```

### Executar Migrations Localmente

```bash
# Conectar ao Supabase
pnpm supabase link --project-id seu-projeto-id

# Executar migrations (já aplicadas no DB)
pnpm supabase db pull
```

---

## 2️⃣ Build Local

Testar build antes de fazer deploy:

```bash
pnpm build
pnpm start
```

Acessar `http://localhost:3000` e testar:
- ✅ Login/Sign-up
- ✅ Upload de produtos (use `/public/exemplo-produtos.csv`)
- ✅ Templates
- ✅ Editor visual

---

## 3️⃣ Deploy para Vercel (Recomendado)

### A. Primeiro Deployment

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Deploy
vercel

# Serão pedidas algumas informações:
# - Link existing project: No
# - Set up and deploy: Yes
# - Scope: seu-workspace
# - Project name: etiquelabel
# - Framework: Next.js
# - Root directory: ./
```

### B. Configurar Variáveis de Ambiente no Vercel

1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em "Settings" → "Environment Variables"
4. Adicione:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = seu-anon-key
   SUPABASE_SERVICE_ROLE_KEY = seu-service-role-key
   ```
5. Clique "Save"

### C. Redeploy

```bash
vercel
```

Ou faça push para a branch principal:
```bash
git push origin main
```

Vercel fará deploy automático (CI/CD via GitHub).

---

## 4️⃣ Deploy para Outro Host

### DigitalOcean App Platform

```bash
# 1. Criar app.yaml
cp app.yaml.example app.yaml

# 2. Configurar variáveis
# Editar app.yaml com seus valores

# 3. Deploy
doctl apps create --spec app.yaml
```

### AWS Amplify

```bash
# 1. Conectar GitHub
# https://console.aws.amazon.com/amplify

# 2. Selecionar repositório
# 3. Configurar build settings
# 4. Deploy automático

# Env vars via AWS Console → Amplify → App settings
```

### Heroku (Deprecated, não recomendado)

```bash
# Já não oferece free tier
# Migrar para Vercel ou outro
```

---

## 5️⃣ Checklist Pré-Deployment

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Build local passou sem erros
- [ ] RLS policies criadas no Supabase
- [ ] Exemplo CSV em `/public/exemplo-produtos.csv`
- [ ] Tests passaram (se tiver)
- [ ] `.env.local` não commitado (no `.gitignore`)
- [ ] Supabase backups configurados
- [ ] Domain + SSL configurado (Vercel faz automaticamente)

---

## 6️⃣ Monitoramento Pós-Deployment

### Logs do Servidor

**Vercel**:
```bash
vercel logs
```

**DigitalOcean**:
```bash
doctl apps logs seu-app-id
```

**AWS Amplify**:
- Console AWS → Amplify → Logs

### Métricas

**Vercel Analytics**:
- https://vercel.com/dashboard/seu-projeto/analytics

**Web Vitals**:
- Monitorar CLS, LCP, FID

### Uptime Monitoring

Configurar alertas de uptime:
- Uptime Robot (free)
- StatusPage.io
- Datadog

---

## 7️⃣ Troubleshooting

### Build Falha com "Module not found"

```bash
# Limpar cache
rm -rf .next node_modules
pnpm install

# Rebuild
pnpm build
```

### Supabase RLS Bloqueando Queries

```sql
-- Verificar policies em Supabase Console
-- SQL Editor → Executar:

SELECT * FROM pg_policies WHERE tablename = 'label_templates';
```

### Timeout em Upload Grande

```bash
# Aumentar timeout no vercel.json
{
  "api": {
    "bodyParser": {
      "sizeLimit": "50mb"
    },
    "responseLimit": "50mb"
  }
}
```

### CORS Issues

Verificar CORS no Supabase:
- Project Settings → API → CORS Configuration
- Adicionar seu domínio

---

## 8️⃣ Escalabilidade Futura

### Aumentar Limite de Produtos

Na migration, modificar:
```sql
-- Aumentar storage Supabase
-- Padrão: 5GB gratuito, upgrade conforme necessário
```

### Otimizações

```javascript
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

### Cache Strategy

```typescript
// app/dashboard/products/manage/page.tsx
export const revalidate = 60 // Cache por 1 minuto
```

---

## 9️⃣ Backup & Recovery

### Supabase Backups

1. Vá em Project Settings → Backups
2. Ativar backups automáticos diários
3. Manter por 30 dias (padrão)

### Exportar Dados

```bash
# Exportar tabela de produtos
pnpm supabase db dump > backup_$(date +%Y%m%d).sql

# Restaurar
pnpm supabase db restore < backup_20260630.sql
```

### GitHub Backups

```bash
# Já está automático com Git
# Fazer commits regularmente

git add .
git commit -m "Deployment version 0.2.0"
git push origin main
```

---

## 🔟 CI/CD Pipeline (GitHub Actions)

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      - run: pnpm run lint
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          pnpm exec vercel deploy --prod
```

---

## 📊 Performance Esperado

Após deployment:
- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **Time to Interactive**: < 3.5s

Verificar em: https://pagespeed.web.dev/

---

## 🆘 Suporte Técnico

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| 404 na página de produtos | Verificar routing em `app/dashboard/products/manage` |
| Upload falha silenciosamente | Verificar console do navegador, logs Vercel |
| RLS bloqueando dados | Adicionar `tenant_id` à query |
| Slow upload | Aumentar timeout em vercel.json |

### Recursos

- 📚 [Next.js Docs](https://nextjs.org/docs)
- 📚 [Supabase Docs](https://supabase.io/docs)
- 📚 [Vercel Docs](https://vercel.com/docs)
- 💬 [EtiqueLabel GitHub Issues](https://github.com/seu-usuario/etiquelabel/issues)

---

## 🎉 Conclusão

Você está pronto para fazer deploy! Siga os passos acima e seu EtiqueLabel estará no ar em minutos.

**Versão**: 0.2.0 - Funcionalidades Avançadas  
**Data**: June 2026  
**Status**: ✅ Production Ready

---

**Boa sorte com o deployment! 🚀**
