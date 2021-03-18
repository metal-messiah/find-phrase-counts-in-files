# New Relic - PhraseParser

PhraseParser is a JavaScript library which counts phrases by variable length in large sets of text

## Installation

Running this project depends on having [NODE.JS](https://nodejs.org/en/download/) installed locally. We recommend using [NPM](https://www.npmjs.com/get-npm) or [YARN](https://classic.yarnpkg.com/en/docs/install) to install dependencies. To do this, run:

```bash
npm install
```

```bash
yarn install
```

## Usage

This project can utilize the following command line argument flags to control the output

- -f , --files: `Paths (space delimited for multiple)`
- -l , --limit: `Limits the number of rows in the output`
  - Default: 100
- -o , --output: `Specify path to save output to file`
  - Default: `./output/output.json`
- -w , --words: `The number of words in each phrase`
  - Default: 3
- --no-console: `Prevents logging of output to console`
- --no-output: `Prevents the output result from being saved to a file`

```bash
node index.js --files ./mockdata/moby_dick.txt ./mockdata/random.txt --limit 50 --words 5 --no-console
```

You can also pipe an input file on stdin:

```bash
cat ./mockdata/moby_dick.txt | node index.js --limit 50 --words 5 --no-console"
```

## Testing

```bash
npm run test
```

```bash
yarn test
```

## Extra features outside of exercise

- Parses a variable number of words per phrase (default 3)
- Can control output length (default 100)
- Can output to file or to console

## What I'd work on with more time

- Improve the interface for supplying files
- Improve the output by specifying multiple output files
- Potentially run workers in children processes
- Containerize
- Test coverage reporting
- More robust testing, including more mock files, null/sad path testing
- Better way to mock control of commander argv handler

## Known bugs

- Output count is slightly off from instructions sample file (moby_dick.txt)
  - This could be due to parsing inconsistencies, file inconsistencies, or many other factors.

## Final Takeaways from the Project

I enjoyed working on this project, had to get creative in some places to make it flow, and found it fun to work on something different than my typical workload.
