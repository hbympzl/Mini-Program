// pages/reward/reward.js
// ============================数据库相关===================================
//初始化环境
wx.cloud.init({
  env: 'hbympzl',
  traceUser: true
})

// 实例化数据库
const db = wx.cloud.database({});
const APP_ID = 'wx3069ac87ca3327d6'; //输入小程序appid  
const APP_SECRET = 'd20a5c1102099638bf930f36b95602c8'; //输入小程序app_secret  
var OPEN_ID = '' //储存获取到openid  
var SESSION_KEY = '' //储存获取到session_key 
// ============================数据库相关===================================
//获取其他页面的实例
var dbUtil = require('../../utils/dbUtil.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //奖品池
  },
  onLoad: function () {
    var that = this;
    that.initGoods();
  },
  onShow:function(){
    var that = this;
    console.log("onShow");
    that.initGoods();

  },
  initGoods: function () {
    var that = this;
    console.log("initGoods")
    that.allScore('whatwewant', false);
    var dbgoods = db.collection("goods");
    OPEN_ID = wx.getStorageSync("open_id");
    if (OPEN_ID != "") {
      var goodsList = [];
      dbgoods.where({
        _openid: OPEN_ID
      }).get({
        success: res => {
          var goods_url = res.data[0]._goods_url;
        //  console.log(goods_url)
        //  var list = [];
        //  list.add(goods_url);
          wx.cloud.getTempFileURL({
            fileList: ['cloud://hbympzl.6862-hbympzl-1259586624/ns.jpg'],
            success: resTempFileURL => {
              var goods = {
                name: res.data[0]._goods_name,
                score: res.data[0]._goods_score,
                imagePath: resTempFileURL.fileList[0].tempFileURL,
                id: res.data[0]._id
              };
              goodsList.push(goods);
              this.setData({
                whatwewant: goodsList,
              })
            },
            fail: console.error
          })
        
        }
      })
    }

  },
  //点击兑换事件
  exchangeGoods: function (e) {
    //验证登录信息是否存在
    var user = wx.getStorageSync('userMsg');
    if (user != "") {
      this.setData({
        hasUserInfo: true
      })
    } else if (user == "") {
      wx.showToast({
        title: '请先登录!',
        image: '/images/goods/exchanged.png'
      })
      return;
    }
    var exchangeId = e.currentTarget.dataset.whatwewantId;
    var totalScore = wx.getStorageSync("total_score");
    var that = this;
    var goods = that.data.whatwewant;
    //循环判断指定id对应的商品信息
    for (var i = 0; i < goods.length; i++) {
      //找到商品进行处理
      if (goods[i].id == exchangeId) {
        //加分项
        if (typeof (goods[i].score) == 'string' && goods[i].score.substring(0, 1) == '+') {
          var add = parseInt(goods[i].score.substring(1));
          wx.vibrateLong({});
          dbUtil.updateDbdata(totalScore + add);
          // wx.setStorageSync("total_score", totalScore + add);
          wx.showToast({
            title: '兑换成功',
            image: '/images/goods/enough.png'
          })
          goods[i].score = "已兑换";
        }
        //将商品需要的分数与现有总数进行对比
        else if (totalScore >= goods[i].score) {
          wx.vibrateLong({});
          dbUtil.updateDbdata(totalScore - goods[i].score);
          // wx.setStorageSync("total_score", totalScore - goods[i].score);
          wx.showToast({
            title: '兑换成功',
            image: '/images/goods/enough.png'
          })
          goods[i].score = "已兑换";
        } else if (typeof (goods[i].score) == 'string' && goods[i].score.substring(0, 1) != '+') {
          wx.vibrateLong({});
          wx.showToast({
            title: '已经兑换过了',
            image: '/images/goods/exchanged.png'
          })

        } else {
          wx.vibrateLong({});
          wx.showToast({
            title: '积分不足',
            image: '/images/goods/lack.png'
          })
        }
      }
    }
  },
  //设置data参数的公共方法
  allScore: function (key, value) {
    this.setData({
      [key]: value
    })
  },
})