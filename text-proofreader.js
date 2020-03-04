// @see https://www.npmjs.com/package/commander
const program = require('commander');
program
  .option('-t, --text <content>', 'proofreading text');
program.parse(process.argv);

if (program.text) {
  const textlint = require("textlint");
  const textLineEngine = new textlint.TextLintEngine({
    configFile: '.textlintrc'
  });
  textLineEngine.executeOnText(program.text, '.txt').then(results => {
    process.stdout.write(JSON.stringify(results[0].messages));
  }, error => {
    process.stdout.write("textlint error occurred." + error);
  });
}
