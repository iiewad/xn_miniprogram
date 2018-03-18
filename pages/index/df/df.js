// pages/index/df/df.js
Page({
  data: {
    apartmentList: {},
    buildList: {},
    floorList: {},
    roomList: {},
    currentApart: {},
    currentBuild: {},
    currentFloor: {},
    currentRoom: {},
    currentDate: {
      year: '',
      month: ''
    }
  },
  openSuccess: function () {
    wx.navigateTo({
      url: 'msg_success'
    });
  },
  setQuery(query, queryType) {
    if (queryType == 'energyQuery') {
      wx.setStorageSync('energyQuery', query);
      this.getDf('surplusQuery');
      return;
    } else if ( (queryType == 'surplusQuery') && (wx.getStorageSync('surplusQuery') == "") ) {
      wx.setStorageSync('surplusQuery', query)
    }
    this.openSuccess();
  },
  getDf: function (e) {
    wx.showToast({
      title: '稍等片刻',
      icon: 'loading',
      duration: 3000
    });

    var userInfo = wx.getStorageSync('stu_userinfo');
    var params = {};
    params.userId = userInfo.cardcode;
    params.Room = this.data.currentRoom.dormid;
    params.Time = this.data.currentDate.year + '-' + this.data.currentDate.month;
    if (e == "surplusQuery") {
      params.QueryType = e;
    } else {
      params.QueryType = e.currentTarget.dataset.params
    }
    wx.request({
      url: 'http://hunau.club/api/get_energy_query',
      data: {
        userId: params.userId,
        Room: params.Room,
        Time: params.Time,
        queryType: params.QueryType
      },
      header: {
        "accept": "application/vnd.api+json;version=1",
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        this.setQuery(res.data.data, params.QueryType);
        return true;
      }
    });
  },
  bindDateChange: function (e) {
    console.log(e);
    var date = new Date(e.detail.value);
    this.setData({
      currentDate: {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    });
  },
  bindApartmentChange: function (e) {
    this.setData({
      currentApart: this.data.apartmentList[e.detail.value]
    })
    this.getRoomList(this.data.apartmentList[e.detail.value].dormid, 'build');

  },
  bindBuildChange: function (e) {
    this.setData({
      currentBuild: this.data.buildList[e.detail.value]
    });
    this.getRoomList(this.data.buildList[e.detail.value].dormid, 'floor');
  },
  bindFloorChange: function (e) {
    this.setData({
      currentFloor: this.data.floorList[e.detail.value]
    });
    this.getRoomList(this.data.floorList[e.detail.value].dormid, 'room');
  },
  bindRoomChange: function (e) {
    this.setData({
      currentRoom: this.data.roomList[e.detail.value]
    });
  },
  setRoomList: function (roomList, addressType) {
    if (addressType == 'apartment') {
      this.setData({
        apartmentList: roomList,
        currentApart: roomList[0]
      });
      this.getRoomList(this.data.currentApart.dormid, 'build');
    } else if (addressType == 'build') {
      this.setData({
        buildList: roomList,
        currentBuild: roomList[0]
      });
      this.getRoomList(this.data.currentBuild.dormid, 'floor');
    } else if (addressType == 'floor') {
      this.setData({
        floorList: roomList,
        currentFloor: roomList[0]
      });
      this.getRoomList(this.data.currentFloor.dormid, 'room');
    } else if (addressType == 'room') {
      if (roomList == '') {
        return;
      }
      this.setData({
        roomList: roomList,
        currentRoom: roomList[0]
      });
    }
  },
  getRoomList: function (priDormId, addressType) {
    wx.request({
      url: 'http://hunau.club/api/get_rooms?priDormId=' + priDormId,
      header: {
        "accept": "application/vnd.api+json;version=1",
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        this.setRoomList(res.data.roomList, addressType);
        return true;
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var priDormId = '';
    this.getRoomList(priDormId, 'apartment');
    var currentDate = new Date;

    this.setData({
      currentDate: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showToast({
      title: '正在拼命加载',
      icon: 'loading',
      duration: 3000
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})