// pages/me/feedback/feedback.js
const app = getApp();
const util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedBackTitle: '',
    feedBackDes: '',
    feedbackRes: ''
  },

  showDialog() {
    let dialogComponent = this.selectComponent('.wxc-dialog')
    dialogComponent && dialogComponent.show();
  },
  hideDialog() {
    let dialogComponent = this.selectComponent('.wxc-dialog')
    dialogComponent && dialogComponent.hide();
  },

  onConfirm() {
    console.log('点击了确认按钮')
    this.hideDialog();
    wx.navigateBack();
  },
  onCancel() {
    console.log('点击了取消按钮')
    this.hideDialog()
  },

  feedBackTitleBind: function (e) {
    console.log(e);
    this.setData({
      feedBackTitle: e.detail.value
    });
  },

  feedBackDesBind: function (e) {
    console.log(e);
    this.setData({
      feedBackDes: e.detail.value
    });

  },

  submitFeedBack: function () {
    var feedBackTitle = this.data.feedBackTitle;
    var feedBackDes = this.data.feedBackDes;
    var feedBackContact = this.data.feedBackContact;

    if (feedBackTitle === '') {
      console.warn('Title Empty');
      wx.showToast({
        title: '请填写反馈标题',
        icon: 'none'
      });
      return false;
    } else if (feedBackDes === '') {
      console.warn('Des Empty');
      wx.showToast({
        title: '请填写反馈内容',
        icon: 'none'
      })
      return false;
    }

    var data = {}
    data.title = feedBackTitle;
    data.content = feedBackDes;
    var url_str = app.globalData.url + '/api/feedback';
    var that = this;
    wx.getStorage({
      key: 'stuUserInfo',
      success: function(res) {
        data.stu_user_id = res.data.cardcode;
        util.requestQuery(url_str, data, 'POST', function (res) {
          console.log(res.data);
          if (res.data.status == 'success') {
            that.setData({
              feedbackRes: '谢谢您的反馈! ❤️ '
            });
          } else if (res.data.status == 'failed') {
            that.setData({
              feedbackRes: res.data.message + '：您应该是重复提交了反馈或者我们已经有了类似的反馈!'
            });
          }
          
          that.showDialog();
        }, function (res) {
          console.warn('Error');
        }, function (res) {
          console.log('Complete');
        });
      },
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