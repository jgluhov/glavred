import Glavred from './glavred';

const glavred = new Glavred();
const html = '!!!<p>!!!</p></p> hello<img src="http!!!" />!!!';

async function main() {
  try {
    const status = await glavred.getStatus();
    const proofread = await glavred.proofread(html);
    
    console.log('status', status);
    console.log('proofread', proofread);
  } catch (e) {
    console.log(e);
  }
}

main();




