/*组件的参数和方法需要写到Component中*/
Component({
  //配置参数
  properties: {
    score: {
      type: Number,
      value: wx.getStorageSync('today_score')
    }
  },
  methods: {
    /***********************内置方法****************************/
    /***页面初加载***/
    onLoad: function() {
      //创建缓存
      //下面要使用 this的时候对象已经改变,只能再此处用that把对象复制一次
      var that = this;
      that.initCache('today_score');
      //将缓存中的数据显示在页面上
      var todayScore = wx.getStorageSync('today_score');
      that.allScore('score', todayScore);
    },
    //对数字的增加和减少无论什么方式都是对storage缓存进行操作,以达到数据同步的目的
    /***点击增加按钮的方法***/
    addition: function(e) {
      wx.vibrateShort({});
      var that = this;
      //拿出缓存进行操作
      var todayScore = wx.getStorageSync('today_score');
      var addScore = todayScore + 1;
      //增加后添加到data缓存中,在页面上显示
      that.allScore('score', addScore);
      //增加后再重新存到缓存中
      wx.setStorageSync('today_score', addScore);
    },
    /***点击减少的方法***/
    subtraction: function(e) {
      wx.vibrateShort({});
      var that = this;
      //拿出缓存进行操作
      var todayScore = wx.getStorageSync('today_score');
      var subScore = todayScore - 1;
      //减少后添加到data缓存中,在页面上显示
      that.allScore('score', subScore);
      //减少后再重新存到缓存中
      wx.setStorageSync('today_score', subScore);
    },
    /***快速加方法,bindlongtap事件,进行递归方法调用,
     * 设置一个时间间隔进行不断的调用,不断的添加,
     * 设置一个flag存储在data中,触发松开事件的时候将flag的值改变,
     * 终止递归***/
    additionplus: function(e) {
      wx.vibrateShort({});
      var that = this;
      var todayScore = wx.getStorageSync('today_score');
      var addScore = todayScore + 1;
      that.allScore('score', addScore);
      wx.setStorageSync('today_score', addScore);
      //添加一个flag,每一次递归的时候都判断该flag是否改变,未变化则继续递归
      that.allScore('plusFlag', 1);
      setTimeout(function() {
        if (that.data.plusFlag == 1) {
          that.additionplus();
        }
      }, 50)
    },

    /***结束快速增***/
    endAdditionplus: function(e) {
      var that = this;
      //改变data中的plusFlag 跳出新增递归
      that.allScore('plusFlag', 0);
    },
    /***原理同快速加***/
    subtractionplus: function(e) {
      wx.vibrateShort({});
      var that = this;
      var todayScore = wx.getStorageSync('today_score');
      var subScore = todayScore - 1;
      that.allScore('score', subScore);
      wx.setStorageSync('today_score', subScore);
      that.allScore('plusFlag', 1);
      setTimeout(function() {
        if (that.data.plusFlag == 1) {
          that.subtractionplus();
        }
      }, 50)
    },
    /***结束快速减少事件***/
    endsubtractionplus: function(e) {
      var that = this;
      that.allScore('plusFlag', 0);
    },
    //设置data参数的公共方法
    allScore: function(key, value) {
      this.setData({
        [key]: value
      })
    },
    /***初始化数据库的方法***/
    initCache: function(e) {
      var isExist = wx.getStorageSync(e);
      if (isExist == "") {
        wx.setStorage({
          key: e,
          data: 0,
        })
      }
    },
    /***********************供外部进行调用的方法****************************/
   /***清空数据缓存并刷新页面***/
    clearScore: function() {
      var that = this;
      wx.setStorageSync('today_score', 0);
      that.onLoad();
    },
  },
})