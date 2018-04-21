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
    this.submitUrl = app.globalData.url + '/api/bind-room';
  }
  /**
   * 获取绑定的用户宿舍数据
   */
  getSettedData(callback, dormidList, num) {
    let params = {};
    let dataObj = {
      list: [],
      index: 0,
      num: num
    };
    let list = [];
    params.priDormId = dormidList[0];
    dormidList.shift(); // 去掉首个后，同层
    util.requestQuery(this.roomUrl, params, 'GET', (res) => {
      list = res.data.data;
      // 获得的数据是下一组的
      if (list && list.length > 0) {
        dataObj.list = list;
        for (let i in list) {
          if (list[i].dormid == dormidList[0]) {
            dataObj.index = i;
            break;
          }
        }
        callback && callback(dataObj);
        this.getSettedData(callback, dormidList, ++num);
      } else {
        callback && callback(dataObj);
      }
    });
  }
  /**
   * 递归获取 宿舍数据，
   * 如 传入 公寓id，获取公寓所有层，楼栋/楼层、房间号 第一层(稍后试写指定层)数据，
   * 传 楼栋id，可获楼层所有和楼层第一个元素下所有房间号，房间号第一个元素下所有
   * 
   * @params
   *  dormid
   * 
   */
  getRoomData(callback, dormid, num) {
    let params = {};
    let obj = {
      list: [],
      num: num
    };
    let list = [];
    let selectedItem = {};
    if (dormid) {
      params.priDormId = dormid;
    }
    util.requestQuery(this.roomUrl, params, 'GET', (res) => {
      list = res.data.data;
      if (list && list.length > 0) {
        selectedItem = list[0];
        obj.list = list;
        callback && callback(obj);
        this.getRoomData(callback, selectedItem.dormid, ++num);
      } else {
        callback && callback(obj);
      }
    });
  }
  /**
   * 获取用户宿舍数据 
   * indexList
   */
  getUserRoomData(callback) {
    let userInfo = wx.getStorageSync('stuUserInfo');
    let dormidList = this.toDormidListFormat(userInfo.dorm);
    callback && callback(dormidList);
  }
  /**
   * 保存用户地址
   */
  saveAddress(dormidList, callback) {
    let params = this.toServerFormat(dormidList);
    let userInfo = wx.getStorageSync('stuUserInfo');
    params.cardcode = userInfo.cardcode;
    util.requestQuery(this.submitUrl, params, 'POST', (res) => {
      // 把数组保存到缓存
      let data = res.data.data;
      userInfo.dorm = data;
      wx.setStorageSync('stuUserInfo', userInfo);
      callback && callback();
    });
  }
  /**
   * dormidList 转为服务器 格式
   */
  toServerFormat(dormidList) {
    let data = {};
    let keyArr = [
      'apartment_id', 'build_direction_id',
      'build_id', 'floor_id', 'room_id'
    ];
    for (let i in keyArr) {
      if (dormidList[i]) {
        data[keyArr[i]] = dormidList[i];
      } else {
        data[keyArr[i]] = '';
      }
    }
    return data;
  }
  /**
   * 服务器格式 转为 dormidList 格式
   */
  toDormidListFormat(data) {
    let dormidList = [];
    for (var i in data) {
      data[i] && dormidList.push(data[i]);
    }
    return dormidList;
  }
}

export { Room };

