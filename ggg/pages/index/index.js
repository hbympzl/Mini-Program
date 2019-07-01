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
     this.setData({
       score:score = score + 1
     })
  },
  subtraction: function (e) {
    this.setData({
     score: score =  score - 1
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
    })
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    //计时器每隔一段时间进行时间确认
    var interval = setInterval(function () {
      time = util.formatTime(new Date());
      that.timeGoesBy(time)
      if (time.substring(11, 20) == '16:58:00') {
        //每天12点的时候进行数据上传,直接上传到缓存当中
        //取出缓存
        var storageScore = 0;
        wx.getStorage({
          key: 'total_score',
          success: function (res) {
            storageScore = res.data
          },
        })
        //缓存与现有数据相加
        console.log(score)
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
  }

})
