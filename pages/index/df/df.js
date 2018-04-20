const app = getApp();
const util = require('../../../utils/util.js');

import { Room } from '../../../utils/room.js';
var room = new Room();

Page({
  data: {
    // 宿舍数据
    apartmentList: [],
    buildList: [],
    floorList: [],
    roomList: [],
    fiveList: [],
    aIndex: 0,
    bIndex: 0,
    fIndex: 0,
    rIndex: 0,
    fiveIndex: 0,
    currentDate: {
      year: '',
      month: ''
    },
  },
  onLoad: function (options) {
    var currentDate = new Date;
    this.setData({
      currentDate: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1
      }
    })
    room.getUserRoomData((dormidList) => {
      if (dormidList && dormidList.length > 0) {
        this._loadDataNew(dormidList);
      } else {
        this.initNew();
      }
    });
  },
  _loadDataNew(dormidList) {
    dormidList.unshift('');
    room.getSettedData((list, indexList) => {
      this.setListData(list, indexList, 5);
    }, dormidList);
  },
  initNew() {
    let item = '';
    let num = 5;
    let indexList = [];
    for (let i = 0; i < num; i++) {
      indexList[i] = 0;
    }
    this.getRoomData(item, indexList, num);
  },
  /**
  * 获取 数据
  */
  getRoomData(item, indexList, num) {
    let dormid = '';
    if (item) {
      dormid = item.dormid;
    }
    room.getRoomData((list) => {
      console.log(list);
      this.setListData(list, indexList, num);
    }, dormid);
  },
  /**
   * 绑定数据
   */
  setListData(list, indexList, num) {
    let listKeyArr = [
      'apartmentList', 'buildList', 'floorList',
      'roomList', 'fiveList'
    ];
    let indexKeyArr = [
      'aIndex', 'bIndex', 'fIndex', 'rIndex', 'fiveIndex'
    ];
    let cut = 5 - num;
    for (let i = 1; i <= cut; i++) {
      listKeyArr.shift();
    }
    for (let i = 2; i <= cut; i++) {
      indexKeyArr.shift();
    }
    for (let i in listKeyArr) {
      let bindList = {};
      if (list[i] && list[i].length > 0) {
        bindList[listKeyArr[i]] = list[i];
      } else {
        bindList[listKeyArr[i]] = [];
      }
      this.setData(bindList);
    }
    for (let i in indexKeyArr) {
      let bindIndex = {};
      if (indexList[i] && indexList[i].length > 0) {
        bindIndex[indexKeyArr[i]] = indexList[i];
      } else {
        bindIndex[indexKeyArr[i]] = 0;
      }
      this.setData(bindIndex);
    }
  },
  preSetList(index, num) {
    let listKeyArr = [
      'apartmentList', 'buildList', 'floorList',
      'roomList', 'fiveList'
    ];
    let item = this.data[listKeyArr[4 - num]][index];
    let indexList = [];
    indexList[0] = index;
    for (let i = 1; i < num; i++) {
      indexList[i] = 0;
    }
    this.getRoomData(item, indexList, num);
  },
  changeApartment(e) {
    this.preSetList(room.getPickerValue(e), 4);
  },
  changeBuild(e) {
    this.preSetList(room.getPickerValue(e), 3);
  },
  changeFloor(e) {
    this.preSetList(room.getPickerValue(e), 2);
  },
  changeRoom(e) {
    this.preSetList(room.getPickerValue(e), 1);
  },
  changeFive(e) {
    this.preSetList(room.getPickerValue(e), 0);
  },
  /**
   * 跳转 查询结果页
   */
  onResultTap() {
    let dataObj = this.getDataToSearch();
    let time = this.data.currentDate.year + '-' + this.data.currentDate.month;
    wx.navigateTo({
      url: 'result/result?dormidList=' + dataObj.dormidList
      + '&time=' + time + '&roomName=' + dataObj.roomName
    });
  },
  getDataToSearch() {
    let roomName, dormidList = [];
    let apartmentList = this.data.apartmentList;
    let buildList = this.data.buildList;
    let floorList = this.data.floorList;
    let roomList = this.data.roomList;
    let fiveList = this.data.fiveList;
    let cApartment = apartmentList[this.data.aIndex];
    let cBuild = buildList[this.data.bIndex];
    let cFloor = floorList[this.data.fIndex];
    roomName = cApartment.dormname
      + cBuild.dormname
      + cFloor.dormname;
    dormidList.push(
      cApartment.dormid,
      cBuild.dormid,
      cFloor.dormid
    );
    if (roomList && roomList.length > 0) {
      roomName += roomList[this.data.rIndex].dormname;
      dormidList.push(roomList[this.data.rIndex].dormid);
    }
    if (fiveList && fiveList.length > 0) {
      roomName += fiveList[this.data.fiveIndex].dormname;
      dormidList.push(fiveList[this.data.fiveIndex].dormid);
    }
    return {
      roomName: roomName,
      dormidList: dormidList
    };
  },

  bindDateChange: function (e) {
    var date = new Date(e.detail.value);
    this.setData({
      currentDate: {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    });
  },

  // onUserInfosTap() {
  //   // 构造indexList
  //   let indexList = [];
  //   indexList.push(
  //     this.data.aIndex, this.data.bIndex, this.data.fIndex
  //   );
  //   (this.data.roomList.length > 0) && indexList.push(this.data.rIndex);
  //   (this.data.fiveList.length > 0) && indexList.push(this.data.fiveIndex)
  //   wx.navigateTo({
  //     url: '/pages/me/infos/infos?indexList=' + indexList
  //     + '&from=df',
  //   })
  // },



})