const stream = require('stream');
const PhraseParser = require('./PhraseParser');

let mockedStream;

const baseOpts = {
  files: ['../assets/random.txt', '../assets/moby_dick.txt'],
  limit: 100,
  words: 3,
};

const testStrings = [
  'It ShOulD HandLE CaPS\n',
  'it. should! handle punct%uation$ and #non ) letters\n',
  'it should handle the line breaks in each\n',
  'It should handle unicode characters(eg. the ü in Süsse or ß in Straße',
];

reset = () => {
  mockedStream = new stream.Readable();
  mockedStream._read = function (size) {
    /* do nothing */
  };
};

beforeEach(() => reset());

const basicHappyTest = (output, opts) => {
  expect(output.file).toEqual('mock');
  expect(output.phrases.length).toBeTruthy();
  const wordsPerPhrase = output.phrases.filter(x => x.phrase.split(' ').length === opts.words);
  expect(wordsPerPhrase.length).toEqual(output.phrases.length);
};

const emitData = () => {
  testStrings.forEach(str => {
    mockedStream.emit('data', str);
  });
  mockedStream.emit('end');
};

describe('PhraseParser', () => {
  it('should parse streaming data', done => {
    new PhraseParser({ readStream: mockedStream, file: 'mock' }, baseOpts).then(output => {
      basicHappyTest(output, baseOpts);
      expect(output.phrases[0]).toEqual({ phrase: 'it should handle', count: 4 });
      done();
    });
    emitData();
  });

  test('2 words', done => {
    new PhraseParser({ readStream: mockedStream, file: 'mock' }, { ...baseOpts, words: 2 }).then(output => {
      basicHappyTest(output, { ...baseOpts, words: 2 });
      expect(output.phrases.filter(x => x.count >= 3).length).toEqual(2);
      done();
    });
    emitData();
  });
  test('3 words', done => {
    new PhraseParser({ readStream: mockedStream, file: 'mock' }, { ...baseOpts, words: 3 }).then(output => {
      basicHappyTest(output, { ...baseOpts, words: 3 });
      expect(output.phrases.filter(x => x.count >= 3).length).toEqual(1);
      done();
    });
    emitData();
  });
  test('4 words', done => {
    new PhraseParser({ readStream: mockedStream, file: 'mock' }, { ...baseOpts, words: 4 }).then(output => {
      basicHappyTest(output, { ...baseOpts, words: 4 });
      expect(output.phrases.filter(x => x.count >= 3).length).toEqual(0);
      done();
    });
    emitData();
  });

  test('default limit (100)', done => {
    new PhraseParser({ readStream: mockedStream, file: 'mock' }, baseOpts).then(output => {
      basicHappyTest(output, baseOpts);
      expect(output.phrases.length).toEqual(27);
      done();
    });
    emitData();
  });
  test('limit 3', done => {
    new PhraseParser({ readStream: mockedStream, file: 'mock' }, { ...baseOpts, limit: 3 }).then(output => {
      basicHappyTest(output, { ...baseOpts, limit: 3 });
      expect(output.phrases.length).toEqual(3);
      done();
    });
    emitData();
  });

  test('should throw error with no readstream', done => {
    new PhraseParser({ readStream: null, file: 'mock' }, baseOpts).catch(err => {
      expect(err).toBeTruthy();
      done();
    });
  });
  test('should throw error with no file name', done => {
    new PhraseParser({ readStream: mockedStream, file: null }, baseOpts).catch(err => {
      expect(err).toBeTruthy();
      done();
    });
    emitData();
  });
});
