/**
 * 课表模型：
 * 1. 所有课表相关数据都通过这个模型获取获取，与后端的模型层作用类似，区别在于：后端模型从数据库取数据，前端模型从api取数据
 * 2. 还可以包含一些处理课表数据相关方法
 * 如：index课表，kb课表都通过这个模型获取课表数据，提高了复用性，更有层次感
 * */
const app = getApp();

const util = require('../../../utils/util.js');


class Kb {

  /**
   * 获取能获取的学期
   */
  getTerms(callback) {
    var url_str = app.globalData.url + '/api/get_term';
    util.requestQuery(url_str, '', 'GET', (res) => {
      var term = res.data.data;
      callback && callback(term);
    });
  }
  /**
   * 获取本学期
   */
  getCurrentTerm(terms) {
    // 这里要判断res吧，不存在抛异常
    var currentTerm = terms[res.length - 1];
    // TODO:考虑如何清学期缓存
    wx.setStorageSync('currentTerm', currentTerm);
    return currentTerm;
  }
  /**
   * 对日期20180305处理，返回毫秒时间戳格式
   */
  getTime(date) {
    var nDate = date.substring(0, 4) + ','
      + date.substring(4, 6) + ',' + date.substring(6, 8);
    var arrDate = nDate.split(',');
    var d = new Date();
    d.setFullYear(arrDate[0], arrDate[1] - 1, arrDate[2]);
    var time = d.getTime();
    return time;
  }
  /**
   * 返回两日期相差的周数
   */
  getDifWeekCount(beginTime, endTime) {
    var difTime = endTime - beginTime;
    // 末时间与始时间 相差毫秒 转换为 相差周
    var difWeek = parseInt(difTime / 604800000) + 1;    // (1000 * 60 * 60 * 24 * 7)
    return difWeek;
  }
  /**
   * 返回当前第几周，
   * 当前周不在本学期范围内的，返回1
   */
  getCurrentWeek(beginTime, weekCount) {
    var d = new Date();
    var currentTime = d.getTime();
    var currentWeek = this.getDifWeekCount(beginTime, currentTime);
    if (currentWeek < 1 || currentWeek > weekCount) {
      currentWeek = 1;
    }
    return currentWeek;
  }
  /**
   * 获取指定周课表
   */
  getTimeTable(term, week, callback) {
    var url_str = app.globalData.url + '/api/get_timetable';
    var params = {
      Id: wx.getStorageSync('stuUserInfo').cardcode,
      Term: term.class_year + term.class_term,
      weeks: week
    };
    util.requestQuery(url_str, params, 'GET', (res) => {
      var timeTable = res.data.data;
      callback && callback(timeTable);
    });
  }

}

export { Kb };