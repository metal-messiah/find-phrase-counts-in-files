const readline = require('readline');

/**
 * @class
 * @classdesc Handles creating readstreams of input files and returning phrase counts
 * @param {f} FileInput
 * @param {opts} CommanderOptions
 * @returns {Promise<{file: String, phrases: {phrase: String, count: Number}[]}[]>} A promise which resolves to an array of Phrase Count objects
 */
class PhraseParser {
  constructor(f, opts) {
    return new Promise((resolve, reject) => {
      if (!f || !f.file || !f.readStream || !opts) reject(new Error('Invalid Parameters'));
      this.file = f.file;
      this.hanging = [];
      this.lineReader = readline.createInterface(f.readStream);
      this.opts = opts;
      this.phrases = {};
      this.resolver = resolve;
      this.rejecter = reject;

      this.start();
    });
  }

  cleanWords(str) {
    try {
      return str
        .toLowerCase()
        .replace(/[\n-]/g, ' ')
        .replace(/[.,\/#!$%?'\^&\*;:{}=\_`~()]/g, '')
        .replace(/\s{2,}/g, ' ');
    } catch (err) {
      this.rejecter(err);
    }
  }

  getPhrases() {
    try {
      return {
        file: this.file,
        phrases: Object.entries(this.phrases)
          .sort(([key1, val1], [key2, val2]) => val2 - val1)
          .slice(0, this.opts.limit)
          .map(([key, val]) => ({ phrase: key, count: val })),
      };
    } catch (err) {
      this.rejecter(err);
    }
  }

  handleChunk(line) {
    try {
      this.parsePhrases(this.cleanWords(line));
    } catch (err) {
      this.rejecter(err);
    }
  }

  parsePhrases(str) {
    try {
      // split the string chunk into indiv words in an array
      // prepend the hanging words from the previous chunk
      const words = [
        ...this.hanging.splice(0, this.opts.words),
        ...str
          .split(' ')
          .map(this.cleanWords)
          .filter(x => x),
      ];
      // use sliding window over words to add to dict;
      for (let i = 0; i < words.length; i++) {
        if (i > words.length - this.opts.words) {
          this.hanging.push(words[i]);
        } else {
          const phrase = words.slice(i, i + this.opts.words).join(' ');
          this.phrases[phrase] = this.phrases[phrase] ? this.phrases[phrase] + 1 : 1;
        }
      }
    } catch (err) {
      this.rejecter(err);
    }
  }

  start() {
    try {
      this.lineReader.on('line', line => this.handleChunk(line));
      this.lineReader.on('close', () => {
        this.resolver(this.getPhrases());
      });
    } catch (err) {
      this.rejecter(err);
    }
  }
}

module.exports = PhraseParser;
