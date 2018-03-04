// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuItems: [
      {
        name: '成绩查询',
        imagePath: '../../images/menu-grade.png'
      },
      {
        name: '电费查询',
        imagePath: '../../images/menu-energy-charge.png'
      },
      {
        name: '课表查询',
        imagePath: '../../images/menu-class-schedule.png'
      },
      {
        name: '损坏保修',
        imagePath: '../../images/menu-maintain.png'
      },
      {
        name: '一卡通',
        imagePath: '../../images/menu-card.png'
      },
      {
        name: '图书查询',
        imagePath: '../../images/menu-book.png'
      },
      {
        name: '借阅信息',
        imagePath: '../../images/menu-borrow-books.png'
      },
      {
        name: '空教室',
        imagePath: '../../images/menu-classroom.png'
      }
    ],
    funcItems: [
      '1'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
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