/**
 * 用户模型
 */
const app = getApp();
const util = require('../../utils/util.js');

import { Base } from '../../utils/base.js';


class User extends Base {
  constructor() {
    super();
    this.addressUrl = app.globalData.url + '';
  }
  // 保存用户地址
  saveAddress() {

  }
  /**
   * 
   */
  getAddress() {
    return false;
  }
}

export { User };