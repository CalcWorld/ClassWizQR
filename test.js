import { ClassWizQR } from './index.js';

const cwqr = new ClassWizQR();

let url = 'http://wes.casio.com/math/index.php?q=I-234F+U-000000000000+M-C10000AD00+S-001410100000100E1010B000AC14+R-0200000000000000010000000000000000000000+E-31A631'

console.log(cwqr.setUrl(url).getResult());
// console.log(JSON.stringify(cwqr.getResult(), null, 2));
url = 'http://wes.casio.com/math/index.php?q=I-234F+U-000000000000+M-X100000000+S-05099'
console.log(cwqr.setUrl(url).getResult());
