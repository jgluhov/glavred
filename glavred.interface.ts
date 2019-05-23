import { ParsingListItem } from "./glavred";

export type TStatus = {
  status: string;
}
export type TSuccessStatus = TStatus;
export type TErrorStatus = TStatus & {
  code: string;
  message: string;
}

export interface IProofFragmentHint {
  id: string;
  description: string;
  name: string;
  penalty: number;
  weight: number;
}
export interface IProofFragment {
  start: number;
  end: number;
  hint: IProofFragmentHint;
  url: string;
}

export interface IProof extends TStatus {
  fragments: IProofFragment[];
  score: string;
}

export interface IParsedElement {
  data?: string;
  type: string;
  next: IParsedElement;
  prev: IParsedElement;
  parent: IParsedElement;
  name: string;
  children?: IParsedElement[];
}

export type TParsingList = {
  text: string;
  list: ParsingListItem[];
};

export type TParticle = Array<string | boolean>;
