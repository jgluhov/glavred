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
    describe('when there is no text', () => {
      it('should return correct result', () => {
        sinon.stub(glavred, 'proofread').resolves(helpers.createProof());
        return expect(glavred.proof(''))
          .to.eventually.equal('');
      })
    });

    describe('without html tags', () => {
      describe('when there is a single error', () => {
        it('should return correct html', () => {
          const proof = helpers.createProof([0, 3]);
          sinon.stub(glavred, 'proofread').resolves(proof);



          return expect(glavred.proof('!!!'))
            .to.eventually.equal(`<span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 0)}">!!!</span>`);
        });
      })

      describe('when there are multiple', () => {
        it('should return correct html', () => {
          const proof = helpers.createProof([0, 3], [8, 11]);

          sinon.stub(glavred, 'proofread').resolves(proof);
          return expect(glavred.proof('!!!mamba!!!'))
            .to.eventually.equal(`<span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 0)}">!!!</span>mamba<span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 1)}">!!!</span>`);
        });
      })
    })

    describe('with html tags', () => {
      describe('when there is a single error', () => {
        it('should return correct html', () => {
          const proof = helpers.createProof([3, 6]);
          sinon.stub(glavred, 'proofread').resolves(proof);

          return expect(glavred.proof('<p>!!!</p>'))
            .to.eventually.equal(`<p><span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 0)}">!!!</span></p>`);
        });
      })

      describe('when there are multiple', () => {
        it('should return correct html', () => {
          const proof = helpers.createProof([0, 3], [21, 24]);

          sinon.stub(glavred, 'proofread').resolves(proof);
          
          return expect(glavred.proof('!!!<span>mamba</span>!!!<img src="http://some.jpeg" />'))
            .to.eventually.equal(`<span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 0)}">!!!</span><span>mamba</span><span style="color: rgb(243, 121, 52);" class="glavred__error-${helpers.getHintIdInProof(proof, 1)}">!!!</span><img src="http://some.jpeg" />`);
        });
      })
    })
  });

  describe('parseHTML()', () => {
    let fragments;

    describe('when there is no fragment', () => {
      it('should return correct result', () => {
        expect(glavred.parseHTML('!!!', [])).to.deep.equal([['!!!', false, '']]);
      })
    });
    describe('when there is a single fragment', () => {
      it('should return correct result', () => {
        fragments = [helpers.createFragment(0, 3)];
        expect(glavred.parseHTML('!!!', fragments))
          .to.deep.equal([['!!!', true, helpers.getHintIdInFragment(fragments, 0)]]);
      })
    });
    describe('when there is a single fragment', () => {
      it('should return correct result', () => {
        fragments = [
          helpers.createFragment(0, 1)
        ];

        expect(glavred.parseHTML('!!!', fragments))
          .to.deep.equal([['!', true, helpers.getHintIdInFragment(fragments, 0)], ['!!', false, '']]);
      })
    });
    describe('when there are several fragments', () => {
      it('should return correct result', () => {
        fragments = [
          helpers.createFragment(0, 3),
          helpers.createFragment(8, 11)
        ];

        expect(glavred.parseHTML('!!!mamba!!!', fragments))
          .to.deep.equal([
            ['!!!', true, helpers.getHintIdInFragment(fragments, 0)],
            ['mamba', false, ''],
            ['!!!', true, helpers.getHintIdInFragment(fragments, 1)]
          ]);
      })
    });
    describe('when there are several fragments 2', () => {
      it('should return correct result', () => {
        fragments = [
          helpers.createFragment(0, 3),
          helpers.createFragment(5, 8),
          helpers.createFragment(9, 12)
        ];

        expect(glavred.parseHTML('!!!ma!!!a!!!', fragments))
        .to.deep.equal([
          ['!!!', true, helpers.getHintIdInFragment(fragments, 0)],
          ['ma', false, ''],
          ['!!!', true, helpers.getHintIdInFragment(fragments, 1)],
          ['a', false, ''],
          ['!!!', true, helpers.getHintIdInFragment(fragments, 2)]
        ]);
      })
    });
    xdescribe('when there is no text', () => {
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

})