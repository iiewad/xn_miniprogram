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
   * 获取绑定的用户数据
   */
  getSettedData(callback, dormidList, data = [], indexList = []) {
    let params = {};
    let list = [];
    params.priDormId = dormidList[0];
    dormidList.shift(); // 去掉首个后，同层
    util.requestQuery(this.roomUrl, params, 'GET', (res) => {
      list = res.data.data;
      // 获得的数据是下一组的
      if (list && list.length > 0) {
        for (let i in list) {
          if (list[i].dormid == dormidList[0]) {
            indexList.push(i);
          }
        }
        data.push(list);
        this.getSettedData(callback, dormidList, data, indexList);
      } else {
        callback && callback(data, indexList);
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
  getRoomData(callback, dormid, data = []) {
    let params = {};
    let list = [];
    let selectedItem = {};
    if (dormid) {
      params.priDormId = dormid;
    }
    util.requestQuery(this.roomUrl, params, 'GET', (res) => {
      list = res.data.data;
      if (list && list.length > 0) {
        selectedItem = list[0];
        data.push(list);

        /**
         * 思路：边渲染边从api获取
         * 获取到一个数据，就返回渲染一个
         */


        this.getRoomData(callback, selectedItem.dormid, data);
      } else {
        callback && callback(data);
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















  /*************************************** */
  /**
   * [G1290492858, G1293594334,...] -> [2,1,...]
   * dormidList -> indexList
   */
  setIndexList(dormidList, callback) {
    let indexList = [];
    if (dormidList && dormidList.length == 0) {
      callback && callback(indexList);
      return;
    }
    this.getApartments((apartmentList) => {
      for (let i in apartmentList) {
        let apartment = apartmentList[i];
        if (apartment.dormid == dormidList[0]) {
          indexList.push(i);
          this.getCompleteRoomDataList(apartment.dormid, i,
            (apartmentNext) => {
              dormidList.shift();
              let builds = apartmentNext.build;
              let nextKeyArr = ['floor', 'room', 'next_room'];
              indexList = this.recu(nextKeyArr, dormidList, builds, indexList);
              callback && callback(indexList);
            });
          break;
        }
      }
    });
  }
  /**
   * 递归构造indexList
   * 使用递归理由：处理过程一样，下次调用的参数需由上次返回结果提供
   * @params 
   *  nextKeyArr : 取首元素后删除 ['floor', 'room', 'five']
   *  dormidList: 取首元素后删除 ['G1290492858', 'G1293594334', 'G1293594585']
   *  arr:处理的数据
   *  indexList: 数组尾添加元素 ["1", "1", "1", "2"]
   * @return 
   *  indexList
   */
  recu(nextKeyArr, dormidList, arr, indexList) {
    for (let i in arr) {
      let value = arr[i];
      if (value.dormid == dormidList[0]) {
        indexList.push(i);
        let nextArr = value[nextKeyArr[0]];
        if (nextArr && nextArr.length > 0) { // 不等于空数组
          dormidList.shift();
          nextKeyArr.shift();
          indexList = this.recu(nextKeyArr, dormidList, nextArr, indexList);
        }
        break;
      }
    }
    return indexList;
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
    // 这里必须用let声明，否则报错，未理解
    let roomDataListAll = wx.getStorageSync('roomDataListAll');
    var roomDataList = roomDataListAll[index];
    if (!roomDataList) {
      var params = {
        priDormId: aID
      };
      util.requestQuery(this.completeRoomDataListUrl, params, 'GET', (res) => {
        var roomDataList = res.data.data.apartment;
        console.log(roomDataListAll);
        if (!roomDataListAll) {
          roomDataListAll = [];
        }
        roomDataListAll[index] = roomDataList;
        wx.setStorageSync('roomDataListAll', roomDataListAll);
        callback && callback(roomDataList);
      });
    } else {
      callback && callback(roomDataList);
    }
  }
}

export { Room };

