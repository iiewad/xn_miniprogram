Page({
  data: {
    energyQuery: {},
    surplusQuery: {}
  },
  onLoad: function(options) {
    var energyQuery = wx.getStorageSync('energyQuery');
    var surplusQuery = wx.getStorageSync('surplusQuery')
    this.setData({
      energyQuery: energyQuery,
      surplusQuery: surplusQuery
    });
    wx.removeStorage({
      key: 'energyQuery',
      success: function(res) {
        console.log('EnergyQuery Removed');
      }
    });
    wx.removeStorage({
      key: 'surplusQuery',
      success: function(res) {
        console.log('SurplusQuery Removed');
      }
    });
    return true;
  }
})