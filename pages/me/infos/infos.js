
import { Room } from '../../../utils/room.js';
var room = new Room();

Page({
  data: {
    // 宿舍数据
    apartmentList: [],
    buildList: [],
    floorList: [],
    roomList: [],
    fiveList: [],
    aIndex: 0,
    bIndex: 0,
    fIndex: 0,
    rIndex: 0,
    fiveIndex: 0,
    focus: [],
  },
  onLoad: function (options) {
    room.getUserRoomData((dormidList) => {
      if (dormidList && dormidList.length > 0) {
        this._loadDataNew(dormidList);
      } else {
        this.initNew();
      }
    });
  },
  _loadDataNew(dormidList) {
    dormidList.unshift('');
    room.getSettedData((list, indexList) => {
      this.setListData(list, indexList, 5);
    }, dormidList);
  },
  initNew() {
    let item = '';
    let num = 5;
    let indexList = [];
    for (let i = 0; i < num; i++) {
      indexList[i] = 0;
    }
    this.getRoomData(item, indexList, num);
  },
  /**
  * 获取 数据
  */
  getRoomData(item, indexList, num) {
    let dormid = '';
    if (item) {
      dormid = item.dormid;
    }
    room.getRoomData((list) => {
      console.log(list);
      this.setListData(list, indexList, num);
    }, dormid);
  },
  /**
   * 绑定数据
   */
  setListData(list, indexList, num) {
    let listKeyArr = [
      'apartmentList', 'buildList', 'floorList',
      'roomList', 'fiveList'
    ];
    let indexKeyArr = [
      'aIndex', 'bIndex', 'fIndex', 'rIndex', 'fiveIndex'
    ];
    let cut = 5 - num;
    for (let i = 1; i <= cut; i++) {
      listKeyArr.shift();
    }
    for (let i = 2; i <= cut; i++) {
      indexKeyArr.shift();
    }
    for (let i in listKeyArr) {
      let bindList = {};
      if (list[i] && list[i].length > 0) {
        bindList[listKeyArr[i]] = list[i];
      } else {
        bindList[listKeyArr[i]] = [];
      }
      this.setData(bindList);
    }
    for (let i in indexKeyArr) {
      let bindIndex = {};
      if (indexList[i] && indexList[i].length > 0) {
        bindIndex[indexKeyArr[i]] = indexList[i];
      } else {
        bindIndex[indexKeyArr[i]] = 0;
      }
      this.setData(bindIndex);
    }
  },
  preSetList(index, num) {
    let listKeyArr = [
      'apartmentList', 'buildList', 'floorList',
      'roomList', 'fiveList'
    ];
    let item = this.data[listKeyArr[4 - num]][index];
    let indexList = [];
    indexList[0] = index;
    for (let i = 1; i < num; i++) {
      indexList[i] = 0;
    }
    this.getRoomData(item, indexList, num);
  },
  changeApartment(e) {
    this.preSetList(room.getPickerValue(e), 4);
  },
  changeBuild(e) {
    this.preSetList(room.getPickerValue(e), 3);
  },
  changeFloor(e) {
    this.preSetList(room.getPickerValue(e), 2);
  },
  changeRoom(e) {
    this.preSetList(room.getPickerValue(e), 1);
  },
  changeFive(e) {
    this.preSetList(room.getPickerValue(e), 0);
  },



  onSubmit() {
    let dataObj = this.getDataToSearch();
    room.saveAddress(dataObj.dormidList, (res) => {
      // 保存后返回来源页面
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 3000,
        complete: () => {
          wx.navigateBack()
        }
      });
    });
  },
  getDataToSearch() {
    let roomName, dormidList = [];
    let apartmentList = this.data.apartmentList;
    let buildList = this.data.buildList;
    let floorList = this.data.floorList;
    let roomList = this.data.roomList;
    let fiveList = this.data.fiveList;
    let cApartment = apartmentList[this.data.aIndex];
    let cBuild = buildList[this.data.bIndex];
    let cFloor = floorList[this.data.fIndex];
    roomName = cApartment.dormname
      + cBuild.dormname
      + cFloor.dormname;
    dormidList.push(
      cApartment.dormid,
      cBuild.dormid,
      cFloor.dormid
    );
    if (roomList && roomList.length > 0) {
      roomName += roomList[this.data.rIndex].dormname;
      dormidList.push(roomList[this.data.rIndex].dormid);
    }
    if (fiveList && fiveList.length > 0) {
      roomName += fiveList[this.data.fiveIndex].dormname;
      dormidList.push(fiveList[this.data.fiveIndex].dormid);
    }
    return {
      roomName: roomName,
      dormidList: dormidList
    };
  },

  /**
   * 根据各index，和list获取dormidList
   */
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