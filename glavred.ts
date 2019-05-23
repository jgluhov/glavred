import {
  IProof,
  TStatus,
  TParticle,
  IParsedElement,
  TParsedHTMLResult
} from './glavred.interface';
import { size, last } from 'lodash';
import htmlParser from 'htmlparser2';

export enum GlavredStatusEnum {
  OK = 'ok',
  ERROR = 'error'
}

export default class Glavred {
  parseHTML(htmlStr: string = ''): TParsedHTMLResult {
    let htmlIndex: number = 0;
    let textIndex: number = 0;

    const parsing = {
      text: '',
      result: []
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
      
      parsing.text += text;
      
      parsing.result.push([htmlIndex, text.length, textIndex]);
      textIndex += text.length;
      htmlIndex += text.length + this.getTagSize(parsedEl, false);
    }

    const parsedElements: IParsedElement[]  = htmlParser.parseDOM(htmlStr);
    parsedElements.forEach(parseFn)

    return parsing;
  }  

  async proof(htmlStr: string): Promise<string> {
    const parsing = this.parseHTML(htmlStr);

    const proof = await this.proofread(parsing.text);

    const particles = this.applyProof(htmlStr, proof);

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

  applyProof(htmlStr: string, proof: IProof) {
    if (!htmlStr) {
      return [];
    }

    if (!size(proof.fragments)) {
      return [[htmlStr, false, '']];
    }

    let currentIndex = 0;
    let accumulator = [];

    for(let index = 0; index < proof.fragments.length; index++) {
      const fragment = proof.fragments[index];

      if (fragment.start > currentIndex) {
        accumulator.push([ htmlStr.slice(currentIndex, fragment.start), false, '' ]);
      }

      accumulator.push([ htmlStr.slice(fragment.start, fragment.end), true, fragment.hint.id ]);

      currentIndex = fragment.end;

      if (last(proof.fragments) === fragment && last(proof.fragments).end < size(htmlStr)) {
        accumulator.push([ htmlStr.slice(fragment.end), false, '' ]);
      }
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
