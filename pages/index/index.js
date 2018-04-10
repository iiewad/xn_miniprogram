// pages/index/index.js
const app=getApp();
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
    funcEnabled: false
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
      success: function(res) {
        that.setData({
          loginFlag: true,
          funcEnabled: true
        });
      },
      fail: function() {
        that.setData({
          funcEnabled: false
        });
      }
    });
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})