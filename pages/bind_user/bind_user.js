const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: true
  },
  formSubmit: function (e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    });
    if(this.checkForm(e)) {
      console.log("Input Data is OK");
      var stu_user = {}
      stu_user.stu_number = e.detail.value.stu_number
      stu_user.stu_password = e.detail.value.stu_password
      console.log(stu_user)
      this.requestXnService(stu_user);
    } else {
      
    }
  },
  checkForm: function (e) {
    var formValue = e.detail.value
    if (formValue["stu_number"] == "") {
      wx.showToast({
        title: '学号不能为空',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    if (formValue["stu_password"] == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    return true;
  },
  requestXnService: function (stu_user) {
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: 'http://api.xnqn.com/api/bind-stu-user', //仅为示例，并非真实的接口地址
            data: {
              'stu_user[stu_number]': stu_user.stu_number,
              'stu_user[stu_password]': stu_user.stu_password,
              'code': res.code
            },
            method: "GET",
            header: {
              "accept": "application/vnd.api+json;version=1",
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.status == "failed") {
                wx.showToast({
                  title: '绑定失败: ' + res.data.message_detail,
                  icon: 'none',
                  duration: 2000
                });
              }
              if (res.data.status == "success") {
                console.table(res.data)
                wx.showToast({
                  title: '绑定成功',
                  icon: 'success',
                  duration: 2000
                });
                wx.setStorage({
                  key: 'stu_user',
                  data: res.data.userinfo
                });
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
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
  }

})