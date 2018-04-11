// pages/index/index.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    menuItems: [
      {
        name: '成绩查询',
        imagePath: '../../images/menu-grade.png',
        funcName: 'cj',
        funcStatus: true
      },
      {
        name: '电费查询',
        imagePath: '../../images/menu-energy-charge.png',
        funcName: 'df',
        funcStatus: true
      },
      {
        name: '课表查询',
        imagePath: '../../images/menu-class-schedule.png',
        funcName: 'kb',
        funcStatus: true
      },
      {
        name: '借阅信息',
        imagePath: '../../images/menu-borrow-books.png',
        funcName: 'jy',
        funcStatus: true
      },
      {
        name: '一卡通',
        imagePath: '../../images/menu-card.png',
        funcName: 'ykt',
        funcStatus: true
      },
      {
        name: '图书查询',
        imagePath: '../../images/menu-book.png',
        funcName: 'ts',
        funcStatus: false
      },
      {
        name: '损坏保修',
        imagePath: '../../images/menu-maintain.png',
        funcName: 'bx',
        funcStatus: false
      },
      {
        name: '空教室',
        imagePath: '../../images/menu-classroom.png',
        funcName: 'js',
        funcStatus: false
      }
    ],
    funcItems: [
      '1'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    loginFlag: false,
    funcEnabled: false,
    // 今天课表
    currentTerm: {},
    todayTable: [],
    loadingHidden: 0
  },
  tapFuncDisable: function () {
    console.log('未绑定用户信息')
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'stuUserInfo',
      success: function (res) {
        that.setData({
          loginFlag: true,
          funcEnabled: true
        });
        that.getTerm();
      },
      fail: function () {
        that.setData({
          funcEnabled: false
        });
      }
    });
  },

  /************ 今天课表***********/
  getCurrentWeek() {
    var d = new Date();
    var time_current = d.getTime();
    var time_begin = this.getTime(this.data.currentTerm.begindate);
    var time_end = this.getTime(this.data.currentTerm.enddate);
    if (time_current - time_begin < 0 || time_current - time_end > 0) {
      // 抛出异常或返回状态，不在这一层处理
      console.log("还没开学~");
    }
    var dif_time = time_current - time_begin;
    // 当前日期与本学期开始日期 相差毫秒 转换为 相差周，相差n周即为第n周
    var currentWeek = parseInt(dif_time / 604800000) + 1;    // (1000 * 60 * 60 * 24 * 7)
    return currentWeek;
  },
  /**
   * 对日期20180305处理，返回毫秒时间戳格式
   */
  getTime(oDate) {
    var nDate = oDate.substring(0, 4) + ','
      + oDate.substring(4, 6) + ',' + oDate.substring(6, 8);
    var arrDate = nDate.split(',');
    var d = new Date();
    d.setFullYear(arrDate[0], arrDate[1] - 1, arrDate[2]);
    var time = d.getTime();
    return time;
  },
  /**
   * 获取本周课表
   */
  getTimeTable(currentWeek) {
    var url_str = app.globalData.url + '/api/get_timetable';
    var params = {
      Id: wx.getStorageSync('stuUserInfo').cardcode,
      Term: this.data.currentTerm.class_year + this.data.currentTerm.class_term,
      weeks: currentWeek
    };
    util.requestQuery(url_str, params, 'GET', (res) => {
      var timeTable = res.data.data;
      this.getTodayTable(timeTable);
    });
  },
  /**
   * 获取当天课表
   */
  getTodayTable(timeTable) {
    var d = new Date();
    var day = d.getDay();
    var arrDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var strDay = arrDays[day];
    var todayTable = [];
    for (var i in timeTable) {
      if (timeTable[i].section == strDay) {
        todayTable.push(timeTable[i]);
      }
    }
    // 排序
    var ordertTodayTable = [];
    for (var i in todayTable) {
      var order = todayTable[i]['JieC'].substring(0, 1);
      ordertTodayTable[order - 1] = todayTable[i];
    }
    this.setData({
      todayTable: ordertTodayTable,
      loadingHidden: 1
    });
  },
  /**
   * 获取当前学期
   */
  getTerm() {
    var that = this;
    var url_str = app.globalData.url + '/api/get_term';
    util.requestQuery(url_str, '', 'GET', function (res) {
      var res = res.data.data;
      var currentTerm = res[res.length - 1];
      // 这里要判断res吧，不存在抛异常
      that.setData({
        currentTerm: currentTerm
      });
      // TODO:考虑如何清学期缓存
      wx.setStorageSync('currentTerm', currentTerm);
      var currentWeek = that.getCurrentWeek();
      that.getTimeTable(currentWeek);
    });
  },

})