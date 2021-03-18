const getBiggestCount = array =>
  array.phrases.reduce((acc, curr) => {
    if (curr.count > acc) return curr.count;
    return acc;
  }, 0);

const testStrings = [
  'It ShOulD HandLE CaPS\n',
  'it. should! handle punct%uation$ and #non ) letters\n',
  'it should handle the line breaks in each\n',
  'It should handle unicode characters(eg. the ü in Süsse or ß in Straße',
];

beforeEach(() => {
  jest.resetModules();
});

describe('E2E -- Files as Input', () => {
  it('should parse from command args', done => {
    const parse = require('./parse');
    const args = [
      '/Users/jpor18/.nvm/versions/node/v10.19.0/bin/node',
      '/Users/jpor18/Documents/code/new-relic/index.js',
      '--files',
      './mockdata/moby_dick.txt',
      './mockdata/random.txt',
    ];
    parse(args).then(phraseCounts => {
      expect(phraseCounts.length).toEqual(2);

      const mobyDick = phraseCounts[0];
      const random = phraseCounts[1];

      expect(mobyDick.phrases[0].phrase).toEqual('the sperm whale');
      expect(random.phrases[0].phrase).toEqual('most common phrases');

      expect(mobyDick.phrases[0].count).toEqual(getBiggestCount(phraseCounts[0]));
      expect(random.phrases[0].count).toEqual(getBiggestCount(phraseCounts[1]));

      done();
    });
  });
});

describe('E2E - stdin as input', () => {
  it('should parse from stdin', done => {
    const parse = require('./parse');
    const stdin = require('mock-stdin').stdin();

    parse().then(phraseCounts => {
      expect(phraseCounts.length).toEqual(1);

      expect(phraseCounts[0].phrases[0].phrase).toEqual('it should handle');

      expect(phraseCounts[0].phrases[0].count).toEqual(getBiggestCount(phraseCounts[0]));

      done();
    });

    stdin.send(testStrings);
    stdin.send(null);
  });
});
