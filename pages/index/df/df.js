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
    listKeyArr: [
      'apartmentList', 'buildList', 'floorList',
      'roomList', 'fiveList'
    ],
    indexKeyArr: [
      'aIndex', 'bIndex', 'fIndex', 'rIndex', 'fiveIndex'
    ],
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
        // if (0) {
        this._loadDataNew(dormidList);
      } else {
        this.initNew();
      }
    });
  },
  _loadDataNew(dormidList) {
    let num = 0;
    dormidList.unshift('');
    room.getSettedData((dataObj) => {
      this.setOneListData(dataObj.list, dataObj.index, dataObj.num);
    }, dormidList, num);
  },
  initNew() {
    let item = '';
    let num = 0;
    let index = 0;
    this.getRoomData(item, index, num);
  },
  /**
  * 获取 数据
  */
  getRoomData(item, index, num, picker = false) {
    let dormid = '';
    if (item) {
      dormid = item.dormid;
    }
    room.getRoomData((dataObj) => {
      if (dataObj.num != num) {
        index = 0;
      }
      this.setOneListData(dataObj.list, index, dataObj.num, picker);
    }, dormid, num);
  },
  setOneListData(list, index, num, picker = false) {
    let listKeyArr = this.data.listKeyArr;
    let indexKeyArr = this.data.indexKeyArr;
    let bindList = {};
    if (list && list.length > 0) {
      bindList[listKeyArr[num]] = list;
    } else {
      // 清除该层及该层一下的数据
      let length = listKeyArr.length;
      for (let i = num; i <= length; i++) {
        let temp = {};
        temp[listKeyArr[i]] = [];
        this.setData(temp);
      }
    }
    let bindIndex = {};
    if (picker) {
      // picker下，绑定buildlist(1层)和aIndex(0层)
      bindIndex[indexKeyArr[num - 1]] = index;
    } else {
      bindIndex[indexKeyArr[num]] = index;
    }
    this.setData(bindIndex);
    this.setData(bindList);
  },

  preSetList(index, num) {
    let listKeyArr = this.data.listKeyArr;
    // 用公寓dormid（0层），获取build数据(1层)
    let item = this.data[listKeyArr[num - 1]][index];
    this.getRoomData(item, index, num, true);
  },
  changeApartment(e) {
    this.preSetList(room.getPickerValue(e), 1);
  },
  changeBuild(e) {
    this.preSetList(room.getPickerValue(e), 2);
  },
  changeFloor(e) {
    this.preSetList(room.getPickerValue(e), 3);
  },
  changeRoom(e) {
    this.preSetList(room.getPickerValue(e), 4);
  },
  changeFive(e) {
    this.preSetList(room.getPickerValue(e), 5);
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
})