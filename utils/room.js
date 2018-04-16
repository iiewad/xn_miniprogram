/**
 * 宿舍模型
 */

const app = getApp();
const util = require('util.js');

import { Base } from 'base.js';

class Room extends Base {
  constructor() {
    super();
    this.roomUrl = app.globalData.url + '/api/get_rooms';
    this.completeRoomDataListUrl = app.globalData.url + '/api/get-room-list';
    this.submitUrl = app.globalData.url + '';
  }
  /**
   * 新增/更新 当前用户宿舍数据
   */
  submitAddress() {
    
  }
  /**
   * 获取公寓
   */
  getApartments(callback) {
    var apartments = wx.getStorageSync('apartments');
    if (!apartments) {
      var params = {};
      util.requestQuery(this.roomUrl, params, 'GET', (res) => {
        var apartments = res.data.data;
        wx.setStorageSync('apartments', apartments);
        callback && callback(apartments);
      });
    } else {
      callback && callback(apartments);
    }

  }
  /**
   * 获取指定公寓下所有宿舍数据
   * aID：公寓的
   * index:在缓存数组中的索引
   */
  getCompleteRoomDataList(aID, index, callback) {
    var roomDataListAll = wx.getStorageSync('roomDataList');
    var roomDataList = roomDataListAll[index];
    if (!roomDataList) {
      var params = {
        priDormId: aID
      };
      util.requestQuery(this.completeRoomDataListUrl, params, 'GET', (res) => {
        console.log(index);
        var roomDataList = res.data.data.apartment;
        roomDataListAll[index] = roomDataList;
        wx.setStorageSync('roomDataList', roomDataListAll);
        // 缓存
        callback && callback(roomDataList);
      });
    } else {
      callback && callback(roomDataList);
    }
  }

}

export { Room };

