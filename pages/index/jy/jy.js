// pages/index/jy/jy.js
Page({

  /**
   * 页面的初始数据
   */
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
    wx.request({
      url: 'http://localhost:3030/api/get_borrow',
      data: {
        cardcode: cardcode,
        pageindex: 0,
        pagesize: 20
      },
      header: {
        "accept": "application/vnd.api+json;version=1",
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data.data);
        this.setBorrowInfo(res.data.data);
        return true;
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorage({
      key: 'stu_userinfo',
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