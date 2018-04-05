// pages/index/ykt/ykt.js
const app = getApp();
const util = require('../../../utils/util.js')

Page({
  data: {
    beginDate: '',
    endDate: '',
    tranItems: '',
    userinfo: '',
    selectedTranItem: '',
    brows: {},
    lossPassword: '',
    lossRes: ''
  },

  setLossPassword: function (e) {
    this.setData({
      lossPassword: e.detail.value
    });
  },

  requestLoss: function() {
    var that = this;
    var params = {
      id: this.data.userinfo.cardcode,
      CardId: this.data.userinfo.schno,
      pwd: this.data.lossPassword
    };
    var url_str = app.globalData.url + '/api/loss';
    util.requestQuery(url_str, params, 'GET', function(res) {
      that.setData({
        lossRes: res.data.data
      });
      that.showPromptDialog();
    }, function(res) {
      console.log('-----Failed-------')
    }, function(res) {
      console.log('-------Complete------')
    });
  },

  showPromptDialog() {
    let dialogComponent = this.selectComponent('.wxc-prompt-dialog')
    dialogComponent && dialogComponent.show();
  },
  hidePromptDialog() {
    let dialogComponent = this.selectComponent('.wxc-prompt-dialog')
    dialogComponent && dialogComponent.hide();
  },
  onPromptConfirm() {
    console.log('点击了确认按钮')
    this.hidePromptDialog()
  },
  onPromptCancel() {
    console.log('点击了取消按钮')
    this.hidePromptDialog()
  },

  showLossDialog() {
    let dialogComponent = this.selectComponent('.wxc-loss-dialog')
    dialogComponent && dialogComponent.show();
  },
  hideLossDialog() {
    let dialogComponent = this.selectComponent('.wxc-loss-dialog')
    dialogComponent && dialogComponent.hide();
  },
  onLossConfirm(e) {
    console.log('点击了确认按钮')
    this.hideLossDialog()
    this.requestLoss()    
  },
  onLossCancel() {
    console.log('点击了取消按钮')
    this.hideLossDialog()
  },

  setBrows: function (browsRes) {
    this.setData({
      brows: browsRes.data.data
    });
    wx.navigateTo({
      url: 'showBrows',
    });
  },

  requestBrows: function (params) {
    var that = this;
    var url_str = app.globalData.url + '/api/get_brows';
    util.requestQuery(url_str, params, 'GET', function(res) {
      console.log(res.data.data);
      that.setBrows(res);
      return true;
    }, function(res) {
      console.log('Failed');
    }, function(res) {
      console.log('Complete');
    });
  },

  queryBrows: function () {
    var params = {};
    var brows = {};
    params.cardid = this.data.userinfo.schno;
    params.id = this.data.userinfo.cardcode;
    //params.cardid = '201541842107';
    //params.id = '20150902233720207';
    params.code = this.data.selectedTranItem.trancode;
    params.bData = util.formatDate(new Date(this.data.beginDate));
    params.eData = util.formatDate(new Date(this.data.endDate));
    params.pageNum = 0;
    params.pageSize = 10;
    params.pageindex = 0;
    params.SessionId = '';
    this.requestBrows(params);
  },

  bindTranItemChange: function (e) {
    this.setData({
      selectedTranItem: this.data.tranItems[e.detail.value]
    });
  },

  bindEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value
    });
  },
  bindBeginDateChange: function (e) {
    this.setData({
      beginDate: e.detail.value
    });
  },
  setTranItems: function (tranItemRes) {
    this.setData({
      tranItems: tranItemRes,
      selectedTranItem: tranItemRes[2]
    });
  },

  getTranItems: function () {
    var that = this;
    var url_str = app.globalData.url + '/api/tran_items';
    var params = {};
    util.requestQuery(url_str, params, 'GET', function(res) {
      that.setTranItems(res.data.data);
    }, function(res) {
      console.log('------Failed--------')
    }, function(res) {
      console.log('-------Complete--------')
    });
  },

  onLoad: function (options) {
    var date = new Date();
    var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var userinfo = wx.getStorageSync('stuUserInfo');
    today = util.formatDate(new Date(today), '-');
    this.setData({
      endDate: today,
      beginDate: today,
      userinfo: userinfo
    });
    this.getTranItems();
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