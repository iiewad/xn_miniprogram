// pages/index/kb/kb.js
const app = getApp();
const util = require('../../../utils/util.js');

export default Component({
  data: {
    tabs: [
      { week_id: 0, week_day: '日' },
      { week_id: 1, week_day: '一' },
      { week_id: 2, week_day: '二' },
      { week_id: 3, week_day: '三' },
      { week_id: 4, week_day: '四' },
      { week_id: 5, week_day: '五' },
      { week_id: 6, week_day: '六' }
    ],
    default_index: '',
    term: {},
    allWeeks: {},
    currentTerm: {},
    currentWeek: {},
    timetable: {},
  },
  methods: {
    renderTimetable: function (tableRes) {
      var monTable = [];
      var tueTable = [];
      var wenTable = [];
      var thrTable = [];
      var friTable = [];
      var satTable = [];
      var sunTable = [];
      for (var i = 0, len = tableRes.length; i < len; i++) {
        if (tableRes[i].section == "星期一") {
          monTable.push(tableRes[i]);
        } else if (tableRes[i].section == "星期二") {
          tueTable.push(tableRes[i]);
        } else if (tableRes[i].section == "星期三") {
          wenTable.push(tableRes[i])
        } else if (tableRes[i].section == "星期四") {
          thrTable.push(tableRes[i])
        } else if (tableRes[i].section == "星期五") {
          friTable.push(tableRes[i])
        } else if (tableRes[i].section == "星期六") {
          satTable.push(tableRes[i])
        } else if (tableRes[i].section == "星期日") {
          friTable.push(tableRes[i])
        }
      }
      this.setData({
        timetable: [
          { week_id: 0, course: sunTable },
          { week_id: 1, course: monTable },
          { week_id: 2, course: tueTable },
          { week_id: 3, course: wenTable },
          { week_id: 4, course: thrTable },
          { week_id: 5, course: friTable },
          { week_id: 6, course: satTable }
        ]
      })
    },

    bindWeekPickerChange: function (e) {
      console.log(e.detail.value);
      this.setData({
        currentWeek: {
          id: parseInt(e.detail.value) + 1,
          week_name: this.data.allWeeks[e.detail.value].week_name,
          day_range: this.data.allWeeks[e.detail.value].day_range
        }
      });
      this.getTimetable();
    },

    bindTermPickerChange: function (e) {
      console.log(e.detail.value);
      this.setData({
        currentTerm: this.data.term[e.detail.value]
      });
      this.setWeeks();
    },

    setTimetable: function (tableRes) {
      console.log('Start Set TimeTables')
      this.renderTimetable(tableRes);
    },

    getTimetable: function () {
      console.log('Start Get TimeTables')
      var that = this;
      var params = {};
      params.Id = wx.getStorageSync('stuUserInfo').cardcode; //"20150902233720207";
      params.Term = this.data.currentTerm.class_year + this.data.currentTerm.class_term;
      params.weeks = this.data.currentWeek.id;
      var url_str = app.globalData.url + '/api/get_timetable';

      util.requestQuery(url_str, params, 'GET', function (res) {
        console.log(res.data);
        that.setTimetable(res.data.data);
      }, function (res) {
        console.log('---------Failed--------');
      }, function (res) {
        console.log('--------Compliete------');
      });
    },

    setWeeks: function () {
      console.log('Start Set Weeks')
      var weeksData = this.buildWeeks()
      if (this.data.currentWeek == '') {
        this.setData({
          currentWeek: {
            id: 1,
            week_name: this.data.allWeeks[0].week_name,
            day_range: this.data.allWeeks[0].day_range
          }
        })
      }
      this.setData({
        allWeeks: weeksData,
      });
      this.getTimetable(weeksData);
    },

    setTerm: function (termRes) {
      console.log('Start Set TermData');
      termRes.forEach(function (element) {
        element.class_term_name = element.class_year + '年' + element.class_term + '学期';
      });
      this.setData({
        term: termRes,
        currentTerm: termRes[termRes.length - 1]
      });
      this.setWeeks();
    },

    getTerm: function () {
      console.log('Start Get Term');
      var that = this;
      var url_str = app.globalData.url + '/api/get_term';
      util.requestQuery(url_str, '', 'GET', function (res) {
        that.setTerm(res.data.data);
      }, function (res) {
        console.log('--------Failed--------');
      }, function (res) {
        console.log('--------Complete--------');
      });
    },

    onClick: function (e) {
      console.log(`ComponentId:${e.detail.componentId},you selected:${e.detail.key}`);
    },

    onLoad: function (options) {
      var today = new Date();
      this.setData({
        default_index: today.getDay()
      })
      this.getTerm();
    },

    onReady: function (options) {
    },

    onShow: function (options) {
    },

    buildWeeks: function () {
      var currentWeeks = {};
      currentWeeks.begindate = this.data.currentTerm.begindate.substring(0, 4) + '-' + this.data.currentTerm.begindate.substring(4, 6) + '-' + this.data.currentTerm.begindate.substring(6, 8);
      currentWeeks.begindate = this.getDate(currentWeeks.begindate);
      currentWeeks.enddate = this.data.currentTerm.enddate.substring(0, 4) + '-' + this.data.currentTerm.enddate.substring(4, 6) + '-' + this.data.currentTerm.enddate.substring(6, 8);
      currentWeeks.enddate = this.getDate(currentWeeks.enddate);

      var dateArray = new Array();
      while ((currentWeeks.enddate.getTime() - currentWeeks.begindate.getTime()) >= 0) {
        var year = currentWeeks.begindate.getFullYear();
        var month = currentWeeks.begindate.getMonth().toString().length == 1 ? "0" + currentWeeks.begindate.getMonth().toString() : currentWeeks.begindate.getMonth();
        var day = currentWeeks.begindate.getDate().toString().length == 1 ? "0" + currentWeeks.begindate.getDate() : currentWeeks.begindate.getDate();
        dateArray.push(year + "-" + month + "-" + day);
        currentWeeks.begindate.setDate(currentWeeks.begindate.getDate() + 1);
      }

      this.setData({
        currentWeek: ''
      })

      var weeks = [];
      var weekCount = 0;
      var day_range = '';
      var today = util.formatDate(new Date(), '-');
      for (var i = 0, len = dateArray.length; i < len; i += 7) {
        day_range = dateArray.slice(i, i + 7);
        if (day_range.includes(today)) {
          weeks[weekCount++] = {
            'week_name': '第' + weekCount + '周(当前)',
            'day_range': day_range
          }
          this.setData({
            currentWeek: {
              'id': weekCount,
              'week_name': '第' + weekCount + '周(当前)',
              'day_range': day_range
            }
          })
        } else {
          weeks[weekCount++] = {
            'week_name': '第' + weekCount + '周',
            'day_range': day_range
          }
        }
      }
      return weeks;
    },

    getDate: function (datestr) {
      var temp = datestr.split("-");
      var date = new Date(temp[0], temp[1], temp[2]);
      return date;
    }
  }
});
