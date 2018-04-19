// pages/news/news.js
const app = getApp()

Page({
  data: {
    news_list: {},
    news_page: {}
  },
  tapShowNews: function (e) {
    wx.navigateTo({
      url: 'show_news/show_news?news_id=' + e.currentTarget.id
    })
  },
  upper: function(e) {
    return false;
  },
  lower: function (e) {
    if (this.data.news_page.current_page <= this.data.news_page.total_pages){
      this.getNewsInfo(this.data.news_page.current_page + 1);
    }else {
      return false;
    }
  },
  setNewsInfo: function (news) {
    console.log('Start Set News Data')
    if (Object.keys(this.data.news_list).length === 0 && Object.keys(this.data.news_page).length == 0) {
      this.setData({
        news_list: news.news_list,
        news_page: news.pages
      })
    } else {
      this.setData({
        news_list: this.data.news_list.concat(news.news_list),
        news_page: news.pages
      })
    }
    
  },
  getNewsInfo: function (current_page = 1) {
    console.log('Get News Info Start')
    wx.request({
      url: app.globalData.url + '/api/news' + '?page=' + current_page,
      header: {
        "accept": "application/vnd.api+json;version=1",
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        var news = {};
        news.pages = res.data.data.page;
        news.news_list = res.data.data.news;
        /*news.news_list.forEach((item) => {
          if(item.title.length > 17)
          {item.title = item.title.substring(0, 16) + '...';}
        });*/
        this.setNewsInfo(news);
        return true;
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getNewsInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})