const app = getApp();
const util = require('../../../utils/util.js');

import { Kb } from 'kb-model.js';
var kb = new Kb();

export default Component({
  data: {
    tabs: ['日', '一', '二', '三', '四', '五', '六',],
    terms: {},          // [所有]所有学期
    allWeeks: {},       // [所有]选中学期的所有周
    selectedTerm: {},    // [选中]当前选中的学期
    selectedWeek: '',    // [选中]当前选中的周
    currentDay: 0,     // [本]今天是星期几
    // 本学期，本周无必要绑定到data里，[本]初始化[选中],picker改变[选中]，然后一切都根据[选中]来变化 
    timeTables: {},     // 一周课表
  },
  methods: {
    onLoad: function (options) {
      this._loadData();
    },
    /**
     * 自定义私有方法前加_，方便自己和他人识别，实际_是没作用的
     */
    _loadData() {
      // 初始化 今天是星期几
      var today = new Date();
      this.setData({
        currentDay: today.getDay()
      })
      kb.getTerms((terms) => {
        var currentTerm = this.setTerms(terms);
        var currentWeek = this.setWeeks(currentTerm, true);
        // 初始化选中学期，周为本学期，本周
        this.setData({
          selectedTerm: currentTerm,
          selectedWeek: currentWeek
        });
        // 获取本周课表
        this.setTimeTable();
      });
    },
    /**
     * 绑定 所有学期 数据
     * 返回 本学期
     */
    setTerms: function (termArr) {
      termArr.forEach(function (element) {
        element.class_term_name = element.class_year + '年' + element.class_term + '学期';
      });
      var currentTerm = termArr[termArr.length - 1];  // 根据经验，本学期通常为api数据的最后一个元素
      // 完善点应该要判断currentTerm是否存在
      this.setData({
        terms: termArr,
      });
      return currentTerm;
    },
    /**
     * 绑定 一个学期的所有周数据
     * 返回默认周
     */
    setWeeks(term, current = false) {
      var weeks = [];
      var defaultWeek;
      var beginTime = kb.getTime(term.begindate);
      var endTime = kb.getTime(term.enddate);
      var weekCount = kb.getDifWeekCount(beginTime, endTime);   // 指定学期总周数
      if (current == true) {    // 本周 在 传入学期里
        var currentWeek = kb.getCurrentWeek(beginTime, weekCount);
        for (var i = 0; i < weekCount; i++) {
          var weekValue = i + 1;
          weeks[i] = '第' + weekValue + '周';
          (weekValue == currentWeek) && (weeks[i] += '（当前）');
        }
        defaultWeek = weeks[currentWeek - 1]; // 本学期默认选择本周
      } else {
        for (var i = 0; i < weekCount; i++) {
          weeks[i] = '第' + (i + 1) + '周';
        }
        defaultWeek = weeks[0];  // 非本学期的默认选择第一周
      }
      this.setData({
        allWeeks: weeks,
      });
      return defaultWeek;
    },
    /**
     * 处理 一周的课表数据 相关
     */
    setTimeTable() {
      // 根据 第几周 获取 weekIndex
      var selectedWeek = this.data.selectedWeek;
      var allWeeks = this.data.allWeeks;
      for (var i in allWeeks) {
        if (allWeeks[i] == selectedWeek) {
          break;
        }
      }
      var weekIndex = parseInt(i) + 1;
      kb.getTimeTable(this.data.selectedTerm, weekIndex, (data) => {
        this.bindTimeTable(data);
      });
    },
    /**
     * 绑定 一周的课表数据
     */
    bindTimeTable(tables) {
      // 数组处理！有更巧妙的方法吗？
      var weeksName = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      var classifiedTables = [];
      // 初始化数组
      for (var i = 0; i <= 6; i++) {
        classifiedTables[i] = [];
      }
      // 课程按星期一~日分类
      for (var i in tables) {
        for (var j in weeksName) {
          if (weeksName[j] == tables[i].section) {
            classifiedTables[j].push(tables[i]);
            break;
          }
        }
      }
      // 课程排序
      var sortedTables = [];
      for (var i in classifiedTables) {
        sortedTables[i] = this.sortOneDayTable(classifiedTables[i]);
      }
      this.setData({
        timeTables: sortedTables
      });
    },
    /**
     * 对一天课表排序
     */
    sortOneDayTable(tables) {
      var sortedTable = [];
      for (var i in tables) {
        var order = tables[i]['JieC'].substring(0, 1);
        sortedTable[order - 1] = tables[i];
      }
      // 去除数组中空元素
      var length = sortedTable.length;
      for (var i = 0; i < length; i++) {
        (sortedTable[i] == undefined) && sortedTable.splice(i, 1);
      }
      return sortedTable;
    },
    /**
     * 学期选择处理函数 : 重新绑定selectedTerm
     */
    bindTermPickerChange(event) {
      var index = event.detail.value;
      var selectedTerm = this.data.terms[index];
      this.setData({
        selectedTerm: selectedTerm
      });
      this.setWeeks(selectedTerm);
      this.setTimeTable();
    },
    /**
     * 周选择处理函数：重新绑定selectedWeek
     */
    bindWeekPickerChange(event) {
      var index = parseInt(event.detail.value);
      var weekIndex = index + 1;
      // 更改选中周
      this.setData({
        selectedWeek: this.data.allWeeks[index]
      });
      this.setTimeTable();
    },
  }
});
