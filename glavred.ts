import {
  IProof,
  TStatus,
  TParticle,
  IParsedElement,
  IProofFragment
} from './glavred.interface';
import { size, last, first } from 'lodash';
import htmlParser from 'htmlparser2';

export enum GlavredStatusEnum {
  OK = 'ok',
  ERROR = 'error'
}

export class ParsingListItem {
  constructor(private value: number[] = []) {}

  get startHTMLIndex() {
    return this.value[0];
  }

  get endHTMLIndex() {
    return this.value[0] + this.value[1];
  }

  get startTextIndex() {
    return this.value[2];
  }

  get endTextIndex() {
    return this.value[2] + this.value[1];
  }

  get length() {
    return this.value[1];
  }

  contains(fragment: IProofFragment): boolean {
    if (!this.length) {
      return false;
    }

    if (fragment.start === fragment.end) {
      return false;
    }

    if (fragment.end < this.startTextIndex) {
      return false;
    }

    if (fragment.start > this.endTextIndex) {
      return false;
    }

    return fragment.start >= this.startTextIndex && fragment.end <= this.endTextIndex ||
      fragment.start < this.startTextIndex || fragment.end > this.endTextIndex;
  }
}

export class ParsingList {
  constructor(
    public text: string = '',
    public items: ParsingListItem[] = []
  ) {}

  get first(): ParsingListItem {
    return first(this.items);
  }

  get last(): ParsingListItem {
    return last(this.items);
  }

  appendText(text: string) {
    this.text += text;
  }

  appendItem(...params) {
    this.items.push(new ParsingListItem(params));
  }

  get length() {
    return this.items.length;
  }
}

export default class Glavred {
  parseHTML(htmlStr: string = ''): ParsingList {
    let htmlIndex: number = 0;
    let textIndex: number = 0;

    const parsingList = new ParsingList();

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
      
      parsingList.appendText(text);
      parsingList.appendItem(htmlIndex, text.length, textIndex)

      textIndex += text.length;
      htmlIndex += text.length + this.getTagSize(parsedEl, false);
    }

    const parsedElements: IParsedElement[]  = htmlParser.parseDOM(htmlStr);
    parsedElements.forEach(parseFn)

    return parsingList;
  }  

  async proof(htmlStr: string): Promise<string> {
    const parsing = this.parseHTML(htmlStr);

    const proof = await this.proofread(parsing.text);

    const particles = this.applyProof(htmlStr, parsing, proof);

    if (!size(particles)) {
      return parsing.text;
    }

    const proofedHTML = particles
      .map(particle => {
        return this.hasError(particle) ?
          this.highlight(particle) : this.getText(particle);
      })
      .join('');
    
    return proofedHTML;
  }

  applyProof(htmlStr: string, parsingList: ParsingList, proof: IProof) {
    const accumulator = [];

    if (!htmlStr) {
      return [];
    }

    // Filter incorrect fragments if there are any
    let fragmens = proof.fragments
      .filter(f => f.start < parsingList.text.length);

    // If there are no fragments then return htmlStr
    if (!size(fragmens)) {
      return [[htmlStr, false, '']];
    }

    let currentHTMLIndex = 0;

    // Handle a prefix
    if (parsingList.first.startHTMLIndex > currentHTMLIndex) {
      accumulator.push([htmlStr.slice(currentHTMLIndex, parsingList.first.startHTMLIndex), false, '']);
      currentHTMLIndex = parsingList.first.startHTMLIndex;
    }

    // Our code 
    for(let listIndex = 0; listIndex < parsingList.length; listIndex++) {
      const listItem = parsingList.items[listIndex];
      
      if (!listItem.length) {
        continue;
      }

      for(let fragIndex = 0; fragIndex < fragmens.length; fragIndex++) {
        const fragment = fragmens[fragIndex];

        if (!listItem.contains(fragment)) {
          accumulator.push( htmlStr.slice(currentHTMLIndex, listItem.endHTMLIndex), false, '');
          currentHTMLIndex = listItem.endHTMLIndex;
        } else {
          const prevFragEnd = fragmens[fragIndex - 1] ? fragmens[fragIndex - 1].end : 0;
          const prefixLength = Math.max(0, (fragment.start - listItem.startTextIndex - prevFragEnd));
          if (prefixLength > 0) {
            accumulator.push([htmlStr.slice(listItem.startHTMLIndex + prevFragEnd, listItem.startHTMLIndex + prevFragEnd + prefixLength), false, ''])
          }

          const fragmentLength = fragment.end - fragment.start;
          if (currentHTMLIndex < listItem.startHTMLIndex) {
            accumulator.push([htmlStr.slice(currentHTMLIndex, listItem.startHTMLIndex), false, '']);
          }

        
          accumulator.push([htmlStr.slice(listItem.startHTMLIndex + prefixLength + prevFragEnd, listItem.startHTMLIndex + prefixLength + prevFragEnd + fragmentLength), true, fragment.hint.id])
          currentHTMLIndex = listItem.startHTMLIndex + prefixLength + fragmentLength;

          if (fragment === last(fragmens)) {
            const suffixLength = Math.max(0, listItem.endTextIndex - fragment.end);

            if (suffixLength > 0) {
              accumulator.push([htmlStr.slice(listItem.startHTMLIndex + prefixLength + fragmentLength, listItem.startHTMLIndex + prefixLength + fragmentLength + suffixLength), false, ''])
            }
          }
        }
      }
    }

    if (parsingList.last.endHTMLIndex < htmlStr.length) {
      accumulator.push([htmlStr.slice(parsingList.last.endHTMLIndex), false, '']);
    }

    return accumulator;
  }

  highlight(particle: TParticle) {
    if (!particle[0]) {
      return '';
    }

    return `<span style="color: rgb(243, 121, 52);" class="glavred__error-${particle[2]}">${particle[0]}</span>`;
  }

  cleanHTML(htmlStr: string = '') {
    return htmlStr.replace(/<span class="glavred__error-.+?>(.+?)<\/span>/g, (str, match) => match);
  }

  hasError(particle: TParticle) {
    return particle[1];
  }

  getText(particle: TParticle) {
    return particle[0]
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

  private isOK(response: TStatus) {
    return response.status === GlavredStatusEnum.OK;
  }

  get glvrd() {
    return window && window['glvrd'];
  }

  getStatus() {
    return new Promise((res, rej) => {
      this.glvrd.getStatus((response: TStatus) => 
        this.isOK(response) ? res(response) : rej(response)
      )
    })
  }

  proofread(text: string = ''): Promise<IProof> {
    return new Promise((res, rej) => {
      this.glvrd.proofread(text, (proof: IProof) => {
        this.isOK(proof) ? res(proof) : rej(proof);
      });
    })
  }

  abortProofreading() {
    this.glvrd.abortProofreading();
  }
}
