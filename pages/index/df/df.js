const app = getApp();
const util = require('../../../utils/util.js');

import { Df } from 'df-model';
var df = new Df();

Page({
  data: {
    apartmentList: {},
    buildList: {},
    floorList: {},
    roomList: {},
    currentApart: {},
    currentBuild: {},
    currentFloor: {},
    currentRoom: {},
    currentDate: {
      year: '',
      month: ''
    },
    energyQuery: '',
    surplusQuery: ''
  },
  onResultTap: function () {
    var roomID = this.data.currentRoom.dormid;
    var time = this.data.currentDate.year + '-' + this.data.currentDate.month;
    wx.navigateTo({
      url: 'result/result?roomID=' + roomID + '&time=' + time
    });
  },

  
  setQuery(query, queryType) {
    if (queryType == 'energyQuery') {
      this.setData({
        energyQuery: query
      });
      this.getDf('surplusQuery');
      return;
    } else if ((queryType == 'surplusQuery') && (this.data.surplusQuery == "")) {
      this.setData({
        surplusQuery: query
      })
    }
    this.openSuccess();
  },
  getDf: function (e) {
    var roomID = this.data.currentRoom.dormid;
    var time = this.data.currentDate.year + '-' + this.data.currentDate.month;
    df.getBillsPerDay(roomID, time, (daysBills) => {
      console.log(daysBills);
    });
  },
  bindDateChange: function (e) {
    console.log(e);
    var date = new Date(e.detail.value);
    this.setData({
      currentDate: {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    });
  },
  bindApartmentChange: function (e) {
    this.setData({
      currentApart: this.data.apartmentList[e.detail.value]
    })
    this.getRoomList(this.data.apartmentList[e.detail.value].dormid, 'build');

  },
  bindBuildChange: function (e) {
    this.setData({
      currentBuild: this.data.buildList[e.detail.value]
    });
    this.getRoomList(this.data.buildList[e.detail.value].dormid, 'floor');
  },
  bindFloorChange: function (e) {
    this.setData({
      currentFloor: this.data.floorList[e.detail.value]
    });
    this.getRoomList(this.data.floorList[e.detail.value].dormid, 'room');
  },
  bindRoomChange: function (e) {
    this.setData({
      currentRoom: this.data.roomList[e.detail.value]
    });
  },
  setRoomList: function (roomList, addressType) {
    if (addressType == 'apartment') {
      this.setData({
        apartmentList: roomList,
        currentApart: roomList[0]
      });
      this.getRoomList(this.data.currentApart.dormid, 'build');
    } else if (addressType == 'build') {
      this.setData({
        buildList: roomList,
        currentBuild: roomList[0]
      });
      this.getRoomList(this.data.currentBuild.dormid, 'floor');
    } else if (addressType == 'floor') {
      this.setData({
        floorList: roomList,
        currentFloor: roomList[0]
      });
      this.getRoomList(this.data.currentFloor.dormid, 'room');
    } else if (addressType == 'room') {
      if (roomList == '') {
        return;
      }
      this.setData({
        roomList: roomList,
        currentRoom: roomList[0]
      });
    }
  },
  getRoomList: function (priDormId, addressType) {
    var that = this;
    var url_str = app.globalData.url + '/api/get_rooms';
    var params = {};
    params.priDormId = priDormId;
    util.requestQuery(url_str, params, 'GET', function (res) {
      that.setRoomList(res.data.data, addressType);
      wx.hideLoading();
      return true;
    }, function (res) {
      console.log('---------Failed--------');
    }, function (res) {
      console.log('---------Complete--------')
    });
  },

  onLoad: function (options) {


    wx.showLoading({
      title: '正在加载'
    });
    var priDormId = '';
    this.getRoomList(priDormId, 'apartment');
    var currentDate = new Date;

    this.setData({
      currentDate: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1
      }
    })
  },


})