//app.js
const Towxml = require('/towxml/main');
const util = require('utils/util.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    var that = this;
    wx.getStorage({
      key: 'stuUserInfo',
      success: function (res) {
        wx.checkSession({
          success: function () {
            console.log('Session Ok')
          },
          fail: function () {
            console.log('Session Fail')
          },
          complete: function () {

          }
        });
      },
      fail: function () {
        that.wxLogin();
      }
    });
  },

  globalData: {
    userInfo: null,
    url: 'https://api.hunau.club',
    /*url: 'http://localhost:3030',*/
    stuUserInfo: ''
  },

  towxml: new Towxml(),

  wxLogin: function () {
    wx.login({
      success: res => {
        var code = res.code;
        var that = this;
        if (code) {
          console.log('获取凭证=>' + code);
          var url_str = this.globalData.url + '/api/wx-login';
          console.log(url_str);
          var params = {
            code: code
          }
          util.requestQuery(url_str, params, 'GET', function (res) {
            console.log(res.data)
            if (res.data.status === 'success') {
              that.globalData.stuUserInfo = res.data.data
              wx.setStorage({
                key: 'stuUserInfo',
                data: res.data.data,
              });
              wx.reLaunch({
                url: '/pages/index/index',
              });
            } else if (res.data.status === 'failed') {
              wx.navigateTo({
                url: '/pages/bind_user/bind_user',
              });
            }
          }, function (res) {
            console.log('Failed');
          }, function (res) {
            console.log('Complete')
          });
        }
      }
    })
  },


})