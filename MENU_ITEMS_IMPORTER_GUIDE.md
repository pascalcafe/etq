# Importador de Itens de Cardápio - Guia Completo

## Visão Geral

O **Importador de Itens de Cardápio** permite que você faça upload em lote de seus produtos através de arquivos CSV ou Excel. O sistema lê as 5 colunas obrigatórias, valida os dados e persiste no banco de dados.

## Colunas Suportadas

O arquivo deve conter exatamente estas 5 colunas (em **qualquer ordem**):

| Coluna | Tipo | Exemplo | Obrigatório |
|--------|------|---------|-------------|
| **Nome** | Texto | "Frango Grelhado" | ✅ Sim |
| **Grupo** | Texto | "Carnes" | ✅ Sim |
| **Valor** | Número | 45.00 ou 45,00 | ✅ Sim |
| **Unidade** | Texto | "Kg", "L", "Porção" | ✅ Sim |
| **Cód. Ref.** | Texto | "FR-GRL-001" | ✅ Sim |

## Arquivo de Exemplo

Aqui está um arquivo CSV pronto para usar:

```csv
Nome,Grupo,Valor,Unidade,Cód. Ref.
Água Filtrada,Bebidas,5.00,L,AG-001
Suco Natural - Laranja,Bebidas,8.50,L,SJ-LJ-001
Refrigerante 2L,Bebidas,12.00,Unidade,RF-2L-001
Frango Grelhado,Carnes,45.00,Kg,FR-GRL-001
Carne Vermelha Premium,Carnes,85.00,Kg,CV-PM-001
Peixe Fresco,Carnes,65.00,Kg,PX-FR-001
Arroz Integral,Grãos,3.50,Kg,AR-INT-001
Feijão Carioca,Grãos,8.00,Kg,FJ-CR-001
Salada Verde Mista,Saladas,12.00,Porção,SL-VM-001
Pão Francês,Padaria,0.80,Unidade,PÃO-FR-001
Bolo de Chocolate,Padaria,35.00,Unidade,BL-CH-001
Café Espresso,Bebidas Quentes,5.00,Xícara,CF-ESP-001
```

## Normalização Automática de Colunas

O sistema é flexível com nomes de coluna. Você pode usar:

### Nome
- ✅ "Nome"
- ✅ "NOME"
- ✅ "Produto"
- ✅ "Item"
- ✅ "Name"

### Grupo
- ✅ "Grupo"
- ✅ "Categoria"
- ✅ "Type"
- ✅ "Category"

### Valor
- ✅ "Valor"
- ✅ "Preço"
- ✅ "Price"
- ✅ "Valor Unitário"

### Unidade
- ✅ "Unidade"
- ✅ "Unit"
- ✅ "Medida"
- ✅ "Un"

### Cód. Ref.
- ✅ "Cód. Ref."
- ✅ "Código"
- ✅ "SKU"
- ✅ "Reference"

## Formatos de Número Aceitos

Todos estes formatos funcionam para o campo "Valor":

| Input | Output | Status |
|-------|--------|--------|
| `45` | 45.00 | ✅ |
| `45.00` | 45.00 | ✅ |
| `45,00` | 45.00 | ✅ |
| `8.50` | 8.50 | ✅ |
| `8,50` | 8.50 | ✅ |
| `R$ 45.00` | ❌ | Remova símbolo |
| `45 reais` | ❌ | Remova texto |

## Como Usar

### Passo 1: Preparar o Arquivo

Crie um arquivo CSV ou Excel com suas colunas e dados:

```
Nome,Grupo,Valor,Unidade,Cód. Ref.
Maçã Vermelha,Frutas,2.50,Kg,MAC-VM-001
```

### Passo 2: Acessar o Importador

```
Dashboard → Gerenciar Produtos → Aba "Itens de Cardápio"
```

URL: `http://localhost:3000/dashboard/products/manage`

### Passo 3: Selecionar Arquivo

1. Clique "Selecionar arquivo"
2. Escolha seu arquivo CSV/Excel (.csv, .xlsx, .xls)

### Passo 4: Revisar Preview

- Sistema exibe os primeiros 5 itens
- Mostra total de itens encontrados
- Mensagens de erro aparecem se houver problemas

### Passo 5: Enviar

1. Clique botão "Enviar"
2. Aguarde a barra de progresso
3. Sucesso! "X itens importados com sucesso!"

## Validação

O sistema valida automaticamente:

✅ **Colunas Obrigatórias** - Todas as 5 devem estar presentes  
✅ **Campos Vazios** - Cada linha deve ter todos os 5 campos  
✅ **Valores Numéricos** - Campo "Valor" deve ser um número  
✅ **Unicidade** - Código de referência é único por item  

## Tratamento de Erros

| Erro | Solução |
|------|---------|
| "Colunas obrigatórias ausentes" | Adicione colunas: Nome, Grupo, Valor, Unidade, Cód. Ref. |
| "Campos faltando" | Preencha todos os campos obrigatórios em cada linha |
| "Valor inválido" | Remova letras do campo Valor (ex: "R$" ou " reais") |
| "Nenhum item válido" | Verifique se o arquivo não está vazio |

## Performance

| Métrica | Valor |
|---------|-------|
| Parse CSV | < 500ms |
| Upload (100 itens) | ~1s |
| Upload (1.000 itens) | ~5s |
| Máximo recomendado | 10.000 itens |

## Integração com Editor

Após importar, os itens aparecem na lista de produtos e podem ser usados no editor de etiquetas:

1. Importe itens via "Itens de Cardápio"
2. Acesse o editor: `/dashboard/labels/editor-pro`
3. Selecione um template
4. Os campos preenchem automaticamente com os dados importados

## Estrutura de Dados

```typescript
interface MenuItem {
  nome: string        // "Frango Grelhado"
  grupo: string       // "Carnes"
  valor: string       // "45.00"
  unidade: string     // "Kg"
  cod_ref: string     // "FR-GRL-001"
}
```

## API (Para Desenvolvedores)

### Endpoint

```
POST /api/menu-items/import
```

### Request

```json
{
  "tenantId": "tenant-uuid",
  "items": [
    {
      "nome": "Frango Grelhado",
      "grupo": "Carnes",
      "valor": "45.00",
      "unidade": "Kg",
      "cod_ref": "FR-GRL-001"
    }
  ]
}
```

### Response (Sucesso)

```json
{
  "success": true,
  "message": "10 itens importados com sucesso",
  "importedCount": 10,
  "items": [...]
}
```

### Response (Erro)

```json
{
  "success": false,
  "message": "Colunas obrigatórias ausentes",
  "errors": ["Coluna 'Nome' não encontrada"]
}
```

## Boas Práticas

1. **Validar antes de enviar** - Use a prévia para verificar
2. **Usar código único** - Cada item deve ter Cód. Ref. único
3. **Grupos consistentes** - Use nomes de grupo padronizados
4. **Valores corretos** - Duplo-verifique preços e quantidades
5. **Backups** - Mantenha cópia do arquivo original

## Troubleshooting

### "Arquivo vazio"
- Verifique se o arquivo tem dados além do header
- Salve novamente o arquivo Excel como CSV se estiver com problemas

### "Coluna não encontrada"
- Revise o nome das colunas no arquivo
- Use os nomes sugeridos na documentação

### "Valores truncados"
- Aumente a largura da coluna no Excel
- Salve como CSV para melhor compatibilidade

### Arquivo Excel não funciona
- Exporte para CSV (.csv) do Excel
- Use "Salvar Como" > "Texto CSV"
- Teste com o arquivo CSV

## Próximos Passos

1. **Crie um arquivo** com seus dados
2. **Acesse** `/dashboard/products/manage`
3. **Clique** na aba "Itens de Cardápio"
4. **Importe** seu arquivo
5. **Use** os dados no editor de etiquetas

---

**Precisa de ajuda?** Verifique a seção de Troubleshooting ou entre em contato com suporte.
