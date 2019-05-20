import glavred, { IGlavred } from './glavred';
import { expect } from 'chai';
// import { JSDOM } from 'jsdom';
import 'mocha';

describe('Glavred', () => {
  // let jsDOM: JSDOM;
  let glvrd: IGlavred;

  beforeEach(() => {
    // jsDOM = new JSDOM();
    glvrd = glavred();
  });

  describe('parseDOM()', () => {
    it('should return correct result', () => {
      expect(glvrd.parseDOM('<div>Hello World</div>')).to.equal([[3, 11, 0]]);
    });
  });
})