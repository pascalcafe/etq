# 🧪 Guia de Testes - Funcionalidades Avançadas

## Preparação

### 1. Dados de Teste

**Arquivo CSV de Teste**:
- Localização: `/public/exemplo-produtos.csv`
- Contém: 15 produtos completos com todas as colunas opcionais
- Pronto para fazer upload

**Credenciais de Teste** (se aplicável):
- Email: `test@example.com`
- Senha: `password123`

### 2. Ambiente Local

```bash
cd /vercel/share/v0-project
pnpm install
pnpm dev
```

Acesse: `http://localhost:3000`

---

## 📋 Testes por Funcionalidade

### ✅ Teste 1: Upload em Lote de Produtos

**Pré-requisitos**:
- ✓ Usuário autenticado
- ✓ Arquivo CSV com colunas: `name`, `ean`

**Passos**:
1. Clique em "Gerenciar Produtos" no sidebar
2. Selecione aba "Upload em Lote"
3. Clique "Selecionar arquivo"
4. Escolha `/public/exemplo-produtos.csv`
5. **Validar**: Prévia mostra primeiras 5 linhas
6. Clique "Enviar"
7. **Validar**: Mensagem de sucesso "Produtos importados com sucesso!"
8. Redirecionado para "Meus Produtos" em 2 segundos

**Resultados Esperados**:
- ✅ 15 produtos importados
- ✅ Cada produto aparece em "Meus Produtos"
- ✅ Dados nutricionais visíveis (sugar_g, sodium_mg, etc)
- ✅ Avisos ANVISA calculados automaticamente

**Validações de Erro**:
- [ ] Teste com arquivo vazio
- [ ] Teste com colunas faltando (`ean` obrigatório)
- [ ] Teste com arquivo quebrado (não-UTF8)
- [ ] Teste com mais de 1000 produtos

---

### ✅ Teste 2: Galeria de Templates

**Pré-requisitos**:
- ✓ Usuário autenticado

**Passos**:
1. Clique em "Gerenciar Produtos" → Aba "Templates"
2. **Validar**: 12 templates predefinidos aparecem
3. Filtro "Frutas": **Validar** - mostra Pêssego Nacional + Frutas 40x60
4. Filtro "Bebidas": **Validar** - mostra apenas Bebidas 50x30mm
5. Clique em "Usar" em "Pêssego Nacional"
6. **Validar**: Redireciona para editor com 50x80mm configurado
7. Volte para Templates
8. Clique "Duplicar" em um template
9. **Validar**: Novo template aparece com "(cópia)" no nome
10. Clique "Deletar" no template duplicado
11. **Validar**: Template removido da lista

**Resultados Esperados**:
- ✅ Todos 12 templates visíveis inicialmente
- ✅ Filtros funcionam corretamente
- ✅ Duplicação cria novo template
- ✅ Deletação remove template (apenas os não-padrão)
- ✅ Templates padrão não têm botão deletar

---

### ✅ Teste 3: Gerenciador de Tamanhos

**Pré-requisitos**:
- ✓ Usuário autenticado

**Passos**:
1. Clique em "Gerenciar Produtos" → Aba "Tamanhos"
2. **Validar**: 6 tamanhos pré-configurados aparecem (40x60, 50x30, etc)
3. Preencha:
   - Nome: "Etiqueta Customizada"
   - Largura: 45
   - Altura: 75
4. Clique "Adicionar"
5. **Validar**: Novo tamanho aparece na lista
6. **Validar**: Mostra "45 × 75 mm" e conversão em pixels (~170×283px)
7. Clique "Selecionar" no tamanho novo
8. **Validar**: Editor abre com as dimensões corretas
9. Volte para Tamanhos
10. Clique "Deletar" no tamanho criado
11. **Validar**: Tamanho removido

**Resultados Esperados**:
- ✅ Tamanhos pré-configurados têm botão deletar desabilitado
- ✅ Novos tamanhos deletáveis
- ✅ Conversão mm → pixels precisa (aproximadamente 96 DPI)
- ✅ Preview visual do aspect ratio correto

---

### ✅ Teste 4: Editor Visual Avançado

**Pré-requisitos**:
- ✓ Usuário autenticado
- ✓ Pelo menos 1 produto cadastrado

**Passos A: Adicionar e Mover Elementos**

1. Abra um produto em "Meus Produtos"
2. Clique no ícone editar
3. **Validar**: Editor abre com Konva canvas
4. Clique "Adicionar" → "Texto"
5. **Validar**: Novo elemento de texto aparece
6. Clique no elemento de texto
7. **Validar**: Painel de propriedades aparece no lado direito
8. Arraste o elemento para outro local
9. **Validar**: Elemento se move suavemente
10. Redimensione pelo canto (arraste alça)
11. **Validar**: Largura/Altura atualizam no painel

**Passos B: Editar Propriedades**

1. Com elemento de texto selecionado
2. No painel de propriedades:
   - Altere "Posição X" para 20
   - **Validar**: Elemento move para X=20mm
3. Altere "Posição Y" para 30
   - **Validar**: Elemento move para Y=30mm
4. Altere "Largura" para 50
   - **Validar**: Elemento redimensiona para 50mm
5. Altere "Altura" para 20
   - **Validar**: Elemento redimensiona para 20mm
6. Modifique "Texto" para "Olá Mundo"
   - **Validar**: Texto no canvas atualiza
7. Altere "Tamanho Fonte" para 24
   - **Validar**: Fonte fica maior

**Passos C: Múltiplos Elementos**

1. Clique "Adicionar" → "Retângulo"
2. **Validar**: Novo retângulo aparece
3. Clique "Adicionar" → "QR Code"
4. **Validar**: Novo elemento QR Code (placeholder)
5. Clique "Adicionar" → "Código de Barras"
6. **Validar**: Novo elemento barcode (placeholder)
7. **Validar**: 4 elementos no total agora visíveis
8. Clique em cada um e **Validar**: Painel atualiza com suas propriedades

**Passos D: Duplicação e Deletação**

1. Com texto selecionado, clique "Duplicar"
2. **Validar**: Novo texto aparece 20px para baixo e para direita
3. Clique "Deletar"
4. **Validar**: Elemento removido
5. Selecione o retângulo
6. Pressione Delete
7. **Validar**: Retângulo removido

**Passos E: Salvamento**

1. Clique "Salvar Layout"
2. **Validar**: Mensagem de sucesso (ou loader)
3. Recarregue a página (F5)
4. **Validar**: Elementos persistem (foram salvos no BD)

**Resultados Esperados**:
- ✅ Adição de 4 tipos de elementos
- ✅ Drag-and-drop funciona suavemente
- ✅ Propriedades refletem em tempo real
- ✅ Conversão mm ↔ px automática
- ✅ Duplicação e deletação funcionam
- ✅ Salvamento persiste dados

---

### ✅ Teste 5: Integração End-to-End

**Cenário**: Importar produtos → Usar template → Customizar no editor

**Passos**:
1. "Gerenciar Produtos" → "Upload em Lote"
2. Faça upload do `exemplo-produtos.csv`
3. **Validar**: 15 produtos importados
4. "Gerenciar Produtos" → "Templates"
5. Clique "Usar" em "Frutas - 40x60mm"
6. **Validar**: Editor abre com template pré-carregado
7. Customize elementos (altere posições, tamanhos, texto)
8. Clique "Salvar Layout"
9. **Validar**: Etiqueta salva
10. Volte para "Meus Produtos"
11. Veja o produto com a etiqueta customizada

**Resultados Esperados**:
- ✅ Fluxo completo funcionando
- ✅ Templates carregam corretamente
- ✅ Customizações persistem
- ✅ Usuário consegue iterar rapidamente

---

## 🐛 Testes de Erro e Edge Cases

### Upload - Validações

- [ ] Arquivo sem cabeçalho
- [ ] Colunas obrigatórias faltando (`name` ou `ean`)
- [ ] Valores vazios ou nulos
- [ ] Caracteres especiais em nomes
- [ ] EAN duplicado
- [ ] Valores numéricos inválidos (sugar_g, sodium_mg)

### Editor - Edge Cases

- [ ] Elemento muito pequeno (< 20px)
- [ ] Elemento muito grande (> tamanho do canvas)
- [ ] Múltiplos elementos sobrepostos
- [ ] Zoom in/out (se implementado)
- [ ] Rotação de elemento (se implementado)
- [ ] Desfazer ação (undo - se implementado)

### Segurança

- [ ] Usuário B não consegue ver produtos de Usuário A
- [ ] Usuário não autenticado redirecionado para login
- [ ] Tenants isolados por RLS

---

## 📊 Métricas de Sucesso

- ✅ 100% dos 12 templates funcionando
- ✅ Upload de 1000+ produtos em < 5 segundos
- ✅ Editor responde em < 100ms por ação
- ✅ Nenhuma perda de dados ao salvar
- ✅ RLS funciona (isolamento de tenants)

---

## 🎯 Relatório de Teste

Após completar os testes, preencha:

```markdown
## Teste Realizado em: [DATA]
## Versão: [v0.2.0 - Funcionalidades Avançadas]

### Resumo
- [ ] Upload em Lote: ✅ PASSOU / ❌ FALHOU
- [ ] Galeria de Templates: ✅ PASSOU / ❌ FALHOU
- [ ] Gerenciador de Tamanhos: ✅ PASSOU / ❌ FALHOU
- [ ] Editor Visual: ✅ PASSOU / ❌ FALHOU
- [ ] Integração E2E: ✅ PASSOU / ❌ FALHOU

### Issues Encontrados
- [ ] (listar problemas)

### Comentários
- (notas adicionais)
```

---

## 🚀 Próximas Implementações a Testar

Quando implementadas, testar:
- [ ] Exportação PDF
- [ ] Impressão direta
- [ ] Histórico de versões (undo/redo)
- [ ] API pública
- [ ] Integração Stripe
