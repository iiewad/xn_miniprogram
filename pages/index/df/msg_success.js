Page({
  data: {
    energyQuery: {},
    surplusQuery: {}
  },
  onLoad: function(options) {
    var pages = getCurrentPages();
    var lastPage = pages[pages.length -2 ];
    var energyQuery = lastPage.data.energyQuery;
    var surplusQuery = lastPage.data.surplusQuery;
    this.setData({
      energyQuery: energyQuery,
      surplusQuery: surplusQuery
    });
    return true;
  }
})