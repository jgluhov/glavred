
import htmlParser from 'htmlparser2';

type TParsedHTMLResult = {
  text: string;
  parsedHTML: number[][];
};

type TParsedElement = {
  data?: string;
  type: string;
  next: TParsedElement;
  prev: TParsedElement;
  parent: TParsedElement;
  name: string;
  children?: TParsedElement[];
}

export interface IGlavred {
  parseHTML: (htmlStr: string) => TParsedHTMLResult;
}

export default function glavred() {

  const getTagSize = (parsedEl: TParsedElement, open: boolean = true) => {
    if (parsedEl.type === 'text') {
      return 0;
    }

    return parsedEl.name.length + (open ? 2 : 3);
  }

  const getChildren = (parsedEl: TParsedElement) => parsedEl.children || [];
  const getData = (parsedEl: TParsedElement): string => parsedEl.data ? parsedEl.data : '';

  const parseHTML = (htmlStr: string = ''): TParsedHTMLResult => {
    let htmlIndex: number = 0;
    let textIndex: number = 0;

    const result = {
      text: '',
      parsedHTML: []
    };

    const parseFn = (parsedEl: TParsedElement): void => {
      htmlIndex += getTagSize(parsedEl);
  
      getChildren(parsedEl).forEach(parseFn);        

      const text = getData(parsedEl);

      if (parsedEl.children) {
        htmlIndex += getTagSize(parsedEl, false);
        return;
      }

      if (!text.length) {
        return;
      }
      
      result.text += text;
      
      result.parsedHTML.push([htmlIndex, text.length, textIndex]);
      textIndex += text.length;
      htmlIndex += text.length + getTagSize(parsedEl, false);
    }

    const parsedElements: TParsedElement[]  = htmlParser.parseDOM(htmlStr);
    parsedElements.forEach(parseFn)

    return result;
  }

  return {
    parseHTML
  };
}
