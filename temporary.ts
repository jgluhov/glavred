import htmlParser from 'htmlparser2';
import { IParsedElement, TParsedHTMLResult } from './glavred.interface';

export enum GlavredStatusEnum {
  OK = 'ok',
  ERROR = 'error'
}

export default class Glavred {

  parseHTML(htmlStr: string = ''): TParsedHTMLResult {
    let htmlIndex: number = 0;
    let textIndex: number = 0;

    const result = {
      text: '',
      parsedHTML: []
    };

    const parseFn = (parsedEl: IParsedElement): void => {
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

    const parsedElements: IParsedElement[]  = htmlParser.parseDOM(htmlStr);
    parsedElements.forEach(parseFn)

    return result;
  }

  private getChildren(parsedEl: IParsedElement) {
    return parsedEl.children || [];
  };
  
  private getData(parsedEl: IParsedElement): string {
    return parsedEl.data ? parsedEl.data : '';
  } 

  private getTagSize(parsedEl: IParsedElement, open: boolean = true) {
    if (parsedEl.type === 'text') {
      return 0;
    }

    return parsedEl.name.length + (open ? 2 : 3);
  }

  get glvrd() {
    return window && window['glvrd'];
  }
}
