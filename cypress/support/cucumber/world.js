/// <reference types="Cypress" />

// Selectors
const fieldSel = '.ra-field';
const inputSel = '.ra-input';

/**
 * Cypress Cucumber world object.
 */
class World {
  constructor() {
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
  readShowData() {
    let data = {};
    cy.get(fieldSel).each(field => {
      const label = field.find('label').text();
      const value = field.find('label + *').text();
      if (value && value !== 'Invalid Date') data[label] = value; // FIXME date fields may have a transient error message when null
    });
    return data;
  }

  /** Read links from Show pages */
  readShowLinks() {
    let links = {};
    cy.get(fieldSel).each(field => {
      const label = field.find('label').text();
      const value = field.find('label + *').text();
      const url = field.find('a').attr('href');
      if (url) links[label] = { value, url };
    });
    return links;
  }

  /**
   * Write data to Edit pages
   *
   * @param data Data to write
   * @param replace Replace flag: if true, clear all inputs
   */
  writeEditData(data, replace) {
    cy.get(inputSel).each(field => {
      const label = field.find('label').text();
      if (label && label !== 'Id' && (replace || data[label])) {
        const input = field.find('input');
        if (input.val() !== data[label])
          cy.wrap(input)
            .clear()
            .type(data[label] || '{esc}');
      }
    });
  }
}

module.exports = { World };
