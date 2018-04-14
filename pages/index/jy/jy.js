const app = getApp();
const util = require('../../../utils/util.js');

import { Book } from '../../../utils/book.js';
var book = new Book();

Page({
  data: {
    books: []
  },
  onLoad: function (options) {
    this._loadData();
  },
  _loadData() {
    book.getBorrowDataFromCache((books) => {
      this.setData({
        books: books
      })
    });
  },
})