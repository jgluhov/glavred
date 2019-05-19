import glavred, { IGlavred } from './glavred';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import 'mocha';

describe('toDOMTree()', () => {
  let jsDOM: JSDOM;
  let glvrd: IGlavred;
  let parsedTree: HTMLElement;

  beforeEach(() => {
    jsDOM = new JSDOM();
    glvrd = glavred(jsDOM.window);
  });

  describe('when fn has been called with empty string', () => {

    it('should return null', () => {
      expect(glvrd.toDOMTree('')).to.equal(null)
    })

  })

  describe('when fn is called with non empty string', () => {
    
    describe('when there are mistakes in html', () => {
      
      it('should return correct string', () => {
        const parsedTree = glvrd.toDOMTree('<!!div>!!!');
        expect(parsedTree.textContent).to.equal('!!!');
      });

    });

    describe('when there are comments in html', () => {
      
      it('should return empty string', () => {
        const parsedTree = glvrd.toDOMTree('<!--div>!!!');
        expect(parsedTree.textContent).to.equal('');
      });

    })

    describe('when html is ok', () => {

      describe('when a tag is empty', () => {
        
        it('should return correct dom', () => {
          const parsedTree = glvrd.toDOMTree('<div></div>');
          expect(parsedTree.childNodes.length).to.equal(1);
          expect(parsedTree.childNodes[0].textContent).to.equal('');
        });

      });


      
    });
  });
})