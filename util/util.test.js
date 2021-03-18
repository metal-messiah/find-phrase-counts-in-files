const utils = require('./util');

describe('util', () => {
  it('getFileQueue should determine correct queue', () => {
    const fileTypeOptions = { files: ['some-file.txt'] };
    const fileTypeQueue = utils.getFileQueue(fileTypeOptions);
    expect(fileTypeQueue[0].file).toEqual('some-file.txt');
    expect(fileTypeQueue[0].readStream).toBeTruthy();

    const stdinTypeQueue = utils.getFileQueue({});
    expect(stdinTypeQueue[0].file).toEqual('stdin');
    expect(stdinTypeQueue[0].readStream).toBeTruthy();
  });
});
