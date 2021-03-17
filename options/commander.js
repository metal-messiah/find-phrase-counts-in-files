const commander = require('commander');

commander.option('-f, --files <files...>', 'Paths to the input file(s), space separated');
commander.option('--no-console', 'Do not output results to the console');
commander.option('-o, --output <output>', 'Specify path to save output to file', './output/output.json');
commander.option('--no-output', 'Do not output results to a file');
commander.option('-w, --words <words>', 'The number of words in each phrase', 3);

const opts = commander.parse(process.argv).opts();
opts.words = Number(opts.words);

module.exports = opts;
