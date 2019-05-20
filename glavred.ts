
export interface IGlavred {
  toDOMTree: (htmlStr: string) => HTMLElement;
}

export default function glavred(window) {

  const parseFromString = (htmlStr: string) => {
    return (new window.DOMParser().parseFromString(htmlStr, 'text/html')).body;
  };

  const toDOMTree = (htmlStr: string = ''): HTMLElement => {
    if (!htmlStr) {
      return null;
    }
  
    return parseFromString(htmlStr);
  };


  return {
    toDOMTree
  };
}
