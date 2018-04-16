//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    stuUserInfo: {},
    hasStuUserInfo: false
  },
  bindUserTap: function () {
    wx.navigateTo({
      url: '../bind_user/bind_user'
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getStuUserInfo();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getStuUserInfo: function (e) {
    wx.getStorage({
      key: 'stuUserInfo',
      success: res => {
        this.setStuUserInfo(res.data);
      },
      fail: function () {
        console.log('Get stu_userinfo failed')
      }
    });
  },
  setStuUserInfo: function (stuUserInfo) {
    this.setData({
      stuUserInfo: stuUserInfo,
      hasStuUserInfo: true
    });
  },
  /**
   * 跳转到用户信息页面
   */
  onInfosTap() {
    wx.navigateTo({
      url: 'infos/infos',
    })
  }
})
