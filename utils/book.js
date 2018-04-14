const app = getApp();
const util = require('util.js');

/**
 * 书 模型
 */

class Book {
  /**
   * 从缓存获取借阅图书数据
   */
  getBorrowDataFromCache(callback) {
    var borrowInfo = wx.getStorageSync('borrowInfo');
    if (!borrowInfo) {
      callback && this.getBorrowData(callback);
    } else {
      callback && callback(borrowInfo);
    }
  }
  /**
   * 获取借阅图书数据
   */
  getBorrowData(callback) {
    var that = this;
    var url_str = app.globalData.url + '/api/get_borrow';
    var params = {
      cardcode: wx.getStorageSync('stuUserInfo').cardcode,
      pageindex: 0,
      pagesize: 20
    };
    util.requestQuery(url_str, params, 'GET', (res) => {
      var data = res.data.data.TList;
      var books = this.addDisDayPro(data);
      wx.setStorageSync('borrowInfo', books);
      callback && callback(books);
    })
  }
  /**
   * 添加 距归还 属性
   */
  addDisDayPro(books) {
    var disDay = {};
    for (var i in books) {
      var dD = this.countDistanceDay(books[i].yhrq);
      if (dD <= 0) {
        disDay.isWarning = 0;
        disDay.value = '逾期 '
        disDay.value += -1 * dD + 1 + ' 天';
      } else if (dD <= 5) {
        disDay.isWarning = 1;
        disDay.value = '还剩 ' + dD + ' 天';
      } else {
        disDay.isWarning = 2;
        disDay.value = '还剩 ' + dD + ' 天';
      }
      // 解决对象赋值 传递引用问题
      books[i].disDay = {};
      for (var j in disDay) {
        books[i].disDay[j] = disDay[j];
      }
    }
    return books;
  }
  /**
   * 计算 今天 距 目标日期[格式：2018/4/13] 天数
   * eg. 今天是23号，目标日期也是23号，则返回0
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

    // 测试用，记得删除
    // cD.setFullYear(2018, 4, 19);

    distanceDay = (tD.getTime() - cD.getTime()) / 86400000;
    return distanceDay;
  }
}

export { Book };