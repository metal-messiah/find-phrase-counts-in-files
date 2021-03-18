const fs = require('fs');
const path = require('path');
/**
 * Evaluates arguments and returns an array of Custom File Input Objects
 * @param {opts} CommanderOptions
 * @returns {{file: String, readStream: ReadableStream}[]} FileInput
 */
function getFileQueue(opts) {
  console.log(opts);
  return !!opts.files && opts.files.length
    ? opts.files.map(f => ({ file: f, readStream: fs.createReadStream(path.resolve(process.cwd(), f), { encoding: 'utf-8' }) }))
    : [{ file: 'stdin', readStream: process.stdin }];
}

module.exports = { getFileQueue };
