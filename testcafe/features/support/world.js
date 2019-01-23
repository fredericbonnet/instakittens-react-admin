/*
 * Cucumber world setup.
 */
const { setWorldConstructor, Before } = require('cucumber');
const { TestCafeWorld } = require('./testcafe-world');

// Selectors
const fieldSel = '.ra-field';
const inputSel = '.ra-input';

/**
 * Cucumber world object.
 */
class World extends TestCafeWorld {
  /**
   * Constructor.
   *
   * @param {Object} options Standard options passed to parent
   */
  constructor(options) {
    super(options);

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
    // Note: using eval is much faster than iterating on Selector with .count
    // and .nth
    const data = await this.eval(
      () => {
        const data = {};
        for (let field of document.querySelectorAll(fieldSel)) {
          const labelEl = field.querySelector('label');
          if (!labelEl) continue;
          const label = labelEl.textContent;
          const value = field.querySelector('label + *').textContent;
          if (value && value !== 'Invalid Date') data[label] = value; // FIXME date fields may have a transient error message when null
        }
        return data;
      },
      { dependencies: { fieldSel } }
    );
    return data;
  }

  /** Read links from Show pages */
  async readShowLinks() {
    // Note: using eval is much faster than iterating on Selector with .count
    // and .nth
    const links = await this.eval(
      () => {
        const links = {};
        for (let field of document.querySelectorAll(fieldSel)) {
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
      },
      { dependencies: { fieldSel } }
    );
    return links;
  }

  /**
   * Write data to Edit pages
   *
   * @param data Data to write
   * @param replace Replace flag: if true, clear all inputs
   */
  async writeEditData(data, replace) {
    const sel = this.Selector(inputSel);
    const count = await sel.count;
    for (let i = 0; i < count; i++) {
      const field = sel.nth(i);
      const labelEl = field.find('label');
      if (!(await labelEl.exists)) continue;
      const label = await labelEl.textContent;
      if (label && label !== 'Id' && (replace || data[label])) {
        const input = field.find('input');
        if ((await input.attributes)['value'] !== data[label]) {
          if (data[label]) {
            // Set value.
            await this.t.typeText(input, data[label], {
              replace: true,
              paste: true,
            });
          } else {
            // Clear value.
            if ((await input.attributes)['type'] === 'datetime-local') {
              // Date inputs need special treatment because of validation and
              // input masks that prevent text selection. So we just set the
              // value to an invalid, nonempty string.
              await this.t.typeText(input, 'x', {
                replace: true,
                paste: true,
              });
            } else {
              await this.t.selectText(input).pressKey('delete esc');
            }
          }
        }
      }
    }
  }
}

setWorldConstructor(World);

Before(async function() {
  // Resetting the location before each test avoids side effects, e.g. transient
  // windows still active between scenarios.
  await this.t.navigateTo('about:blank');
});
