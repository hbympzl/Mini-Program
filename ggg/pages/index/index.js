// ============================数据库相关===================================
//初始化环境
wx.cloud.init({
  env: 'hbympzl',
  traceUser: true
})
// 实例化数据库
const db = wx.cloud.database({});
//获取用户信息
wx.getSetting({
  success: function(res) {
    //console.log(res.authSetting['scope.userInfo'])
    if (res.authSetting['scope.userInfo']) {
      wx.getUserInfo({
        success: function(res) {
          wx.setStorageSync('userMsg', res.userInfo);
        }
      })
    }
  }
})

// ============================数据库相关===================================

//获取应用实例
const app = getApp();
var score = 0;
var total_score = 0;
var util = require('../../utils/util.js');
var time = util.formatTime(new Date());

const APP_ID = 'wx3069ac87ca3327d6'; //输入小程序appid  
const APP_SECRET = 'd20a5c1102099638bf930f36b95602c8'; //输入小程序app_secret  
var OPEN_ID = '' //储存获取到openid  
var SESSION_KEY = '' //储存获取到session_key 

// 再通过setData更改Page()里面的data，动态更新页面的数据
Page({

  //获取用户唯一id和session
  getOpenIdTap: function() {
    var that = this;
    wx.login({
      success: function(res) {
        wx.request({
          //获取openid接口  
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function(res) {
            OPEN_ID = res.data.openid; //获取到的openid  
            SESSION_KEY = res.data.session_key; //获取到session_key 
            wx.setStorageSync('open_id', OPEN_ID);
            wx.setStorageSync('seesion_key', SESSION_KEY);
          }
        })
      }
    })
  },

  //获取数据库中参数的方法
  getDbdata: function() {
    var that = this;
    that.getOpenIdTap();
    var dbscore = db.collection("score");
    OPEN_ID = wx.getStorageSync("open_id");
    dbscore.where({
      _openid: OPEN_ID
    }).get({
      success: function(res) {
        var user = wx.getStorageSync('userMsg');
        //为空的时候往数据库添加当前操作人的open_id和其他信息
        if (res.data.length == 0) {
          db.collection('score').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              _username: user.nickName,
              _city: user.city,
              _today_score: 0,
              _total_score: 0
            },
            success: function(res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              if (res.errMsg == "collection.add:ok"){
                console.log("数据返回成功!")
              }
            }
          })
        }
      }
    })
  },
  updateDbdata: function() {
    var that = this;
    that.getOpenIdTap();
    var dbscore = db.collection("score");
    OPEN_ID = wx.getStorageSync("open_id");
    dbscore.where({
      _openid: OPEN_ID
    }).get({
      success: function(res) {
        console.log(res.data[0]._id);
        var todo = db.collection('score').doc;
        console.log(todo);
        // db.collection('score').doc('todo-identifiant-aleatoire').update({
        //   // data 传入需要局部更新的数据
        //   data: {
        //     // 表示将 done 字段置为 true
        //     done: true
        //   },
        //   success: function(res) {
        //     console.log(res.data)
        //   }
        // })
      }
    })


  },
  //===============================================================
  data: {
    score: score
  },
  //初始加载项
  onLoad: function() {
    //创建缓存
    //下面要使用 this的时候对象已经改变,只能再此处用that把对象复制一次
    var that = this;
  //  that.getDbdata();
    that.updateDbdata();
    //调用组件缓存
    that.selectComponent("#addbutton").initTodayStorage();
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
      var todayScore = that.selectComponent("#addbutton").getTodayStorage();;
      //缓存与现有数据相加
      wx.setStorageSync('total_score', totalScore + todayScore);
      //调用组件中的方法进行积分清零
      that.selectComponent("#addbutton").clearTodayScore();
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
      if (time.substring(11, 20) == '08:32:10') {
        // if (true) {
        //每天12点的时候进行数据上传,直接上传到缓存当中
        //取出缓存
        totalScore = wx.getStorageSync("total_score");
        todayScore = that.selectComponent("#addbutton").getTodayStorage();
        //缓存与现有数据相加
        wx.setStorageSync('total_score', totalScore + todayScore);
        totalScore = wx.getStorageSync("total_score");
        that.allScore('total_score', totalScore);
        //调用组件中的方法进行积分清零
        that.selectComponent("#addbutton").clearTodayScore();
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
      var todayScore = that.selectComponent("#addbutton").getTodayStorage();
      wx.setStorageSync('total_score', todayScore);
      that.selectComponent("#addbutton").clearTodayScore();
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
    var todayScore = that.selectComponent("#addbutton").getTodayStorage();
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