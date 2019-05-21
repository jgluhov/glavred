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

    const splits = this.splitText(text, proof.fragments);

    if (!splits.length) {
      return text;
    }

    if (splits.length === 1) {

    }

    for (let i = 0; i < splits.length; i += 2) {
    }
    
    return '';
  }

  wrapText(text: string = '') {
    return `<em class="hint hint--highlighted">${text}</em>`;
  }

  splitText(text: string, fragments: IProofFragment[]) {
    if (!size(fragments)) {
      return [text];
    }

    let currentIndex = 0;
    return fragments
      .reduce(
        (acc, fragment, index, array) => {
        
          if (fragments[index].start > currentIndex) {
            acc.push(text.slice(currentIndex, fragment.start));
          }

          acc.push(text.slice(fragment.start, fragment.end));

          currentIndex = fragment.end;

          if (last(array) === fragment && last(array).end < size(text)) {
            acc.push(text.slice(fragment.end));
          }

          return acc;
        },
        []
      )
      .filter((s) => s);
  }

  private isOK(response: TStatus) {
    return response.status === GlavredStatusEnum.OK;
  }

  get glvrd() {
    return window && window['glvrd'];
  }
}
