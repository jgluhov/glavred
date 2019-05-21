import Glavred from './temporary';
import { expect } from 'chai';
import 'mocha';

describe('Glavred', () => {
  let glavred: Glavred;

  beforeEach(() => {
    glavred = new Glavred();
  });

  describe('parseHTML()', () => {
    describe('when there is an empty tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p></p>')).to.deep.equal({
          text: '',
          parsedHTML: []
        });
      });
    });

    describe('when there are several empty tags', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p></p><div></div>')).to.deep.equal({
          text: '',
          parsedHTML: []
        });
      });
    });

    describe('when there is some text between tags', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p></p>some<div></div>')).to.deep.equal({
          text: 'some',
          parsedHTML: [[7, 4, 0]]
        });
      });
    });

    describe('when there is a list', () => {
      describe('when there is a single item', () => {
        it('should return correct result', () => {
          expect(glavred.parseHTML('<ul><li>content</li></ul>')).to.deep.equal({
            text: 'content',
            parsedHTML: [[8, 7, 0]]
          });
        });
      })

      describe('when there are several items', () => {
        it('should return correct result', () => {
          expect(glavred.parseHTML('<ul><li>content1</li><li>content2</li></ul>')).to.deep.equal({
            text: 'content1content2',
            parsedHTML: [[8, 8, 0], [25, 8, 8]]
          });
        });
      });
    });

    describe('when there is some text after the last tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p></p>some')).to.deep.equal({
          text: 'some',
          parsedHTML: [[7, 4, 0]]
        });
      });
    });

    describe('when there is some text before the first tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('some<p></p>')).to.deep.equal({
          text: 'some',
          parsedHTML: [[0, 4, 0]]
        });
      });
    });

    describe('when there is an internal tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p>some<b>bold</b>some</p>')).to.deep.equal({
          text: 'someboldsome',
          parsedHTML: [[3, 4, 0], [10, 4, 4], [18, 4, 8]]
        });
      });
    });

    describe('when there is a single tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p>Hello World</p>')).to.deep.equal({
          text: 'Hello World',
          parsedHTML: [[3, 11, 0]]
        });
      });
    });

    describe('when there are several tags', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p>Hello World.</p><p>Who are you ?</p>')).to.deep.equal({
          text: 'Hello World.Who are you ?',
          parsedHTML: [[3, 12, 0], [22, 13, 12]]
        });
      });
    })
  });
})