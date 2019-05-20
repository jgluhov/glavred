
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

export default class Glavred {

  parseHTML(htmlStr: string = ''): TParsedHTMLResult {
    let htmlIndex: number = 0;
    let textIndex: number = 0;

    const result = {
      text: '',
      parsedHTML: []
    };

    const parseFn = (parsedEl: TParsedElement): void => {
      htmlIndex += this.getTagSize(parsedEl);
  
      this.getChildren(parsedEl).forEach(parseFn);        

      const text = this.getData(parsedEl);

      if (parsedEl.children) {
        htmlIndex += this.getTagSize(parsedEl, false);
        return;
      }

      if (!text.length) {
        return;
      }
      
      result.text += text;
      
      result.parsedHTML.push([htmlIndex, text.length, textIndex]);
      textIndex += text.length;
      htmlIndex += text.length + this.getTagSize(parsedEl, false);
    }

    const parsedElements: TParsedElement[]  = htmlParser.parseDOM(htmlStr);
    parsedElements.forEach(parseFn)

    return result;
  }

  private getChildren(parsedEl: TParsedElement) {
    return parsedEl.children || [];
  };
  
  private getData(parsedEl: TParsedElement): string {
    return parsedEl.data ? parsedEl.data : '';
  } 

  private getTagSize(parsedEl: TParsedElement, open: boolean = true) {
    if (parsedEl.type === 'text') {
      return 0;
    }

    return parsedEl.name.length + (open ? 2 : 3);
  }
}
