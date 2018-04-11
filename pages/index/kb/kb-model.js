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
    var currentTerm = terms[terms.length - 1];    // 根据经验，本学期通常为api数据的最后一个元素
    // TODO:考虑如何清学期缓存
    // wx.setStorageSync('currentTerm', currentTerm);
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
   * 这个方法不应该由外部直接调用
   */
  getDifWeekCount(beginTime, endTime) {
    var difTime = endTime - beginTime;
    // 末时间与始时间 相差毫秒 转换为 相差周
    var difWeek = parseInt(difTime / 604800000) + 1;    // (1000 * 60 * 60 * 24 * 7)
    return difWeek;
  }
  /**
   *  获取周相关数：
   *  1. 指定学期总周数
   *  2. 本周是第几周（如果本周合理） 
   */
  getWeekCounts(term) {
    var beginTime = this.getTime(term.begindate);
    var endTime = this.getTime(term.enddate);
    var weekCount = this.getDifWeekCount(beginTime, endTime);   // 指定学期总周数
    var currentWeek = this.getCurrentWeek(beginTime, weekCount);
    return {
      weekCount: weekCount,
      currentWeek: currentWeek
    };
  }
  /**
   * @params 
   * @return 返回当前第几周，
   *         当前周不在本学期范围内的，返回-1,表示不属于
   */
  getCurrentWeek(beginTime, weekCount) {
    var d = new Date();
    var currentTime = d.getTime();
    var currentWeek = this.getDifWeekCount(beginTime, currentTime);
    if (currentWeek < 1 || currentWeek > weekCount) {
      currentWeek = -1;
    }
    return currentWeek;
  }
  /**
   * 获取指定周课表
   */
  getTimeTable(params) {
    var url_str = app.globalData.url + '/api/get_timetable';
    var allParams = {
      Id: wx.getStorageSync('stuUserInfo').cardcode,
      Term: params.term.class_year + params.term.class_term,
      weeks: params.week
    };
    util.requestQuery(url_str, allParams, 'GET', (res) => {
      var timeTable = res.data.data;
      params.callback && params.callback(timeTable);
    });
  }
  /**
   * 获取今天课表
   */
  getCurrentDayTable(timeTable) {
    var d = new Date();
    var day = d.getDay();
    return this.getOneDayTable(timeTable, day);
  }
  /**
   * 获取指定天 已排序 的课表,
   * 好像有点多余.......
   */
  getOneDayTable(timeTable, dayIndex) {
    var table = [];
    var arrDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var strDay = arrDays[dayIndex];
    for (var i in timeTable) {
      if (timeTable[i].section == strDay) {
        table.push(timeTable[i]);
      }
    }
    return this.sortOneDayTable(table);
  }
  /**
   * 一天课表排序
   */
  sortOneDayTable(tables) {
    var sortedTable = [];
    var nSortedTable = [];
    for (var i in tables) {
      var order = tables[i]['JieC'].substring(0, 1);
      sortedTable[order - 1] = tables[i];
    }
    // 去除数组中空元素
    var length = sortedTable.length;
    for (var i = 0; i < length; i++) {
      if (sortedTable[i] != undefined) {
        nSortedTable.push(sortedTable[i]);
      }
    }
    return nSortedTable;
  }
  /**
   * 一周课表分类
   */
  classfyTables(tables) {
    // 数组处理！有更巧妙的方法吗？php就有..
    var weeksName = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var classifiedTables = [];
    var sortedTables = [];
    // 初始化数组
    for (var i = 0; i <= 6; i++) {
      classifiedTables[i] = [];
    }
    for (var i in tables) {
      for (var j in weeksName) {
        if (weeksName[j] == tables[i].section) {
          classifiedTables[j].push(tables[i]);
          break;
        }
      }
    }
    // 排序
    for (var i in classifiedTables) {
      sortedTables[i] = this.sortOneDayTable(classifiedTables[i]);
    }
    return sortedTables;
  }
}

export { Kb };