const app = getApp();
const util = require('../../../utils/util.js');

import { Base } from '../../../utils/base.js';

class Df extends Base {
  constructor() {
    super();
    this.billsUrl = app.globalData.url + '/api/get_energy_query';
  }
  /**
   * 获取每小时电费
   */
  getBillsPerHours(roomID, time, callback) {
    var userInfo = wx.getStorageSync('stuUserInfo');
    var params = {
      userId: userInfo.cardcode,
      Room: roomID,
      Time: time,
      QueryType: 'surplusQuery'
    };
    util.requestQuery(this.billsUrl, params, 'GET', function (res) {
      var data = res.data.data;
      callback && callback(data);
    })
  }
  /**
   * 获取 每天 电费
   */
  getBillsPerDay(roomID, time, callback) {
    var userInfo = wx.getStorageSync('stuUserInfo');
    var params = {
      userId: userInfo.cardcode,
      Room: roomID,
      Time: time,
      QueryType: 'energyQuery'
    };
    util.requestQuery(this.billsUrl, params, 'GET', function (res) {
      var data = res.data.data.consumer_records;
      callback && callback(data);
    })
  }
}

export { Df };
