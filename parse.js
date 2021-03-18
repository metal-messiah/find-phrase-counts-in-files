const fs = require('fs');
const commander = require('./options/commander');
const PhraseParser = require('./classes/PhraseParser');
const util = require('./util/util');

/**
 * Queues files from process.args or stdin to be parsed
 * @returns {void}
 */
async function parse(args) {
  return new Promise(async (resolve, reject) => {
    try {
      const opts = commander(args);
      // determine file queue from arguments
      const files = util.getFileQueue(opts);
      // return an array of promises from PhraseParser class and wait for resolution
      const phraseCounts = await Promise.all(
        files.map(f => {
          return new PhraseParser(f, opts);
        })
      );
      // write the output of the promises to a file or the console
      const writeStream = fs.createWriteStream(opts.output, { encoding: 'utf-8' });
      // phraseCounts.forEach(count => {
      if (opts.console) {
        phraseCounts.forEach(count => {
          console.log(count);
          console.log('-------------------');
        });
      }
      if (opts.output) writeStream.write(JSON.stringify(phraseCounts));
      resolve(phraseCounts);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = parse;
