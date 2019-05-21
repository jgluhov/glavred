import Glavred from './glavred';

const glavred = new Glavred();
const html = '!!!';

async function main() {
  try {
    const status = await glavred.getStatus();
    const proofread = await glavred.proofread(html);

    console.log(proofread)
  } catch (e) {
    console.log(e);
  }
}

main();




