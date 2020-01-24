/*
 * Cucumber world setup.
 */
const { setWorldConstructor } = require('cucumber');

const { setInputValue, clearInput } = require('../../e2e/utils');

// Selectors
const fieldSel = '.ra-field';
const inputSel = '.ra-input';

class World {
  constructor({ attach, parameters }) {
    this.attach = attach;
    this.parameters = parameters;

    // Variable map used below.
    this.variables = {};
  }

  /*
   * Variable management.
   */

  /** Get variable value */
  getVariable(name) {
    return this.variables[name];
  }

  /** Set variable value */
  setVariable(name, value) {
    this.variables[name] = value;
  }

  /*
   * Nested resources.
   */

  /**
   * Set parent resource.
   *
   * @param key Key in child resources holding the parent ID
   * @param value Parent resource info
   * @param value.id Parent resource ID
   * @param value.data Parent resource data
   * @param value.url Parent root URL
   */
  setParent(key, value) {
    this.parent = { key, value };
  }

  /** Get parent root URL */
  getRoot() {
    return this.parent ? this.parent.value.url : '';
  }

  /** Get parent resource data */
  getParentData() {
    const data = {};
    if (this.parent) {
      data[this.parent.key] = this.parent.value.id;
    }
    return data;
  }

  /*
   * Show/Edit page utilities.
   */

  /** Read data from Show pages */
  async readShowData() {
    const data = await this.page.$$eval(fieldSel, fields => {
      const data = {};
      for (let field of fields) {
        const labelEl = field.querySelector('label');
        if (!labelEl) continue;
        const label = labelEl.textContent;
        const value = field.querySelector('label + *').textContent;
        if (value && value !== 'Invalid Date') data[label] = value; // FIXME date fields may have a transient error message when null
      }
      return data;
    });
    return data;
  }

  /** Read links from Show pages */
  async readShowLinks() {
    const links = await this.page.$$eval(fieldSel, fields => {
      const links = {};
      for (let field of fields) {
        const labelEl = field.querySelector('label');
        if (!labelEl) continue;
        const link = field.querySelector('a');
        if (link) {
          const label = labelEl.textContent;
          const value = field.querySelector('label + *').textContent;
          const url = link.getAttribute('href');
          links[label] = { value, url };
        }
      }
      return links;
    });
    return links;
  }

  /**
   * Write data to Edit pages
   *
   * @param data Data to write
   * @param replace Replace flag: if true, clear all inputs
   */
  async writeEditData(data, replace) {
    const fields = await this.page.$$(inputSel);
    for (let field of fields) {
      const labelEl = await field.$('label');
      if (!labelEl) continue;
      const label = await (await labelEl.getProperty(
        'textContent'
      )).jsonValue();
      if (label && label !== 'Id' && (replace || data[label])) {
        const input = await field.$('input');
        if ((await input.getProperty('value')) !== data[label]) {
          if (data[label]) {
            // Set value.
            await setInputValue(input, data[label]);
          } else {
            // Clear value.
            if ((await input.getProperty('type')) === 'datetime-local') {
              // Date inputs need special treatment because of validation and
              // input masks that prevent text selection. So we just set the
              // value to an invalid, nonempty string.
              await setInputValue(input, 'x');
            } else {
              await clearInput(input);
              await input.press('Escape');
            }
          }
        }
      }
    }
  }
}

setWorldConstructor(World);
