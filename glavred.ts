
import htmlParser from 'htmlparser2';

type TParsedDOM = number[][];

export interface IGlavred {
  parseDOM: (htmlStr: string) => TParsedDOM;
}

export default function glavred() {

  const parseDOM = (htmlStr: string = '') => {
    console.log(htmlParser.parseDOM(htmlStr));
    // const parser = new htmlParser.parseDOM(null, {decodeEntities: true});

    return [];
  }

  return {
    parseDOM
  };
}
