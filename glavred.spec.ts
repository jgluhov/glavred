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
    beforeEach(() => {
      sinon.stub(glavred, 'proofread')
        .resolves(helpers.createProof(0, 3));
    });

    describe('when there is no text', () => {
      it('should return correct result', () => {
        return expect(glavred.proof(''))
          .to.eventually.equal('');
      })
    });

    xdescribe('without html tags', () => {
      describe('when there is a single error', () => {
        it('should return correct html', () => {
          return expect(glavred.proof('!!!'))
            .to.eventually.equal('<em class="hint hint--highlighted">!!!</em>');
        });
      })
    })
  });

  describe('splitText()', () => {
    describe('when there is no fragment', () => {
      it('should return correct result', () => {
        expect(glavred.splitText('!!!', [])).to.deep.equal(['!!!']);
      })
    });
    describe('when there is a single fragment', () => {
      it('should return correct result', () => {
        expect(glavred.splitText('!!!', [helpers.createFragment(0, 3)]))
          .to.deep.equal(['!!!']);
      })
    });
    describe('when there is a single fragment', () => {
      it('should return correct result', () => {
        expect(glavred.splitText('!!!', [
          helpers.createFragment(0, 1)
        ]))
          .to.deep.equal(['!', '!!']);
      })
    });
    describe('when there are several fragments', () => {
      it('should return correct result', () => {

        expect(glavred.splitText('!!!mamba!!!', [
          helpers.createFragment(0, 3),
          helpers.createFragment(8, 11)
        ]))
          .to.deep.equal(['!!!', 'mamba', '!!!']);
      })
    });
    describe('when there are several fragments 2', () => {
      it('should return correct result', () => {
        expect(glavred.splitText('!!!ma!!!a!!!', [
          helpers.createFragment(0, 3),
          helpers.createFragment(5, 8),
          helpers.createFragment(9, 12)
        ]))
        .to.deep.equal(['!!!', 'ma', '!!!', 'a', '!!!']);
      })
    });
    describe('when there is no text', () => {
      it('should return correct result', () => {
        expect(glavred.splitText('', [
          helpers.createFragment(0, 3)
        ]))
          .to.deep.equal([]);
      })
    });
  })

  describe('wrapText()', () => {
    describe('when pass empty string', () => {
      it('should return correct wrapped text', () => {
        expect(glavred.wrapText(''))
          .to.equal('<em class="hint hint--highlighted"></em>')
      });
    });

    describe('when pass some string', () => {
      it('should return correct wrapped text', () => {
        expect(glavred.wrapText('some'))
          .to.equal('<em class="hint hint--highlighted">some</em>')
      });
    });
  });

})