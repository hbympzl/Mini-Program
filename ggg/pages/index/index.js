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
  //加一后存储到缓存中
  addition: function(e) {
    var that = this;
    var todayScore = wx.getStorageSync('today_score');
    var addScore = todayScore + 1;
    that.allScore('score', addScore);
    wx.setStorageSync('today_score', addScore);
  },
  //减一后存储到缓存中
  subtraction: function(e) {
    var that = this;
    var todayScore = wx.getStorageSync('today_score');
    var subScore = todayScore - 1;
    that.allScore('score', subScore);
    wx.setStorageSync('today_score', subScore);
  },
  //初始加载项
  onLoad: function() {
    //创建缓存
    var that = this;
    that.initCache('today_score');
    that.initCache('total_score');
    var todayScore = wx.getStorageSync('today_score');
    that.allScore('score', todayScore);
    var totalScore = wx.getStorageSync('total_score');
    that.allScore('total_score', totalScore);
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    //计时器每隔一段时间进行时间确认
    var interval = setInterval(function() {
      time = util.formatTime(new Date());
      that.timeGoesBy(time)
      if (time.substring(11, 20) == '00:00:00') {
        //if(false){
        //每天12点的时候进行数据上传,直接上传到缓存当中
        //取出缓存
        totalScore = wx.getStorageSync("total_score");
        todayScore = wx.getStorageSync('today_score');
        //缓存与现有数据相加
        wx.setStorageSync('total_score', totalScore + todayScore);
        totalScore = wx.getStorageSync("total_score");
        that.allScore('total_score', totalScore);
        wx.setStorageSync('today_score', 0);
        that.allScore('score', 0);
      }
    }, 1000)
  },
  timeGoesBy: function(e) {
    var that = this;
    that.allScore('now_time', e);
  },
  //设置页面参数的公共方法
  allScore: function(key, value) {
    this.setData({
      [key]: value
    })
  },
  initCache: function(e) {
    var isExist = wx.getStorageSync(e);
    if (isExist == "") {
      wx.setStorage({
        key: e,
        data: 0,
      })
    }
  },
  synScore: function(e) {
    var that = this;
    if ((that.data.touchEnd - that.data.touchStart) >= 3000) {
      var totalScore = wx.getStorageSync('today_score');
      wx.setStorageSync('total_score', totalScore);
      this.onLoad();
    }
  },
  bindTouchStart: function(e) {
    var that = this;
    that.allScore('touchStart', e.timeStamp);
  },
  bindTouchEnd: function(e) {
    var that = this;
    that.allScore('touchEnd', e.timeStamp);

  },
  additionplus: function(e) {
    var that = this;
    var todayScore = wx.getStorageSync('today_score');
    var addScore = todayScore + 1;
    that.allScore('score', addScore);
    wx.setStorageSync('today_score', addScore);
    that.allScore('addFlag', 1);
    setTimeout(function() {
      if (that.data.addFlag == 1) {
        that.additionplus();
      }
    }, 50)
  },
  endAdditionplus: function(e) {
    var that = this;
    that.allScore('addFlag', 0);
  },
  subtractionplus: function(e) {
    var that = this;
    var todayScore = wx.getStorageSync('today_score');
    var subScore = todayScore - 1;
    that.allScore('score', subScore);
    wx.setStorageSync('today_score', subScore);
    that.allScore('subFlag', 1);
    setTimeout(function() {
      if (that.data.subFlag == 1) {
        that.subtractionplus();
      }
    }, 50)
  },
  endsubtractionplus: function(e) {
    var that = this;
    that.allScore('subFlag', 0);
  },
  onShow: function() {
    var that = this;
    console.log("切换到了index页面");
    var todayScore = wx.getStorageSync('today_score');
    that.allScore('score', todayScore);
    var totalScore = wx.getStorageSync('total_score');
    that.allScore('total_score', totalScore);
  }

})