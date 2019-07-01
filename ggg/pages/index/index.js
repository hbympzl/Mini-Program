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
    score: score,
    total_score:total_score,
    now_time:time
  },
  addition: function (e) {
    score = score + 1
    wx.setStorage({
      key: 'today_score',
      data: score,
    })
     this.setData({
       score: score
     })
  },
  subtraction: function (e) {
    score = score - 1
    wx.setStorage({
      key: 'today_score',
      data: score,
    })
    this.setData({
      score: score
    })
  },
  onLoad: function () {  
    var that = this; 
    wx.getStorage({
      key: 'total_score',
      success: function (res) {
          total_score = res.data;
          that.allScore(total_score);
      },
    });
    wx.getStorage({
      key: 'today_score',
      success: function(res) {
        score = res.data;
        that.todayScore(score)
      },
    })
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    //计时器每隔一段时间进行时间确认
    var interval = setInterval(function () {
      time = util.formatTime(new Date());
      that.timeGoesBy(time)
      //if (time.substring(11, 20) == '00:00:00') {
      if(true){
        //每天12点的时候进行数据上传,直接上传到缓存当中
        //取出缓存
        var storageScore = 0;
        wx.getStorage({
          key: 'total_score',
          success: function (res) {
            console.log(res.data)
            global.storageScore = res.data
            console.log(global.storageScore)
          },
        })
        //第一个参数undefined
        console.log(global.storageScore)
        //缓存与现有数据相加
        wx.setStorage({
          key: 'total_score',
          data: score = score + storageScore,
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
  todayScore: function (e) {
    this.setData({
      score: e
    })
  }

})
