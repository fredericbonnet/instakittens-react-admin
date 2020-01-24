/*
 * Expose Chai globally with custom assertions.
 */
const chai = require('chai');
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);
global.expect = chai.expect;
