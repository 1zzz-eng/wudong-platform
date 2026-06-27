Page({
  data: { tab: 's', list: [] },
  onLoad: function () { this.load(); },
  onT: function (e) { this.setData({ tab: e.currentTarget.dataset.t }); this.load(); },
  load: function () {
    var m = this.data.tab === 'r' ? [
      { id: 1, name: '苗寨一日游（经典版）', desc: '深度游览西江千户苗寨，长桌宴+银饰坊+蜡染工坊体验', tags: ['1天', '含门票+午餐+导游'], price: 388, image: '../../image/cea73fd04e0b39c8f79b9223e533a9ea.jpg' },
      { id: 2, name: '苗寨梯田两日游（深度版）', desc: '千户苗寨+乌东梯田日出+苗族村寨探访', tags: ['2天1晚', '含住宿+餐饮+交通'], price: 888, image: '../../image/233b6939c4184cb77351e5652f111d36.jpg' }
    ] : [
      { id: 3, name: '西江千户苗寨', desc: '世界最大苗寨，感受浓郁苗族文化', tags: ['成人票 ¥100', '学生票 ¥50', '家庭套票 ¥220'], price: 100, image: '../../image/cea73fd04e0b39c8f79b9223e533a9ea.jpg' },
      { id: 4, name: '乌东梯田景区', desc: '千亩梯田景观，四季皆美，摄影爱好者的天堂', tags: ['成人票 ¥60', '摄影专票 ¥120', '全天开放'], price: 60, image: '../../image/233b6939c4184cb77351e5652f111d36.jpg' }
    ];
    this.setData({ list: m });
  }
});
