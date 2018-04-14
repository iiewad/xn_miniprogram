Page({
  data: {
    energyQuery: {},
    surplusQuery: {},
    warningHidden: 1,
  },
  onLoad: function (options) {
    var pages = getCurrentPages();
    var lastPage = pages[pages.length - 2];
    var energyQuery = lastPage.data.energyQuery;
    var surplusQuery = lastPage.data.surplusQuery;

    if (parseInt(surplusQuery.current_balance) < 10) {
      this.setData({
        warningHidden: 0
      });
    }

    this.setData({
      energyQuery: energyQuery,
      surplusQuery: surplusQuery,
    });
    return true;
  }
})