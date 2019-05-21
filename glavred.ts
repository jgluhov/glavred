import { IProof, TStatus } from './glavred.interface';

export enum GlavredStatusEnum {
  OK = 'ok',
  ERROR = 'error'
}

export default class Glavred {
  public getStatus() {
    return new Promise((res, rej) => {
      this.glvrd.getStatus((response: TStatus) => 
        this.isOK(response) ? res(response) : rej(response)
      )
    })
  }

  public proofread(text: string = '') {
    return new Promise((res, rej) => {
      this.glvrd.proofread(text, (proof: IProof) => {
        this.isOK(proof) ? res(proof) : rej(proof);
      });
    })
  }

  isOK(response: TStatus) {
    return response.status === GlavredStatusEnum.OK;
  }

  get glvrd() {
    return window && window['glvrd'];
  }
}
