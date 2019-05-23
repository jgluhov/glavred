import { IProof, TStatus, IProofFragment, TParticle } from './glavred.interface';
import { size, last } from 'lodash';

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

  abortProofreading() {
    this.glvrd.abortProofreading();
  }

  async proof(text: string): Promise<string> {
    const proof = await this.proofread(text);

    const particles = this.parseHTML(text, proof.fragments);

    if (!size(particles)) {
      return text;
    }

    const proofedHTML = particles
      .map(particle => {
        return this.hasError(particle) ?
          this.highlight(particle) : this.getText(particle);
      })
      .join('');
    
    return proofedHTML;
  }

  hasError(particle: TParticle) {
    return particle[1];
  }

  getText(particle: TParticle) {
    return particle[0]
  }

  highlight(particle: TParticle) {
    if (!particle[0]) {
      return '';
    }

    return `<span style="color: rgb(243, 121, 52);" class="glavred__error-${particle[2]}">${particle[0]}</span>`;
  }

  parseHTML(htmlStr: string, fragments: IProofFragment[]) {
    if (!htmlStr) {
      return [];
    }

    if (!size(fragments)) {
      return [[htmlStr, false, '']];
    }

    let currentIndex = 0;
    let parsing = [];

    for(let index = 0; index < fragments.length; index++) {
      const fragment = fragments[index];

      if (fragment.start > currentIndex) {
        parsing.push([ htmlStr.slice(currentIndex, fragment.start), false, '' ]);
      }

      parsing.push([ htmlStr.slice(fragment.start, fragment.end), true, fragment.hint.id ]);

      currentIndex = fragment.end;

      if (last(fragments) === fragment && last(fragments).end < size(htmlStr)) {
        parsing.push([ htmlStr.slice(fragment.end), false, '' ]);
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
