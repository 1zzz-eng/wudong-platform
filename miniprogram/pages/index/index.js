Page({
  data: { keyword: '', list: [], loading: false },
  onLoad: function () { this.setData({ list: this.getMock() }); },
  onPullDownRefresh: function () { this.setData({ list: this.getMock() }); wx.stopPullDownRefresh(); },
  onK: function (e) { this.setData({ keyword: e.detail.value }); },
  onSearch: function () { var t = this; var m = t.getMock(); if (t.data.keyword) { m = m.filter(function (i) { return i.title.indexOf(t.data.keyword) !== -1; }); } t.setData({ list: m }); },
  getMock: function () { return [
    { id: 1, title: '苗族手工银饰蝴蝶项链', price: 288, sales: 1236, image: '../../image/0ee0ca7b2487928fd6c7f2aba9f649ae.jpg' },
    { id: 2, title: '手工蜡染蓝白围巾天然染色', price: 168, sales: 892, image: '../../image/5f1075f2af06c66fa7abea4e8ae896f5.jpg' },
    { id: 3, title: '苗绣花开富贵挂画装饰', price: 598, sales: 567, image: '../../image/97e05e6f2c5ab007a0162592de3d96c6.jpg' },
    { id: 4, title: '苗族传统手工百褶裙女款', price: 398, sales: 1532, image: '../../image/44af1d9758e24c9a5b83c6c7719b5de0.jpg' },
    { id: 5, title: '银饰錾刻手镯女款非遗传承', price: 456, sales: 321, image: '../../image/253dd326dc62f94085beb96a9e2e4cff.jpg' },
    { id: 6, title: '蜡染民族风手提包文艺范', price: 238, sales: 1023, image: '../../image/ecbdfcd212ad7d33dc6146281500fa37.jpg' }
  ]; },
  goD: function (e) { wx.navigateTo({ url: '/pages/clothing/clothing?id=' + e.currentTarget.dataset.id }); },
  go: function (e) { var u = e.currentTarget.dataset.u; wx.switchTab({ url: u, fail: function () { wx.navigateTo({ url: u }); } }); }
});
