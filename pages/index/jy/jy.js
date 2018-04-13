const app = getApp();
const util = require('../../../utils/util.js');

Page({
  data: {
    userInfo: '',
    borrowInfo: ''
  },

  setBorrowInfo: function (borrowRes) {
    for (var i in borrowRes) {
      // 添加 距 到期天数
      var distanceDay = this.countDistanceDay(borrowRes[i].yhrq);
      if (distanceDay > 0) {
        borrowRes[i].distanceDay = distanceDay;
      } else {
        borrowRes[i].distanceDay = '逾期';
        borrowRes[i].distanceDay += -1 * distanceDay + 1;
      }
    }
    this.setData({
      borrowInfo: borrowRes
    })
  },
  /**
   * 计算 距 归还日期 天数
   */
  countDistanceDay(date) {
    var cD = new Date();
    var tD = new Date();
    var nDate, nDateArr, distanceDay;
    cD.setHours(0, 0, 0, 0);
    tD.setHours(0, 0, 0, 0);
    nDate = date.substring(0, 9);
    nDateArr = nDate.split('/');
    tD.setFullYear(nDateArr[0], parseInt(nDateArr[1]) - 1, nDateArr[2]);
    distanceDay = (tD.getTime() - cD.getTime()) / 86400000;
    return distanceDay;
  },
  requestBorrow: function (cardcode) {
    var that = this;
    var url_str = app.globalData.url + '/api/get_borrow';
    var params = {
      cardcode: cardcode,
      pageindex: 0,
      pagesize: 20
    };

    util.requestQuery(url_str, params, 'GET', function (res) {
      // console.log(res.data.data);
      that.setBorrowInfo(res.data.data.TList);
    }, function (res) {
      console.log('Request Failed');
    }, function (res) {
      console.log('Request Complete');
    })
  },

  onLoad: function (options) {
    var userInfo = wx.getStorage({
      key: 'stuUserInfo',
      success: res => {
        this.requestBorrow(res.data.cardcode);
        return true;
      }
    });
  },
})