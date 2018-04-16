Page({
  data: {
    // 宿舍数据
    apartmentList: ['金岸', '东湖', '芷兰', '丰泽'],
    buildList: ['一栋', '二栋'],
    floorList: ['一层', '二层'],
    roomList: ['101', '102'],
    aIndex: 0,
    bIndex: 0,
    fIndex: 0,
    rIndex: 0,
    focus: [],
  },
  onLoad: function (options) {
    // 准备公寓数据
  },
  // 获取焦点事件
  focusInput(e) {
    var index = e.currentTarget.dataset.index;
    var focus = [];
    focus[index] = 1;
    this.setData({
      focus: focus
    });
  },
  // 失去焦点事件
  blurInput(event) {
    this.setData({
      focus: 0
    });
  }
})