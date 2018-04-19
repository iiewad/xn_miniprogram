const app = getApp();
const util = require('../../../utils/util.js');

import { Room } from '../../../utils/room.js';
// import { User } from '../../me/user-model.js';
var room = new Room();
// var user = new User();


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
    indexList: [],


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
    room.getUserRoomData((indexList) => {
      // 已绑定数据
      if (indexList && indexList.length > 0) {
        this.setData({
          indexList: indexList
        });
        this._loadData(true);
      } else {
        this._loadData();
      }
    });

  },
  _loadData(setted) {
    room.getApartments((apartments) => {
      this.setData({
        apartmentList: apartments
      });
      // 绑定了宿舍或传了宿舍数据
      if (setted) {
        let nextIndex = this.data.indexList[0];
        this.setApartments(nextIndex, true);
      } else {
        this.setApartments(0);
      }
    });
  },
  onUserInfosTap() {
    // 构造indexList
    let indexList = [];
    indexList.push(
      this.data.aIndex, this.data.bIndex, this.data.fIndex
    );
    (this.data.roomList.length > 0) && indexList.push(this.data.rIndex);
    (this.data.fiveList.length > 0) && indexList.push(this.data.fiveIndex)
    wx.navigateTo({
      url: '/pages/me/infos/infos?indexList=' + indexList
      + '&from=df',
    })
  },
  onResultTap: function () {
    let dataObj = this.getRoomNameAndID();
    var time = this.data.currentDate.year + '-' + this.data.currentDate.month;
    wx.navigateTo({
      url: 'result/result?roomID=' + dataObj.finalDormid
      + '&time=' + time + '&roomName=' + dataObj.completeRoomName
    });
  },
  /**
   * 构造完整宿舍名;获取最终dormid
   */
  getRoomNameAndID() {
    let completeRoomName, dormid;
    let apartmentList = this.data.apartmentList;
    let buildList = this.data.buildList;
    let floorList = this.data.floorList;
    let roomList = this.data.roomList;
    let fiveList = this.data.fiveList;
    let currentFloor = floorList[this.data.fIndex];
    completeRoomName = apartmentList[this.data.aIndex].dormname
      + buildList[this.data.bIndex].dormname
      + currentFloor.dormname;
    dormid = currentFloor.dormid;
    if (roomList.length > 0) {
      let currentRoom = roomList[this.data.rIndex];
      completeRoomName += currentRoom.dormname;
      dormid = currentRoom.dormid;
    }
    if (fiveList.length > 0) {
      let currentFive = fiveList[this.data.fiveIndex];
      completeRoomName += currentFive.dormname;
      dormid = currentFive.dormid;
    }
    return {
      completeRoomName: completeRoomName,
      finalDormid: dormid
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
  setApartments(index, setted) {
    var id = this.data.apartmentList[index].dormid;
    room.getCompleteRoomDataList(id, index, (roomDataList) => {
      this.setData({
        buildList: roomDataList.build,
        aIndex: index
      });
      setted ? this.setBuild(this.data.indexList[1], true) :
        this.setBuild(0);
    });
  },
  setBuild(index, setted) {
    this.setData({
      floorList: this.data.buildList[index].floor,
      bIndex: index
    });
    setted ? this.setFloor(this.data.indexList[2], true) :
      this.setFloor(0);
  },
  setFloor(index, setted) {
    let roomList = this.data.floorList[index].room;
    this.setData({
      roomList: roomList,
      fIndex: index
    });
    let rIndex = this.data.indexList[3];
    if (setted && rIndex) {
      console.log(rIndex);
      this.setRoom(rIndex, true);
    } else {
      this.setRoom(0);
    }
  },
  setRoom(index, setted) {
    let currentRoom = this.data.roomList[index];
    let fiveList;
    if (currentRoom) {
      fiveList = currentRoom.next_room;
    } else {
      fiveList = [];
    }
    this.setData({
      rIndex: index,
      fiveList: fiveList
    });
    let fiveIndex = this.data.indexList[4];
    if (setted && fiveIndex) {
      this.setFive(fiveIndex);
    } else {
      this.setFive(0);
    }
  },
  setFive(index) {
    this.setData({
      fiveIndex: index
    });
  },
  changeApartment(e) {
    this.setApartments(room.getPickerValue(e));
  },
  changeBuild(e) {
    this.setBuild(room.getPickerValue(e));
  },
  changeFloor(e) {
    this.setFloor(room.getPickerValue(e));
  },
  changeRoom(e) {
    this.setRoom(room.getPickerValue(e));
  },
  changeFive(e) {
    this.setFive(room.getPickerValue(e));
  },
})