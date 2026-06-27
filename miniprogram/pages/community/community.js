Page({
  data: { list: [] },
  onLoad: function () { this.setData({ list: [
    { id: 1, title: '第一次来到西江千户苗寨，太震撼了！', desc: '清晨薄雾中，千户苗寨的吊脚楼层层叠叠排列在山坡上，像一幅水墨画。苗族阿妹穿着百褶裙走过，银饰叮当作响。', likes: 128, comments: 12, views: 1520, image: '../../image/cea73fd04e0b39c8f79b9223e533a9ea.jpg' },
    { id: 2, title: '苗家长桌宴，难忘的美食体验！', desc: '第一次体验苗族长桌宴，酸汤鱼的味道至今回味无穷。苗族阿妈们热情好客，不停夹菜倒酒，淳朴的人情味令人难忘。', likes: 89, comments: 8, views: 980, image: '../../image/7b6779e88cba49d688a36ff63892a0ee.jpg' },
    { id: 3, title: '住在云端的苗寨木屋', desc: '推开窗就是千亩梯田和云海日出，苗族木屋散发着淡淡的木香，夜晚听着虫鸣入睡，回到了最原始的生活状态。', likes: 256, comments: 34, views: 3200, image: '../../image/1196398a4101347687e63ed06ee93bef.jpg' }
  ] }); }
});
