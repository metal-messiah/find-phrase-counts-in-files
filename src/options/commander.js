const commander = require('commander');

const init = (args = process.argv) => {
  // set up definitions for input args
  commander.option('-f, --files <files...>', 'ABSOLUTE Paths to the input file(s), space separated');
  commander.option('-l, --limit <limit>', 'Limits output file to number of rows', 100);
  commander.option('--no-console', 'Do not output results to the console');
  commander.option('-o, --output <output>', 'Specify path to save output to file', './output/output.json');
  commander.option('--no-output', 'Do not output results to a file');
  commander.option('-w, --words <words>', 'The number of words in each phrase', 3);

  const opts = commander.parse(args).opts();

  opts.limit = Number(opts.limit);
  opts.words = Number(opts.words);

  return opts;
};

module.exports = init;
