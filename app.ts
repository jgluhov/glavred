import Glavred from './glavred';

const glavred = new Glavred();

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




