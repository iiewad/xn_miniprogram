const app = getApp();
const util = require('util.js');

class Base {
  getPickerValue(e) {
    return e.detail.value;
  }
  getDataSet(e, key) {
    return e.currentTarget.dataset[key];
  }
}

export { Base };