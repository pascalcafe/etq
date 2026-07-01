import {COLUMN_ALIASES} from "./aliases";
import {normalize} from "./normalize";

export function mapHeaders(headers:string[]){

const result={};

for(const header of headers){

const n=normalize(header);

for(const [field,aliases] of Object.entries(COLUMN_ALIASES)){

if(aliases.map(normalize).includes(n)){

result[field]=header;

}

}

}

return result;

}