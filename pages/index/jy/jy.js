// pages/index/jy/jy.js
const app = getApp();
const util = require('../../../utils/util.js');

Page({
  data: {
    userInfo: '',
    borrowInfo: ''
  },

  setBorrowInfo: function (borrowRes) {
    this.setData({
      borrowInfo: borrowRes.TList
    })
  },

  requestBorrow: function (cardcode) {
    var that = this;
    var url_str = app.globalData.url + '/api/get_borrow';
    var params = {
      cardcode: cardcode,
      pageindex: 0,
      pagesize: 20
    };

    util.requestQuery(url_str, params, 'GET', function(res) {
      console.log(res.data.data);
      that.setBorrowInfo(res.data.data);
    }, function(res) {
      console.log('Request Failed');
    }, function(res) {
      console.log('Request Complete');
    })
  },

  onLoad: function (options) {
    var userInfo = wx.getStorage({
      key: 'stuUserInfo',
      success: res => {
        this.requestBorrow(res.data.cardcode);
        return true;
      }
    });
    
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