# Aviso sobre o Arquivo Excel Enviado

## Situação

O arquivo **Manutenção de produtos** foi analisado, mas parece estar com formato ou encoding não compatível com o SheetJS parser atual.

## Solução

Para que o arquivo funcione no sistema:

### Opção 1: Converter para CSV (Recomendado)

1. **Abra o arquivo** em Excel/LibreOffice/Google Sheets
2. **Selecione tudo** (Ctrl+A)
3. **Salve Como** → Selecione formato "CSV UTF-8"
4. **Nomeie** como `cardapio.csv`
5. **Faça upload** no dashboard

### Opção 2: Verificar o Arquivo

Se o arquivo Excel é válido:

1. Abra em Excel
2. Verifique se há dados visíveis
3. Certifique-se que as colunas estão presentes:
   - Nome
   - Grupo
   - Valor
   - Unidade
   - Cód. Ref.
4. Salve como CSV e tente novamente

### Opção 3: Criar Novo Arquivo

1. Abra o Excel original
2. Copie os dados
3. Crie uma nova planilha
4. Cole os dados
5. Salve como CSV

## Colunas Esperadas

O sistema espera exatamente estas 5 colunas (em qualquer ordem):

- **Nome**: Nome do produto (ex: "Frango Grelhado")
- **Grupo**: Categoria do produto (ex: "Carnes")
- **Valor**: Preço (ex: "45.00" ou "45,00")
- **Unidade**: Unidade de medida (ex: "Kg", "L", "Porção")
- **Cód. Ref.**: Código de referência único (ex: "FR-GRL-001")

## Teste de Compatibilidade

Após converter para CSV, teste com um pequeno arquivo primeiro:

1. Exporte as primeiras 5 linhas como CSV
2. Acesse `/dashboard/products/manage`
3. Aba "Itens de Cardápio"
4. Faça upload do arquivo pequeno
5. Verifique se a prévia mostra os dados corretamente

## Próximos Passos

1. Converter arquivo para CSV
2. Testar upload no dashboard
3. Verificar preview dos dados
4. Fazer upload completo

---

**Precisa de ajuda?** Consulte `MENU_ITEMS_IMPORTER_GUIDE.md` para instruções detalhadas.
