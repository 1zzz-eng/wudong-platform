Page({
  data: { tab: 'r', list: [] },
  onLoad: function () { this.load(); },
  onT: function (e) { this.setData({ tab: e.currentTarget.dataset.t }); this.load(); },
  load: function () {
    var isFarm = this.data.tab === 'f';
    var m = isFarm ? [
      { id: 3, name: '苗家酸汤料包', desc: '500g/包，正宗苗家酸汤，家中也能做酸汤鱼', tags: ['乌东村产地', '保质期12个月'], price: 35, unit: '包', image: '../../image/40061b3fdbfe1d371ac2199698251e74.jpg' },
      { id: 4, name: '苗家腊肉', desc: '1kg/条，传统松枝熏制，土猪五花腊肉', tags: ['农户散养', '手工熏制'], price: 128, unit: '条', image: '../../image/c0357095e9da472fc5fefa97aea90bb4.jpg' },
      { id: 5, name: '苗家糯米酒', desc: '1L/瓶，苗家传统酿造，香甜醇厚', tags: ['传统工艺', '微醺佳品'], price: 68, unit: '瓶', image: '../../image/7b6779e88cba49d688a36ff63892a0ee.jpg' }
    ] : [
      { id: 1, name: '苗家长桌宴', desc: '苗族传统长桌宴，体验最地道的苗族饮食文化', tags: ['招牌酸汤鱼', '苗家特色', '可容纳80人'], price: 88, unit: '人', image: '../../image/7b6779e88cba49d688a36ff63892a0ee.jpg' },
      { id: 2, name: '梯田观景餐厅', desc: '坐拥千亩梯田美景，品尝地道苗家美食', tags: ['梯田景观', '农家菜', '早晨套餐'], price: 35, unit: '人', image: '../../image/a4b6057638b1d3c10a07e1242829062a.jpg' }
    ];
    this.setData({ list: m });
  }
});
