//index.js
//获取应用实例
const app = getApp();
var score = 0;
var total_score = 0;
var util = require('../../utils/util.js');
var time = util.formatTime(new Date());
// 再通过setData更改Page()里面的data，动态更新页面的数据
Page({
  data: {
    score: score
  },
  //初始加载项
  onLoad: function() {
    //创建缓存
    //下面要使用 this的时候对象已经改变,只能再此处用that把对象复制一次
    var that = this;
    that.initCache('today_time');
    that.initCache('total_score');
    //时间跨天进行更新
    if (wx.getStorageSync('today_time') == 0) {
      wx.setStorageSync('today_time', time);
    }
    var timeFlag = wx.getStorageSync('today_time');
    // 对比当前时间和数据库中today的存储时间
    if (timeFlag.substring(0, 10) != time.substring(0, 10)) {
      //取出缓存
      totalScore = wx.getStorageSync("total_score");
     var todayScore = wx.getStorageSync('today_score');
      //缓存与现有数据相加
      wx.setStorageSync('total_score', totalScore + todayScore);
      //调用组件中的方法进行积分清零
      that.selectComponent("#addbutton").clearScore();
    }
    //刷新timeflag 记录当前天的时间 后续与跨天后的比对
    timeFlag = util.formatTime(new Date());
    wx.setStorageSync('today_time', timeFlag);
    //将缓存中的数据显示在页面上
    var totalScore = wx.getStorageSync('total_score');
    that.allScore('total_score', totalScore);
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    //计时器每隔一段时间进行时间确认
    var interval = setInterval(function() {
      time = util.formatTime(new Date());
      that.timeGoesBy(time)
      if (time.substring(11, 20) == '00:01:50') {
     // if (true) {
        //每天12点的时候进行数据上传,直接上传到缓存当中
        //取出缓存
        totalScore = wx.getStorageSync("total_score");
        todayScore = wx.getStorageSync('today_score');
        //缓存与现有数据相加
        wx.setStorageSync('total_score', totalScore + todayScore);
        totalScore = wx.getStorageSync("total_score");
        that.allScore('total_score', totalScore);
         //调用组件中的方法进行积分清零
        that.selectComponent("#addbutton").clearScore();
      }
    }, 1000)
  },
  //计时器将时间显示在页面上
  timeGoesBy: function(e) {
    var that = this;
    that.allScore('now_time', e);
  },
  //初始化数据库的方法
  initCache: function(e) {
    var isExist = wx.getStorageSync(e);
    if (isExist == "") {
      wx.setStorage({
        key: e,
        data: 0,
      })
    }
  },
  //长按同步总数,将同步开始和结束的时间存储在data中,再取出来进行比对,实现长按时间同步效果
  synScore: function(e) {
    var that = this;
    if ((that.data.touchEnd - that.data.touchStart) >= 3000) {
      wx.vibrateLong({});
      var totalScore = wx.getStorageSync('today_score');
      wx.setStorageSync('total_score', totalScore);
      this.onLoad();
    }
  },
  //长按同步开始时间
  bindTouchStart: function(e) {
    var that = this;
    that.allScore('touchStart', e.timeStamp);
  },
  //长按同步结束时间
  bindTouchEnd: function(e) {
    var that = this;
    that.allScore('touchEnd', e.timeStamp);

  },
  //切换到该页面时触发页面监听事件
  onShow: function() {
    var that = this;
    var todayScore = wx.getStorageSync('today_score');
    that.allScore('score', todayScore);
    var totalScore = wx.getStorageSync('total_score');
    that.allScore('total_score', totalScore);
  },
  //设置data参数的公共方法
  allScore: function(key, value) {
    this.setData({
      [key]: value
    })
  },

})