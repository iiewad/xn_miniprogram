// pages/index/index.js
Page({
  data: {
    menuItems: [
      {
        name: '成绩查询',
        imagePath: '../../images/menu-grade.png',
        funcName: 'cj'
      },
      {
        name: '电费查询',
        imagePath: '../../images/menu-energy-charge.png',
        funcName: 'df'
      },
      {
        name: '课表查询',
        imagePath: '../../images/menu-class-schedule.png',
        funcName: 'kb'
      },
      {
        name: '损坏保修',
        imagePath: '../../images/menu-maintain.png',
        funcName: 'bx'
      },
      {
        name: '一卡通',
        imagePath: '../../images/menu-card.png',
        funcName: 'xyk'
      },
      {
        name: '图书查询',
        imagePath: '../../images/menu-book.png',
        funcName: 'ts'
      },
      {
        name: '借阅信息',
        imagePath: '../../images/menu-borrow-books.png',
        funcName: 'jy'
      },
      {
        name: '空教室',
        imagePath: '../../images/menu-classroom.png',
        funcName: 'js'
      }
    ],
    funcItems: [
      '1'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  tapFunc: function (options) {
    console.log(options)
    var funcName = options.currentTarget.id;
    wx.navigateTo({
      url: funcName + '/' + funcName,
    })
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