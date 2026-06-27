Page({
  data: { list: [], ac: '', kw: '', loading: false },
  onLoad: function () { this.setData({ list: this.getMock() }); },
  onPullDownRefresh: function () { this.setData({ list: this.getMock() }); wx.stopPullDownRefresh(); },
  onK: function (e) { this.setData({ kw: e.detail.value }); },
  onS: function () { var t = this; var m = t.getMock(); if (t.data.kw) m = m.filter(function (i) { return i.name.indexOf(t.data.kw) !== -1; }); if (t.data.ac) m = m.filter(function (i) { return i.cat === t.data.ac; }); t.setData({ list: m }); },
  onC: function (e) { this.setData({ ac: e.currentTarget.dataset.c }); var m = this.getMock(); if (this.data.ac) m = m.filter(function (i) { return i.cat === this.data.ac; }.bind(this)); this.setData({ list: m }); },
  getMock: function () { return [
    { id: 1, cat: '1', name: '苗族手工银饰蝴蝶项链', price: 288, sales: 1236, image: '../../image/0ee0ca7b2487928fd6c7f2aba9f649ae.jpg' },
    { id: 2, cat: '2', name: '手工蜡染蓝白围巾', price: 168, sales: 892, image: '../../image/5f1075f2af06c66fa7abea4e8ae896f5.jpg' },
    { id: 3, cat: '3', name: '苗绣花开富贵挂画', price: 598, sales: 567, image: '../../image/97e05e6f2c5ab007a0162592de3d96c6.jpg' },
    { id: 4, cat: '4', name: '苗族传统百褶裙', price: 398, sales: 1532, image: '../../image/44af1d9758e24c9a5b83c6c7719b5de0.jpg' },
    { id: 5, cat: '1', name: '银饰錾刻手镯', price: 456, sales: 321, image: '../../image/253dd326dc62f94085beb96a9e2e4cff.jpg' },
    { id: 6, cat: '2', name: '蜡染民族风手提包', price: 238, sales: 1023, image: '../../image/ecbdfcd212ad7d33dc6146281500fa37.jpg' }
  ]; }
});
