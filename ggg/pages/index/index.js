// ============================数据库相关===================================
//初始化环境
wx.cloud.init({
  env: 'hbympzl',
  traceUser: true
})
// 实例化数据库
const db = wx.cloud.database({});
// ============================数据库相关===================================

//获取应用实例
const app = getApp();
var score = 0;
var total_score = 0;
var util = require('../../utils/util.js');
var dbUtil = require('../../utils/dbUtil.js');

var time = util.formatTime(new Date());

// 再通过setData更改Page()里面的data，动态更新页面的数据
Page({
  //获取登录信息
  onGotUserInfo: function (e) {
    console.log("获取用户信息");
    console.log(e.detail)
    if (e.detail.errMsg == 'getUserInfo:ok'){
      wx.setStorageSync('userMsg', e.detail.userInfo);
      this.setData({
        hasUserInfo: true
      })
    }
    this.onLoad();
  },

  data: {
    score: score,
    hasUserInfo:false
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    that.onLoad();    
    that.onShow();    
    wx.stopPullDownRefresh();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();

  },

  //初始加载项
  onLoad: function() {
    console.log("onLoad方法")
    //创建缓存
    //下面要使用 this的时候对象已经改变,只能再此处用that把对象复制一次
    var that = this;
    //验证登录信息是否存在
    var user = wx.getStorageSync('userMsg');
    if (user != "") {
      this.setData({
        hasUserInfo: true
      })
    } else if (user == "") {
      console.log("没有用户信息!");
      return;                                                                                                                       
    }
    //调用组件缓存
    that.selectComponent("#addbutton").initTodayStorage();
    that.initCache('today_time');
    that.initCache('total_score');
    // //数据库中参数存入到缓存
    // that.getDbdata();
    //时间跨天进行更新
    if (wx.getStorageSync('today_time') == 0) {
      wx.setStorageSync('today_time', time);
    }
    var timeFlag = wx.getStorageSync('today_time');
    // 对比当前时间和数据库中today的存储时间
    if (timeFlag.substring(0, 10) != time.substring(0, 10)) {
      //取出缓存
      dbUtil.getDbdata();
      totalScore = wx.getStorageSync("total_score");
      var todayScore = that.selectComponent("#addbutton").getTodayStorage();;
      //缓存与现有数据相加
      wx.setStorageSync('total_score', totalScore + todayScore);
      //更新数据库
      dbUtil.updateDbdata(totalScore + todayScore);
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
      if (time.substring(11, 20) == '00:00:00') {
        // if (true) {
        //每天12点的时候进行数据上传,直接上传到缓存当中
        //取出缓存
        dbUtil.getDbdata();
        todayScore = that.selectComponent("#addbutton").getTodayStorage();
        //缓存与现有数据相加
        totalScore = wx.getStorageSync("total_score");
        console.log(totalScore+"缓存")
        wx.setStorageSync('total_score', totalScore + todayScore);
        totalScore = wx.getStorageSync("total_score");
        dbUtil.updateDbdata(totalScore);
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
  //初始化缓存的方法
  initCache: function(e) {
    //先查数据库
    //再存入缓存
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
      //更新数据库
      dbUtil.updateDbdata(todayScore);
      that.selectComponent("#addbutton").clearTodayScore();
      that.setData({
        total_score: todayScore
      })
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
     dbUtil.getDbdata();
    //切换到这个页面的时候 因为是操作的缓存 所以只能先让数据库的优先级低于缓存,后续将兑换礼品页面也连接到数据库之后就可以直接进行数据库操作,将数据库数据的优先级提到最优先.
    console.log("onShow方法");
    var that = this;
    //验证登录信息是否存在
    var user = wx.getStorageSync('userMsg');
    if (user != "") {
      this.setData({
        hasUserInfo: true
      })
    } else if (user == "") {
      console.log("没有用户信息!");
      return;
    }
    var todayScore = that.selectComponent("#addbutton").getTodayStorage();
    that.allScore('score', todayScore);
    //数据库中的总分设置到缓存中
    dbUtil.getDbdata();
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
