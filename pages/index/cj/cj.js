// pages/index/cj/cj.js
const app = getApp()

Page({
  data: {
    xn: {},
    grades: {},
    grade: {}
  },
  setStuGrades: function (grades) {
    console.log('Start Set StuGrades');
    this.setData({
      xn: Object.keys(grades),
      grades: grades
    });
  },
  bindPickerChange: function (e) {
    var pickerValue = e.detail.value;
    var currentXN = this.data.xn[pickerValue];
    var grade = this.data.grades[currentXN];
    this.setData({
      grade: grade
    });
  },
  getStuGrades: function (stuNumber, stuCardCode) {
    wx.request({
      url: app.globalData.url + '/api/grade',
      data: {
        stuNumber: stuNumber,
        stuCardCode: stuCardCode
      },
      header: {
        "accept": "application/vnd.api+json;version=1",
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        this.setStuGrades(res.data.grades);
        return true;
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var stuInfo = wx.getStorageSync('stu_userinfo');
    var stuNumber = stuInfo.schno;
    var stuCardCode = stuInfo.cardcode;
    this.getStuGrades(stuNumber, stuCardCode);
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