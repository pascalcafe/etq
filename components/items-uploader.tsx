const rows=await parse(file);

const headers=Object.keys(rows[0]);

const mapping=mapHeaders(headers);

const preview=createPreview(rows,mapping);