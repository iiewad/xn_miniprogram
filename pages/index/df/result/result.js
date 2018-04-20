import { Df } from '../df-model';
var df = new Df();

import { Room } from '../../../../utils/room.js';
var room = new Room();


Page({
  data: {
    daysBills: {},
    hoursBillsObj: {},
    warningHidden: 1,
    tabs: ['每日电费', '小时电费'],
    currentTabsIndex: 0,
    dormidList: [],
    roomName: '',
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    });
    // 要传查询宿舍数据
    let roomName = options.roomName;
    let dormidList = options.dormidList.split(',');
    this.setData({
      dormidList: dormidList,
      roomName: roomName
    });
    let lastDormid = dormidList[dormidList.length - 1];
    let time = options.time;
    df.getBillsPerDay(lastDormid, time, (daysBills) => {
      this.setData({
        daysBills: daysBills
      });
    });
    df.getBillsPerHours(lastDormid, time, (hoursBillsObj) => {
      this.setData({
        hoursBillsObj: hoursBillsObj
      });
      // 提醒电费不足
      if (parseInt(hoursBillsObj.current_balance) < 10) {
        this.setData({
          warningHidden: 0
        });
      }
      wx.hideLoading();
    });
  },
  onTapsItemTap(e) {
    var index = df.getDataSet(e, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },
  /**
   * 绑定查询宿舍为用户宿舍
   */
  bindAddress() {
    room.saveAddress(this.data.dormidList, () => {
      wx.showToast({
        title: '绑定成功',
      })
    });
  }
})