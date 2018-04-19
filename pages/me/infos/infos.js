
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
    indexList: [],
    focus: [],
    comeFrom: '',
  },
  onLoad: function (options) {
    let indexList;
    if (options.from == 'df') {
      // 来源电费页面：接收indexList
      let indexStr = options.indexList;
      indexList = indexStr.split(',');
      this.setData({
        indexList: indexList,
        comeFrom: 'df'
      });
      this._loadData(true);
    } else {
      // 来源其他页面：从user模型取address数据
      // 未绑定数据且无传数据
      room.getUserRoomData((indexList) => {
        // 已绑定数据
        if (indexList && indexList.length > 0) {
          this.setData({
            indexList: indexList
          });
          this._loadData(true);
        } else {
          this._loadData();
        }
      });
    }
  },
  _loadData(setted) {
    room.getApartments((apartments) => {
      this.setData({
        apartmentList: apartments
      });
      // 绑定了宿舍或传了宿舍数据
      if (setted) {
        let nextIndex = this.data.indexList[0];
        this.setApartments(nextIndex, true);
      } else {
        this.setApartments(0);
      }
    });
  },
  setApartments(index, setted) {
    var id = this.data.apartmentList[index].dormid;
    room.getCompleteRoomDataList(id, index, (roomDataList) => {
      this.setData({
        buildList: roomDataList.build,
        aIndex: index
      });
      setted ? this.setBuild(this.data.indexList[1], true) :
        this.setBuild(0);
    });
  },
  setBuild(index, setted) {
    this.setData({
      floorList: this.data.buildList[index].floor,
      bIndex: index
    });
    setted ? this.setFloor(this.data.indexList[2], true) :
      this.setFloor(0);
  },
  setFloor(index, setted) {
    let roomList = this.data.floorList[index].room;
    this.setData({
      roomList: roomList,
      fIndex: index
    });
    let rIndex = this.data.indexList[3];
    if (setted && rIndex) {
      console.log(rIndex);
      this.setRoom(rIndex, true);
    } else {
      this.setRoom(0);
    }
  },
  setRoom(index, setted) {
    let currentRoom = this.data.roomList[index];
    let fiveList;
    if (currentRoom) {
      fiveList = currentRoom.next_room;
    } else {
      fiveList = [];
    }
    this.setData({
      rIndex: index,
      fiveList: fiveList
    });
    let fiveIndex = this.data.indexList[4];
    if (setted && fiveIndex) {
      this.setFive(fiveIndex);
    } else {
      this.setFive(0);
    }
  },
  setFive(index) {
    this.setData({
      fiveIndex: index
    });
  },
  changeApartment(e) {
    this.setApartments(room.getPickerValue(e));
  },
  changeBuild(e) {
    this.setBuild(room.getPickerValue(e));
  },
  changeFloor(e) {
    this.setFloor(room.getPickerValue(e));
  },
  changeRoom(e) {
    this.setRoom(room.getPickerValue(e));
  },
  changeFive(e) {
    this.setFive(room.getPickerValue(e));
  },
  onSubmit() {
    let dormidList = this.getDormidList();
    room.saveAddress(dormidList, (res) => {
      // 保存后返回来源页面
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 3000,
        complete: () => {
          if (this.data.comeFrom == 'df') {
            wx.navigateTo({
              url: '/pages/index/df/df',
            })
          } else {
            wx.navigateBack()
          }
        }
      });
    });
  },
  /**
   * 根据各index，和list获取dormidList
   */
  getDormidList() {
    let dormidList = [
      this.data.apartmentList[this.data.aIndex].dormid,
      this.data.buildList[this.data.bIndex].dormid,
      this.data.floorList[this.data.fIndex].dormid,
    ];
    let roomList = this.data.roomList;
    let fiveList = this.data.fiveList;
    if (roomList && roomList.length > 0) {
      dormidList.push(roomList[this.data.rIndex].dormid);
    }
    if (fiveList && fiveList.length > 0) {
      dormidList.push(fiveList[this.data.fiveIndex].dormid);
    }
    return dormidList;
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