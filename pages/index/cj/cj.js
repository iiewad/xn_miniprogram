// pages/index/cj/cj.js
const app = getApp();
const util = require('../../../utils/util.js')

Page({
  data: {
    xn: {},
    grades: {},
    grade: {},
    currentXN: '',
    stuName: '',
    popupgrade: ''
  },

  showPopup(e) {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.show();
    var browIndex = e.currentTarget.dataset.index;
    console.log(browIndex);
    this.setData({
      popupgrade: this.data.grade[browIndex]
    });
  },

  hidePopup() {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.hide();
  },

  open: function () {
    var that = this;
    wx.showActionSheet({
      itemList: this.data.xn,
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex);
          var pickerValue = res.tapIndex;
          var currentXN = that.data.xn[pickerValue];
          var grade = that.data.grades[currentXN];
          that.setData({
            currentXN: currentXN,
            grade: grade
          })
        }
      }
    });
  },

  setStuGrades: function (stuNumber, stuCardCode) {
    var that = this;
    var url = app.globalData.url + '/api/grade';
    var params = {};
    params.stuNumber = stuNumber;
    params.stuCardCode = stuCardCode;
    util.requestQuery(url, params, 'GET', function(res) {
      wx.hideLoading();
      console.log(res.data);
      var xn = Object.keys(res.data.grades);
      var grades = res.data.grades;
      var currentXN = xn[0];
      var grade = grades[currentXN];
      that.setData({
        xn: xn,
        grades: grades,
        currentXN: currentXN,
        grade: grade
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
    var that = this;
    wx.showLoading({
      title: '正在加载...'
    });
    wx.getStorage({
      key: 'stuUserInfo',
      success: function(res) {
        var stuInfo = res.data;
        var stuNumber = stuInfo.schno;
        var stuCardCode = stuInfo.cardcode;
        console.log(stuInfo.name)
        that.setData({
          stuName: stuInfo.name
        });
        that.setStuGrades(stuNumber, stuCardCode);
      },
    })
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