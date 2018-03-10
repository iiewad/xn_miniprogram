// pages/news/show_news/show_news.js
const app = getApp();

Page({

  data: {
    news: {}
  },
  setNews: function (news) {
    console.log('Start Set News Info');
    this.setData({
      news: news
    });

  },
  getNews: function (news_id) {
    wx.request({
      url: 'http://xnqn.lidawei.me/api/news/' + news_id,
      header: {
        "accept": "application/vnd.api+json;version=1",
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log("Got News Info")
        var news = {}
        news = res.data.data
        var contentStr = news.content;
        var imgReg = /<img.*?(?:>|\/>)/gi;
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = contentStr.match(imgReg);
        contentStr = contentStr.replace(/.UploadImage/g, "http://zsxy.hunau.edu.cn/UploadImage");
        news.content = contentStr;

        let news_content = app.towxml.toJson(news.content, 'markdown');
        news.content = news_content;
        this.setNews(news);
        return true;
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews(options.news_id);
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