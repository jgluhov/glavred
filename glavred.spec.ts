import Glavred, { ParsingList, ParsingListItem } from './glavred';
import * as helpers from './helpers';
import 'mocha';
import * as sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { TParsingList, IProof } from './glavred.interface';

describe('Glavred', () => {
  let glavred: Glavred;
  let sandbox: sinon.SinonSandbox;

  before(() => {
    chai.use(chaiAsPromised);
  });

  beforeEach(() => {
    glavred = new Glavred();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('proof()', () => {
    xdescribe('when there is no text', () => {
      it('should return correct result', () => {
        sinon.stub(glavred, 'proofread').resolves(helpers.createProof());
        return expect(glavred.proof(''))
          .to.eventually.equal('');
      })
    });

  //   describe('without html tags', () => {
  //     describe('when there is a single error', () => {
  //       it('should return correct html', () => {
  //         const proof = helpers.createProof([0, 3]);
  //         sinon.stub(glavred, 'proofread').resolves(proof);



  //         return expect(glavred.proof('!!!'))
  //           .to.eventually.equal(`<span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 0)}">!!!</span>`);
  //       });
  //     })

  //     describe('when there are multiple', () => {
  //       it('should return correct html', () => {
  //         const proof = helpers.createProof([0, 3], [8, 11]);

  //         sinon.stub(glavred, 'proofread').resolves(proof);
  //         return expect(glavred.proof('!!!mamba!!!'))
  //           .to.eventually.equal(`<span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 0)}">!!!</span>mamba<span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 1)}">!!!</span>`);
  //       });
  //     })
  //   })

  //   describe('with html tags', () => {
  //     describe('when there is a single error', () => {
  //       it('should return correct html', () => {
  //         const proof = helpers.createProof([3, 6]);
  //         sinon.stub(glavred, 'proofread').resolves(proof);

  //         return expect(glavred.proof('<p>!!!</p>'))
  //           .to.eventually.equal(`<p><span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 0)}">!!!</span></p>`);
  //       });
  //     })

  //     describe('when there are multiple', () => {
  //       it('should return correct html', () => {
  //         const proof = helpers.createProof([0, 3], [21, 24]);

  //         sinon.stub(glavred, 'proofread').resolves(proof);
          
  //         return expect(glavred.proof('!!!<span>mamba</span>!!!<img src="http://some.jpeg" />'))
  //           .to.eventually.equal(`<span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 0)}">!!!</span><span>mamba</span><span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 1)}">!!!</span><img src="http://some.jpeg" />`);
  //       });
  //     })
  //   })
  });

  describe('parseHTML()', () => {
    describe('when there is only text', () => {
      it('should return correct result', () => {
        console.log(JSON.stringify(glavred.parseHTML('!!!')))
        console.log(JSON.stringify({
          text: '!!!',
          items: [ new ParsingListItem([0, 3, 0])]
        }))
        expect(glavred.parseHTML('!!!')).to.deep.equal(
          new ParsingList('!!!', [ new ParsingListItem([0, 3, 0])])
        );
      });
    });

    describe('when there is an empty tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p></p>')).to.deep.equal(
          new ParsingList('', [])
        );
      });
    });

    describe('when there are several empty tags', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p></p><div></div>')).to.deep.equal(new ParsingList('', []));
      });
    });

    describe('when there is some text between tags', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p></p>some<div></div>')).to.deep.equal(
          new ParsingList('some', [new ParsingListItem([7, 4, 0])])
        );
      });
    });

    describe('when there is a list', () => {
      describe('when there is a single item', () => {
        it('should return correct result', () => {
          expect(glavred.parseHTML('<ul><li>content</li></ul>')).to.deep.equal(
            new ParsingList('content', [new ParsingListItem([8, 7, 0])])
          );
        });
      })

      describe('when there are several items', () => {
        it('should return correct result', () => {
          expect(glavred.parseHTML('<ul><li>content1</li><li>content2</li></ul>')).to.deep.equal(
            new ParsingList('content1content2', [
              new ParsingListItem([8, 8, 0]),
              new ParsingListItem([25, 8, 8])
            ])
          );
        });
      });
    });

    describe('when there is some text after the last tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p></p>some')).to.deep.equal(
          new ParsingList('some', [
            new ParsingListItem([7, 4, 0]),
          ])
        );
      });
    });

    describe('when there is some text before the first tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('some<p></p>')).to.deep.equal(
          new ParsingList('some', [
            new ParsingListItem([0, 4, 0]),
          ])
        );
      });
    });

    describe('when there is an internal tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p>some<b>bold</b>some</p>')).to.deep.equal(
          new ParsingList('someboldsome', [
            new ParsingListItem([3, 4, 0]),
            new ParsingListItem([10, 4, 4]),
            new ParsingListItem([18, 4, 8])
          ])
        );
      });
    });

    describe('when there is a single tag', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p>Hello World</p>')).to.deep.equal(
          new ParsingList('Hello World', [
            new ParsingListItem([3, 11, 0]),
          ])
        );
      });
    });

    describe('when there are several tags', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('<p>Hello World.</p><p>Who are you ?</p>')).to.deep.equal(
          new ParsingList('Hello World.Who are you ?', [
            new ParsingListItem([3, 12, 0]),
            new ParsingListItem([22, 13, 12])
          ])
        );
      });
    })
  });

  describe('applyProof()', () => {
    let proof: IProof;
    let htmlStr: string;
    let parsingList: ParsingList;

    describe('when fragments indexes go beyond boundaries', () => {
      it('should return correct particles', () => {
        proof = helpers.createProof([300, 500]);
        parsingList = new ParsingList('!!!', [new ParsingListItem([])]);
        expect(glavred.applyProof('!!!', parsingList, proof)).to.deep.equal([['!!!', false, '']]);
      });
    })

    describe('when there are no html tags', () => {
      describe('when there is no errors', () => {
        it('should return correct result', () => {
          proof = helpers.createProof();
          parsingList = new ParsingList('!!!', [
            new ParsingListItem([0, 3, 0])
          ]);
          expect(glavred.applyProof('!!!', parsingList, proof)).to.deep.equal([['!!!', false, '']]);
        })
      });

      describe('when there is a error', () => {
        it('should return correct result', () => {
          htmlStr = 'mamba!!!mamba';
          proof = helpers.createProof([5, 8]);
          parsingList = new ParsingList(htmlStr, [
            new ParsingListItem([0, 13, 0])
          ]);
  
          expect(glavred.applyProof(htmlStr, parsingList, proof))
            .to.deep.equal([
              ['mamba', false, ''],
              ['!!!', true, helpers.getHintIdInProof(proof, 0)],
              ['mamba', false, '']
            ]);
        })
      });
      describe('when there is a single fragment', () => {
        it('should return correct result', () => {
          htmlStr = '!!!';
          proof = helpers.createProof([0, 1]);
          parsingList = new ParsingList(htmlStr, [
            new ParsingListItem([0, 3, 0])
          ]);

          expect(glavred.applyProof(htmlStr, parsingList, proof))
            .to.deep.equal([
              ['!', true, helpers.getHintIdInProof(proof, 0)],
              ['!!', false, '']
            ]);
        })
      });
      describe('when there are several fragments', () => {
        it('should return correct result', () => {
          htmlStr = '!!!mamba!!!';
          proof = helpers.createProof([0, 3], [8, 11]);
          parsingList = new ParsingList(htmlStr, [
            new ParsingListItem([0, 11, 0])
          ]);
          expect(glavred.applyProof(htmlStr, parsingList, proof))
            .to.deep.equal([
              ['!!!', true, helpers.getHintIdInProof(proof, 0)],
              ['mamba', false, ''],
              ['!!!', true, helpers.getHintIdInProof(proof, 1)]
            ]);
        })
      });
      describe('when there are several fragments 2', () => {
        it('should return correct result', () => {
          htmlStr = '!!!ma!!!a!!!';
          proof = helpers.createProof([0, 3], [5, 8], [9, 12]);
          parsingList = new ParsingList(htmlStr, [
            new ParsingListItem([0, 12, 0])
          ]);

          expect(glavred.applyProof(htmlStr, parsingList, proof))
            .to.deep.equal([
              ['!!!', true, helpers.getHintIdInProof(proof, 0)],
              ['ma', false, ''],
              ['!!!', true, helpers.getHintIdInProof(proof, 1)],
              ['a', false, ''],
              ['!!!', true, helpers.getHintIdInProof(proof, 2)]
            ]);
        })
      });
      describe('when there is no text', () => {
        it('should return correct result', () => {
          htmlStr = '';
          proof = helpers.createProof();
          parsingList = new ParsingList(htmlStr, [
            new ParsingListItem([0, 12, 0])
          ]);

          expect(glavred.applyProof(htmlStr, parsingList, proof))
            .to.deep.equal([]);
        })
      });
    });

    describe('when there are html tags', () => {
      describe('when there is no text between tags', () => {
        it('should return correct particles', () => {
          htmlStr = '<p></p>';
          proof = helpers.createProof();
          parsingList = new ParsingList('', [
            new ParsingListItem([])
          ]);
          
          expect(glavred.applyProof(htmlStr, parsingList, proof)).to.deep.equal([['<p></p>', false, '']]);
        });
      })

      describe('when there is a text between tags', () => {
        it('should return correct particles', () => {
          htmlStr = '<p>!!!</p>'
          proof = helpers.createProof([0, 3]);
          parsingList = new ParsingList('!!!', [
            new ParsingListItem([3, 3, 0])
          ]);

          expect(glavred.applyProof(htmlStr, parsingList, proof))
            .to.deep.equal([
              ['<p>', false, ''],
              ['!!!', true, helpers.getHintIdInProof(proof, 0)],
              ['</p>', false, ''],
            ]);
        });
      })
    });
  })

  describe('contains()', () => {
    describe('when list item is empty', () => {
      it('should not be contained', () => {
        const listItem = new ParsingListItem([0, 0, 0]);
        expect(listItem.contains(helpers.createFragment(0, 3))).to.equal(false);
      })
    })

    describe('when list item is full', () => {
      it('should be contained', () => {
        const listItem = new ParsingListItem([0, 7, 0]);
        expect(listItem.contains(helpers.createFragment(4, 7))).to.equal(true);
      })
    })

    describe('when list item is full', () => {
      it('should be contained', () => {
        const listItem = new ParsingListItem([4, 3, 4]);
        expect(listItem.contains(helpers.createFragment(0, 12))).to.equal(true);
      })
    })
  });

  describe('highlight()', () => {
    describe('when pass empty string', () => {
      it('should return correct wrapped text', () => {
        expect(glavred.highlight(['', true, '']))
          .to.equal('')
      });
    });

    describe('when pass some string', () => {
      it('should return correct wrapped text', () => {
        expect(glavred.highlight(['some', true, 'hint']))
          .to.equal('<span style="color: rgb(243, 121, 52);" class="glavred__error-hint">some</span>')
      });
    });
  });
  
  describe('cleanHTML', () => {
    let htmlStr;
    let expectedHtmlStr;

    describe('when pass incorrect param', () => {
      it('should return empty string', () => {
        expect(glavred.cleanHTML('')).to.equal('');
      });
    });

    describe('when pass a string without html tags', () => {
      it('should return exactly the same string', () => {
        htmlStr = 'Hello World!';
        expect(glavred.cleanHTML(htmlStr)).to.equal(htmlStr);
      });
    })

    describe('when pass a string with an html tag', () => {
      it('should return correct html string', () => {
        htmlStr = '<p>Hello World!</p>';
        expect(glavred.cleanHTML(htmlStr)).to.equal(htmlStr);
      });
    })

    describe('when pass a string with errors', () => {
      it('should return correct html string', () => {
        htmlStr = 'Hello<span class="glavred__error-c0bcfe14b7bd9" style="color: rgb(243, 121, 52);">World!</span>';
        expectedHtmlStr = 'HelloWorld!'
        expect(glavred.cleanHTML(htmlStr)).to.equal(expectedHtmlStr);
      });
    })

    describe('when pass a string several errors', () => {
      it('should return correct html string', () => {
        htmlStr = 'Hello<span class="glavred__error-c0bcfe14b7bd9" style="color: rgb(243, 121, 52);">World!</span><p>some</p><span class="glavred__error-c0bcfe14b7bd9" style="color: rgb(243, 121, 52);">World!</span><b></b>';
        expectedHtmlStr = 'HelloWorld!<p>some</p>World!<b></b>'
        expect(glavred.cleanHTML(htmlStr)).to.equal(expectedHtmlStr);
      });
    })

    describe('when pass a string several errors', () => {
      it('should return correct html string', () => {
        htmlStr = 'Hello<span class="glavred__error-c0bcfe14b7bd9" style="color: rgb(243, 121, 52);">World!<span>some</span></span><p>some</p><span class="glavred__error-c0bcfe14b7bd9" style="color: rgb(243, 121, 52);">World!</span><b></b>';
        expectedHtmlStr = 'HelloWorld!<span>some</span><p>some</p>World!<b></b>'
        expect(glavred.cleanHTML(htmlStr)).to.equal(expectedHtmlStr);
      });
    })
  })
})