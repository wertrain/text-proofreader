// @see https://www.npmjs.com/package/commander
const program = require('commander');
program
  .option('-t, --text <content>', 'proofreading text')
  .option('-f, --file <filepath>', 'proofreading text of file');
program.parse(process.argv);

const textlint = require("textlint");
const textLineEngine = new textlint.TextLintEngine({
  configFile: '.textlintrc'
});

if (program.text) {
  textLineEngine.executeOnText(program.text, '.txt').then(results => {
    process.stdout.write(JSON.stringify(results[0].messages));
  }, error => {
    process.stdout.write("textlint error occurred." + error);
  });
} else if (program.file) {
  const fs = require("fs-extra");
  fs.readFile(program.file, "utf-8", (err, data) => {
    textLineEngine.executeOnText(data, '.txt').then(results => {
      process.stdout.write(JSON.stringify(results[0].messages));
    }, error => {
      process.stdout.write("textlint error occurred." + error);
    });
  });
}
