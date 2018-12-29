/*
 * Cucumber-js profiles.
 */

// Rerun option.
const fs = require('fs');
const rerunFile = '@rerun.txt';
let rerunOption = '';
if (fs.existsSync(rerunFile) && fs.statSync(rerunFile).size > 0) {
  // Activate rerun.
  rerunOption = rerunFile;
}
module.exports = {
  watch: `--format rerun:${rerunFile} ${rerunOption}`,
};
