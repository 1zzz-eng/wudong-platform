Page({
  data: { list: [] },
  onLoad: function () { this.setData({ list: [
    { id: 1, name: '苗寨云端木屋', desc: '传统吊脚楼改造，坐拥云海日出，推开窗就是千亩梯田', tags: ['WiFi', '空调', '独立卫浴', '观景阳台'], price: 388, image: '../../image/1196398a4101347687e63ed06ee93bef.jpg' },
    { id: 2, name: '梯田人家客栈', desc: '百年苗寨老宅改造，体验最纯粹的苗族山居生活', tags: ['苗族特色', '农家早餐', 'WiFi', '田园风光'], price: 258, image: '../../image/32115ee982485549de7d6631b480c6c9.jpg' }
  ] }); }
});
