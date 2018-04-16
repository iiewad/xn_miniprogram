const app = getApp();
const util = require('util.js');

class Base{
  getPickerValue(e){
    return e.detail.value;
  }
}

export {Base};