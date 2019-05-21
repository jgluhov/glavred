import Glavred from './glavred';
import * as helpers from './helpers';
import 'mocha';
import * as sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

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
        return expect(glavred.proof(''))
          .to.eventually.equal('');
      })
    });

    describe('without html tags', () => {
      describe('when there is a single error', () => {
        it('should return correct html', () => {
          sinon.stub(glavred, 'proofread').resolves(helpers.createProof([0, 3]));

          return expect(glavred.proof('!!!'))
            .to.eventually.equal('<em class="hint hint--highlighted">!!!</em>');
        });
      })

      describe('when there are multiple', () => {
        it('should return correct html', () => {
          sinon.stub(glavred, 'proofread').resolves(helpers.createProof([0, 3], [8, 11]));
          return expect(glavred.proof('!!!mamba!!!'))
            .to.eventually.equal(`<em class="hint hint--highlighted">!!!</em>mamba<em class="hint hint--highlighted">!!!</em>`);
        });
      })
    })

    describe('with html tags', () => {
      describe('when there is a single error', () => {
        it('should return correct html', () => {
          sinon.stub(glavred, 'proofread').resolves(helpers.createProof([3, 6]));

          return expect(glavred.proof('<p>!!!</p>'))
            .to.eventually.equal('<p><em class="hint hint--highlighted">!!!</em></p>');
        });
      })

      describe('when there are multiple', () => {
        it('should return correct html', () => {
          sinon.stub(glavred, 'proofread').resolves(helpers.createProof([0, 3], [21, 24]));
          return expect(glavred.proof('!!!<span>mamba</span>!!!<img src="http://some.jpeg" />'))
            .to.eventually.equal(`<em class="hint hint--highlighted">!!!</em><span>mamba</span><em class="hint hint--highlighted">!!!</em><img src="http://some.jpeg" />`);
        });
      })
    })
  });

  describe('parseHTML()', () => {
    describe('when there is no fragment', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('!!!', [])).to.deep.equal([['!!!', false]]);
      })
    });
    describe('when there is a single fragment', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('!!!', [helpers.createFragment(0, 3)]))
          .to.deep.equal([['!!!', true]]);
      })
    });
    describe('when there is a single fragment', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('!!!', [
          helpers.createFragment(0, 1)
        ]))
          .to.deep.equal([['!', true], ['!!', false]]);
      })
    });
    describe('when there are several fragments', () => {
      it('should return correct result', () => {

        expect(glavred.parseHTML('!!!mamba!!!', [
          helpers.createFragment(0, 3),
          helpers.createFragment(8, 11)
        ]))
          .to.deep.equal([['!!!', true], ['mamba', false], ['!!!', true]]);
      })
    });
    xdescribe('when there are several fragments 2', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('!!!ma!!!a!!!', [
          helpers.createFragment(0, 3),
          helpers.createFragment(5, 8),
          helpers.createFragment(9, 12)
        ]))
        .to.deep.equal([['!!!', true], ['ma', false], ['!!!', true], ['a', false], ['!!!', true]]);
      })
    });
    describe('when there is no text', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('', [
          helpers.createFragment(0, 3)
        ]))
          .to.deep.equal([]);
      })
    });
  })

  describe('highlight()', () => {
    describe('when pass empty string', () => {
      it('should return correct wrapped text', () => {
        expect(glavred.highlight(''))
          .to.equal('<em class="hint hint--highlighted"></em>')
      });
    });

    describe('when pass some string', () => {
      it('should return correct wrapped text', () => {
        expect(glavred.highlight('some'))
          .to.equal('<em class="hint hint--highlighted">some</em>')
      });
    });
  });

})