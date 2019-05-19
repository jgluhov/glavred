
export interface IGlavred {
  toDOMTree: (htmlStr: string) => HTMLElement;
}

export default function glavred(window) {

  const toDOMTree = (htmlStr: string = ''): HTMLElement => {
    if (!htmlStr) {
      return null;
    }
  
    const parsedDocument: Document = new window.DOMParser().parseFromString(htmlStr, 'text/html');

    console.log(parsedDocument.body.textContent)
    return parsedDocument.body;
  }


  return {
    toDOMTree
  };
}
