
import { Room } from '../../../utils/room.js';
var room = new Room();

Page({
  data: {
    // 宿舍数据
    apartmentList: [],
    buildList: [],
    floorList: [],
    roomList: [],
    aIndex: 0,
    bIndex: 0,
    fIndex: 0,
    rIndex: 0,
    focus: [],
    loadingHidden: 1,
  },
  onLoad: function (options) {
    this._loadData();
  },
  _loadData() {
    room.getApartments((apartments) => {
      this.setData({
        apartmentList: apartments
      });
      this.setApartments(0);
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
  setApartments(index) {
    var aID = this.data.apartmentList[index].dormid;
    room.getCompleteRoomDataList(aID, index, (roomDataList) => {
      this.setData({
        buildList: roomDataList.build,
        aIndex: index
      });
      this.setBuild(0);
    });
  },
  setBuild(index) {
    this.setData({
      floorList: this.data.buildList[index].floor,
      bIndex: index
    });
    this.setFloor(0);
  },
  setFloor(index) {
    this.setData({
      roomList: this.data.floorList[index].room,
      fIndex: index
    });
    this.setRoom(0);
  },
  setRoom(index) {
    this.setData({
      rIndex: index
    });
  },
  onSubmit() {
    // 测试无房间号的数据
    var room = this.data.roomList[this.data.rIndex];
    if (!room) {
      room = this.data.floorList[this.data.fIndex];
    }
    room.submitAddress();
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