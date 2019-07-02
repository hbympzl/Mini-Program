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
  addition: function (e) {
    var todayScore = wx.getStorageSync('today_score');
    var addScore = todayScore + 1;
     this.setData({
       score: addScore
     })
    wx.setStorageSync('today_score', addScore);
  },
    //减一后存储到缓存中
  subtraction: function (e) {
    var todayScore = wx.getStorageSync('today_score');
    var subScore = todayScore - 1;
    console.log(subScore);
    this.setData({
      score: subScore
    })
    wx.setStorageSync('today_score', subScore);
  },
  //初始加载项
  onLoad: function () {
    //创建缓存
    var that = this; 
    that.initCache('today_score');
    that.initCache('total_score');
    var todayScore = wx.getStorageSync('today_score');
    this.setData({
      score: todayScore
    })  
    var totalScore = wx.getStorageSync('total_score');
    that.allScore(totalScore);
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    //计时器每隔一段时间进行时间确认
    var interval = setInterval(function () {
      time = util.formatTime(new Date());
      that.timeGoesBy(time)
      //if (time.substring(11, 20) == '00:00:00') {
      if(false){
        //每天12点的时候进行数据上传,直接上传到缓存当中
        //取出缓存
        totalScore = wx.getStorageSync("total_score");
        todayScore = wx.getStorageSync('today_score');
        //缓存与现有数据相加
        wx.setStorageSync('total_score', totalScore+todayScore);
        totalScore = wx.getStorageSync("total_score");
        that.allScore(totalScore);
        wx.setStorageSync('today_score', 0);
        that.setData({
          score: 0
        }) 
      }
    }, 1000)
  },
  timeGoesBy: function(e){
    this.setData({
     now_time:e
    })
  },
  allScore:function(e){
    this.setData({
      total_score:e
    })
  },
  initCache:function(e){
    var isExist = wx.getStorageSync(e);
    if (isExist == ""){
      wx.setStorage({
        key: e,
        data: 0,
      })
    }
  },
  synScore:function(e){
    var that = this;
    if((that.data.touchEnd-that.data.touchStart)>= 3000){
      var totalScore = wx.getStorageSync('today_score');
      wx.setStorageSync('total_score', totalScore);
      this.onLoad();
    }
  },
  bindTouchStart: function (e) {
    var that = this;
    that.setData({
      touchStart: e.timeStamp
    })  
  },
  bindTouchEnd: function (e) {
    var that = this;
    that.setData({
      touchEnd: e.timeStamp
    })  
  },
  additionplus:function(e){
    var that = this;
    var todayScore = wx.getStorageSync('today_score');
    var addScore = todayScore + 1;
    this.setData({
      score: addScore
    })
    wx.setStorageSync('today_score', addScore);
    that.setData({
      addFlag:1
    }) 
    setTimeout(function () {
        if(that.data.addFlag == 1){
            that.additionplus();
        }
    }, 50)
 },
  endAdditionplus:function(e){
    var that = this;
    that.setData({
      addFlag:0
    })
  },
  subtractionplus: function (e) {
    var that = this;
    var todayScore = wx.getStorageSync('today_score');
    var subScore = todayScore - 1;
    this.setData({
      score: subScore
    })
    wx.setStorageSync('today_score', subScore);
    that.setData({
      subFlag: 1
    })
    setTimeout(function () {
      if (that.data.subFlag == 1) {
        that.subtractionplus();
      }
    }, 50)
  },
  endsubtractionplus: function (e) {
    var that = this;
    that.setData({
      subFlag: 0
    })
  }

})
 