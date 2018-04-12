const app = getApp();
const util = require('../../../utils/util.js');

import { Kb } from 'kb-model.js';
var kb = new Kb();

export default Component({
  data: {
    tabs: ['日', '一', '二', '三', '四', '五', '六',],
    terms: {},          // [所有]所有学期
    allWeeks: {},       // [所有]选中学期的所有周
    timeTables: {},     // [所有]选中周的所有课表    
    selectedTerm: {},    // [选中]选中的学期
    selectedWeek: '',    // [选中]选中的周
    currentTerm: {},     // [本]本学期 
    currentWeek: '',     // [本]本周
    currentDay: 0,     // [本]今天是星期几
    loadingHidden: 0
    // [本]初始化[选中],picker改变[选中]，然后一切都根据[选中]来变化 
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
        this.setTerms(terms);
        this.setWeeks();
        this.setTimeTable();
      });
    },
    /**
     * 绑定
     *  1. terms：所有学期数据
     *  2. selectedTerm：本学期
     *  3. currentTerm：本学期
     */
    setTerms: function (termArr) {
      termArr.forEach(function (element) {
        element.class_term_name = element.class_year + '年' + element.class_term + '学期';
      });
      var currentTerm = kb.getCurrentTerm(termArr);
      // 完善点应该要判断currentTerm是否存在
      this.setData({
        terms: termArr,
        selectedTerm: currentTerm,
        currentTerm: currentTerm
      });
    },
    /**
     * 绑定 
     *  1. allWeeks：当前选中学期的所有周数据
     *  2. selectedWeek：当前选中学期的默认周
     */
    setWeeks() {
      var term = this.data.selectedTerm;
      var weekObj;
      // 获取指定学期总周数和本周
      var weekCounts = kb.getWeekCounts(term);
      var weekCount = weekCounts.weekCount;
      if (term.id == this.data.currentTerm.id) {    // 选中学期为本学期
        var currentWeek = weekCounts.currentWeek;
        if (currentWeek != -1) {
          weekObj = this._setCurrentWeek(weekCount, currentWeek);
        } else {
          weekObj = this._noSetCurrentWeek(weekCount);
        }
      } else {
        weekObj = this._noSetCurrentWeek(weekCount);
      }
      this.setData({
        allWeeks: weekObj.weeks,
        selectedWeek: weekObj.defaultWeek
      });
    },
    /**
     * 加“当前”处理
     */
    _setCurrentWeek(weekCount, currentWeek) {
      var weeks = [];
      var defaultWeek;
      for (var i = 0; i < weekCount; i++) {
        var weekValue = i + 1;
        weeks[i] = '第' + weekValue + '周';
        (weekValue == currentWeek) && (weeks[i] += '（当前）');
      }
      defaultWeek = weeks[currentWeek - 1]; // 本学期默认选择本周
      this.setData({
        currentWeek: defaultWeek
      });
      return {
        weeks: weeks,
        defaultWeek: defaultWeek
      };
    },
    /**
     * 不加“当前”处理
     */
    _noSetCurrentWeek(weekCount) {
      var weeks = [];
      var defaultWeek;
      for (var i = 0; i < weekCount; i++) {
        weeks[i] = '第' + (i + 1) + '周';
      }
      defaultWeek = weeks[0];  // 非本学期的默认选择第一周
      return {
        weeks: weeks,
        defaultWeek: defaultWeek
      };
    },
    /**
     *  绑定：选中周的课表数据
     */
    setTimeTable() {
      var term = this.data.selectedTerm;
      var weekIndex = this.getWeekIndex(this.data.selectedWeek);
      var that = this;
      var params = {
        term: term,
        week: parseInt(weekIndex) + 1,
        callback: function (data) {
          var tables = kb.classfyTables(data);
          that.setData({
            timeTables: tables,
            loadingHidden: 1
          });
        }
      };
      // 判断是否 本学期，本周
      if (term.id == this.data.currentTerm.id &&
        weekIndex == this.getWeekIndex(this.data.currentWeek)) {
        kb.getCurrentWeekTable(params);
      } else {
        kb.getTimeTable(params);
      }
    },
    /**
     * 根据 value 获取其在allWeeks的index
     */
    getWeekIndex(weekValue) {
      var allWeeks = this.data.allWeeks;
      for (var i in allWeeks) {
        if (allWeeks[i] == weekValue) {
          break;
        }
      }
      return i;
    },
    /**
     * 学期选择处理函数 : 重新绑定selectedTerm
     */
    bindTermPickerChange(event) {
      var index = event.detail.value;
      var selectedTerm = this.data.terms[index];
      this.setData({
        selectedTerm: selectedTerm,
        loadingHidden: 0,
      });
      this.setWeeks();
      this.setTimeTable();
    },
    /**
     * 周选择处理函数：重新绑定selectedWeek
     */
    bindWeekPickerChange(event) {
      var index = parseInt(event.detail.value);
      var weekIndex = index + 1;
      this.setData({
        selectedWeek: this.data.allWeeks[index],
        loadingHidden: 0,
      });
      this.setTimeTable();
    },
  }
});
