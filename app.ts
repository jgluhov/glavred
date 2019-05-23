import Glavred, { ParsingListItem, ParsingList } from './glavred';
import * as helpers from './helpers';

const glavred = new Glavred();

// const htmlStr = 'mamba!!!mamba';
// const proof = helpers.createProof([5, 8]);
// const parsingList = new ParsingList(htmlStr, [
//   new ParsingListItem([0, 13, 0])
// ])

// const htmlStr = '<p>!!!mamba!!!<p>';
// const proof = helpers.createProof([3, 6], [11, 14]);
// const parsingList = new ParsingList(htmlStr, [ new ParsingListItem([3, 14, 0])])

// const htmlStr = '!!!mamba!!!';
// const proof = helpers.createProof([0, 3], [8, 11]);
// const parsingList = new ParsingList(htmlStr, [
//   new ParsingListItem([0, 11, 0])
// ]);

const htmlStr = '<p>!!!</p>'
const proof = helpers.createProof([0, 3]);
const parsingList = new ParsingList('!!!', [
  new ParsingListItem([3, 3, 0])
]);

glavred.applyProof(htmlStr, parsingList, proof)

document.addEventListener('DOMContentLoaded', () => {
  const display = document.querySelector('.display__content');
  const editor = document.querySelector('.editor__control');
  const progress = document.querySelector('.display__progress');
  
  let isLoading = false;
  let loadingClassName = 'display__progress--visible';

  function updateDisplay(htmlStr: string) {
    display.innerHTML = htmlStr;
  }

  const updateLoading = (changedState) => {
    isLoading = changedState;

    changedState ?
      progress.classList.add(loadingClassName) :
      progress.classList.remove(loadingClassName);
  };

  async function handleChangeEditor({ target }: Event) {
    try {
      if (isLoading) {
        glavred.abortProofreading();
      }
      updateLoading(true);

      const proofedHTML = await glavred.proof((target as HTMLTextAreaElement).value);
      
      updateLoading(false);
      updateDisplay(proofedHTML);
    } catch (e) {
      updateLoading(false);
      updateDisplay('');
    }
  }

  function main() {
    editor.addEventListener('change', handleChangeEditor);
  }

  main();

});




