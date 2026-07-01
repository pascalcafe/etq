import Papa from "papaparse";
import * as XLSX from "xlsx";

export async function parse(file:File){

const ext=file.name.split(".").pop()?.toLowerCase();

if(ext==="csv"){

return new Promise((resolve)=>{

Papa.parse(file,{

header:true,

complete:r=>resolve(r.data)

})

})

}

const buffer=await file.arrayBuffer();

const workbook=XLSX.read(buffer);

const sheet=workbook.Sheets[workbook.SheetNames[0]];

return XLSX.utils.sheet_to_json(sheet);

}