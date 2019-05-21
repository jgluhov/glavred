import { IProof, TStatus, IProofFragment } from './glavred.interface';
import { size, last, first } from 'lodash';

export enum GlavredStatusEnum {
  OK = 'ok',
  ERROR = 'error'
}

export default class Glavred {
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

  async proof(text: string): Promise<string> {
    const proof = await this.proofread(text);

    const particles = this.parseHTML(text, proof.fragments);

    if (!size(particles)) {
      return text;
    }

    const proofedHTML = particles
      .map(particle => {
        return particle[1] ? this.highlight(particle[0]) : particle[0];
      })
      .join('');
    
    return proofedHTML;
  }

  highlight(text: string = '') {
    return `<em class="hint hint--highlighted">${text}</em>`;
  }

  parseHTML(htmlStr: string, fragments: IProofFragment[]) {
    if (!htmlStr) {
      return [];
    }

    if (!size(fragments)) {
      return [[htmlStr, false]];
    }

    let currentIndex = 0;
    let parsing = [];

    for(let index = 0; index < fragments.length; index++) {
      const fragment = fragments[index];

      if (fragment.start > currentIndex) {
        parsing.push([ htmlStr.slice(currentIndex, fragment.start), false ]);
      }

      parsing.push([ htmlStr.slice(fragment.start, fragment.end), true ]);

      currentIndex = fragment.end;

      if (last(fragments) === fragment && last(fragments).end < size(htmlStr)) {
        parsing.push([ htmlStr.slice(fragment.end), false ]);
      }
    }

    return parsing;
  }

  private isOK(response: TStatus) {
    return response.status === GlavredStatusEnum.OK;
  }

  get glvrd() {
    return window && window['glvrd'];
  }
}
