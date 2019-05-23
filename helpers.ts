import crypto from 'crypto';
import { IProof, IProofFragment } from './glavred.interface';

export const generateId = () => {
  return crypto.randomBytes(16).toString("hex");
}

export const getHintIdInProof = (proof: IProof, index: number) => {
  return proof.fragments[index].hint.id;
}

export const getHintIdInFragment = (fragments: IProofFragment[], index: number) => {
  return fragments[index].hint.id;
}

export const createFragment = (start: number = 0, end: number = 0) => {
  return {
    end,
    hint: {
      id: generateId(),
      description: 'Лучше не использовать более одного восклицательного знака. Чем больше восклицаний — тем слабее эффект. ',
      name: 'Многократное восклицание',
      penalty: 0,
      weight: 150
    },
    start,
    url: ''
  }
}

export const createProof = (...ranges: number[][]) => {
  return {
    fragments: ranges.map(range => createFragment(range[0], range[1])),
    score: '1.2',
    status: 'ok'
  };
}