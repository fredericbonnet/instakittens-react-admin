/// <reference path="./steps.d.ts" />

class World {
  /**
   * Constructor.
   */
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
}

module.exports = World;
