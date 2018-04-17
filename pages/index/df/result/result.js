import { Df } from '../df-model';
var df = new Df();

Page({
  data: {
    daysBills: {},
    hoursBillsObj: {},
    warningHidden: 1,
    tabs: ['每日电费', '小时电费'],
    currentTabsIndex: 0,
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    });
    // 要传查询宿舍数据
    var roomID = options.roomID;
    var time = options.time;
    df.getBillsPerDay(roomID, time, (daysBills) => {
      this.setData({
        daysBills: daysBills
      });
    });
    df.getBillsPerHours(roomID, time, (hoursBillsObj) => {
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
  }
})