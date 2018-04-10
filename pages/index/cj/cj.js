// pages/index/cj/cj.js
const app = getApp();
const util = require('../../../utils/util.js')

Page({
  data: {
    xn: {},
    grades: {},
    grade: {}
  },

  bindPickerChange: function (e) {
    var pickerValue = e.detail.value;
    var currentXN = this.data.xn[pickerValue];
    var grade = this.data.grades[currentXN];
    this.setData({
      grade: grade
    });
  },
  setStuGrades: function (stuNumber, stuCardCode) {
    var that = this;
    var url = app.globalData.url + '/api/grade';
    var params = {};
    params.stuNumber = stuNumber;
    params.stuCardCode = stuCardCode;
    util.requestQuery(url, params, 'GET', function(res) {
      console.log(res.data);
      that.setData({
        xn: Object.keys(res.data.grades),
        grades: res.data.grades
      })
    }, function(res) {
      console.log('Failed');
    }, function(res) {
      console.log('Complete')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var stuInfo = wx.getStorageSync('stuUserInfo');
    var stuNumber = stuInfo.schno;
    var stuCardCode = stuInfo.cardcode;
    this.setStuGrades(stuNumber, stuCardCode);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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