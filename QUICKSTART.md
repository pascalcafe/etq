# ⚡ Quick Start - EtiqueLabel v0.2.0

Comece em 5 minutos!

---

## 🚀 Instalação e Configuração (2 min)

### 1. Clone e Install
```bash
git clone https://github.com/seu-usuario/etiquelabel.git
cd etiquelabel
pnpm install
```

### 2. Configure Supabase
Crie `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key
SUPABASE_SERVICE_ROLE_KEY=seu-service-role
```

### 3. Inicie Dev Server
```bash
pnpm dev
```
Acesse: `http://localhost:3000`

---

## 📝 Primeiros Passos (3 min)

### Etapa 1: Criar Conta
1. Clique "Começar Grátis"
2. Email: `test@example.com`
3. Senha: `password123`
4. Confirme email

### Etapa 2: Importar Produtos
1. Dashboard → **Gerenciar Produtos**
2. Aba "Upload em Lote"
3. Selecione `/public/exemplo-produtos.csv`
4. Clique "Enviar"
5. ✅ 15 produtos importados!

### Etapa 3: Usar Template
1. Dashboard → **Gerenciar Produtos**
2. Aba "Templates"
3. Clique "Usar" em "Frutas - 40x60mm"
4. ✅ Editor abre!

### Etapa 4: Customizar Etiqueta
1. No editor, clique "Texto"
2. Arraste para mover
3. Altere propriedades no painel direito
4. Clique "Salvar Layout"
5. ✅ Etiqueta salva!

---

## 🎯 Casos de Uso Rápidos

### 💼 Cenário 1: Import em Lote
```
Dashboard → Gerenciar Produtos → Upload em Lote
→ Selecione seu CSV → Enviar → ✅ Produtos importados
```
⏱️ Tempo: 30 segundos

### 📐 Cenário 2: Template Predefinido
```
Dashboard → Gerenciar Produtos → Templates
→ Escolha categoria → Clique "Usar" → ✅ Editor abre
```
⏱️ Tempo: 15 segundos

### 🎨 Cenário 3: Tamanho Customizado
```
Dashboard → Gerenciar Produtos → Tamanhos
→ Nome + Largura + Altura → Adicionar → ✅ Disponível
```
⏱️ Tempo: 20 segundos

### ✏️ Cenário 4: Editar Etiqueta
```
Meus Produtos → Clique ícone editar → Customize → Salvar
```
⏱️ Tempo: 2 minutos

---

## 🎮 Controles do Editor

| Ação | Como Fazer |
|------|-----------|
| **Mover elemento** | Click + Arraste |
| **Redimensionar** | Arraste canto |
| **Editar texto** | Painel direito → "Texto" |
| **Mudar font size** | Painel direito → "Tamanho Fonte" |
| **Duplicar** | Botão "Duplicar" |
| **Deletar** | Botão "Deletar" ou Delete key |
| **Salvar** | Botão "Salvar Layout" |

---

## 📁 Estrutura de Pastas Importante

```
etiquelabel/
├── components/
│   ├── product-uploader.tsx        ← Upload CSV
│   ├── templates-gallery.tsx       ← Galeria 12+ templates
│   ├── advanced-label-editor.tsx   ← Editor Konva.js
│   └── custom-sizes-manager.tsx    ← Tamanhos
├── hooks/
│   └── use-tenant.ts               ← Tenant management
├── app/
│   ├── api/products/import/        ← API upload
│   └── dashboard/products/manage/  ← Página gerenciador
├── public/
│   └── exemplo-produtos.csv        ← Dados teste
└── docs/
    ├── FEATURES_ADVANCED.md        ← Guia completo
    ├── TESTING_GUIDE.md            ← Testes
    └── DEPLOYMENT.md               ← Deploy
```

---

## 🧪 Arquivo de Teste

Use `/public/exemplo-produtos.csv` com 15 produtos:
- ✅ Pêssego Nacional
- ✅ Suco Natural
- ✅ Leite Integral
- ✅ Carne Vermelha
- ✅ Arroz Integral
- ... e mais 10 produtos

---

## 📚 Documentação Rápida

| Documento | O quê? |
|-----------|--------|
| **FEATURES_ADVANCED.md** | Guia completo de funcionalidades |
| **TESTING_GUIDE.md** | Como testar tudo |
| **DEPLOYMENT.md** | Como fazer deploy |
| **IMPLEMENTATION_SUMMARY.md** | Detalhes técnicos |
| **CHANGELOG.md** | Histórico de versões |
| **PROJECT_SUMMARY.txt** | Resumo visual |

---

## 🐛 Troubleshooting Rápido

### "Module not found: papaparse"
```bash
pnpm install
```

### "Build fails"
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

### "Supabase RLS error"
- Verificar variáveis de ambiente em `.env.local`
- Tentar fazer refresh (F5) na página

### "Upload não funciona"
- Verificar se CSV tem colunas: `name`, `ean`
- Verificar se arquivo é UTF-8

---

## 🔐 Dicas de Segurança

✅ Nunca commitar `.env.local`  
✅ Usar HTTPS em produção  
✅ Ativar 2FA no Supabase  
✅ Fazer backup regularmente  
✅ Monitorar logs de acesso  

---

## 🚀 Deploy em 3 Passos

```bash
# 1. Build
pnpm build

# 2. Teste localmente
pnpm start

# 3. Deploy
vercel deploy --prod
```

Ou push para GitHub e deixar CI/CD fazer o resto!

---

## 💡 Dicas & Tricks

### Converter CSV do Excel
1. Abra seu .xlsx
2. Salve como CSV (UTF-8)
3. Certifique-se que tem colunas: name, ean
4. Upload em "Gerenciar Produtos"

### Criar Tamanho Padrão
1. Não consegue deletar um tamanho?
   - É porque é pré-configurado (padrão)
   - Duplicar um template e customizar!

### Usar Template como Base
1. Escolha um template similar
2. Clique "Duplicar"
3. Customize conforme necessário
4. Salve como novo template!

### Performance do Editor
- Konva.js é super rápido
- Até 100+ elementos funcionam bem
- Zoom automático em telas pequenas

---

## ✨ Funcionalidades Favoritas

### 🏆 Upload em Lote
Importe 1000+ produtos em segundos!

### 🎨 Editor Visual
Arraste elementos, redimensione, customize sem código!

### 📋 12+ Templates
Escolha entre categorias de alimentos

### 📐 Tamanhos Customizados
Crie dimensões personalizadas para seus produtos

### 🔐 Multi-tenancy
Seus dados isolados e seguros do Supabase

---

## 🎯 Próximos Passos

Depois de 5 minutos de Quick Start:

1. **Leia FEATURES_ADVANCED.md**
   - Entenda todas as funcionalidades
   - Veja exemplos de uso

2. **Execute Testes**
   - Siga TESTING_GUIDE.md
   - Valide se tudo está funcionando

3. **Deploy para Produção**
   - Siga DEPLOYMENT.md
   - Use Vercel ou outro host

4. **Customize Conforme Necessário**
   - Modifique components
   - Adicione suas funcionalidades

---

## 📞 Precisa de Ajuda?

1. **Dúvida geral?**
   - 📖 Leia FEATURES_ADVANCED.md

2. **Como testar?**
   - 🧪 Siga TESTING_GUIDE.md

3. **Como fazer deploy?**
   - 🚀 Siga DEPLOYMENT.md

4. **Bug encontrado?**
   - 🐛 Verifique console (F12)
   - 📋 Check TESTING_GUIDE.md "Troubleshooting"
   - 💬 Abra issue no GitHub

---

## 🎉 Parabéns!

Você agora tem um **SaaS profissional de etiquetas alimentícias** rodando localmente!

### Próximo:
- [ ] Testar todos os features
- [ ] Fazer deploy
- [ ] Adicionar seus próprios dados
- [ ] Customizar conforme necessário

**Status**: ✅ Ready to Rock! 🚀

---

**Versão**: 0.2.0  
**Data**: June 30, 2026  
**Tempo de setup**: ~5 minutos  
**Complexidade**: ⭐ Iniciante-friendly
