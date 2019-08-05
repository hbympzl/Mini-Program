// pages/reward/reward.js
// ============================数据库相关===================================
//初始化环境
wx.cloud.init({
  env: 'hbympzl',
  traceUser: true
})
// 实例化数据库
const db = wx.cloud.database({});
// ============================数据库相关===================================
//获取其他页面的实例
var dbUtil = require('../../utils/dbUtil.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //奖品池
    whatwewant: [{
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄",
        score: 1000,
        imagePath: "/images/goods/ns.jpg",
        id: 199410161
      },
      {
        name: "索尼（SONY）PS4 Pro 家庭娱乐游戏机 1TB主机（白色）",
        score: 1500,
        imagePath: "/images/goods/ps4.png",
        id: 199410163
      },
      {
        name: "switch lite",
        score: 800,
        imagePath: "/images/goods/switch lite.png",
        id: 199410164
      }, 
      {
        name: "JAVA基础视频",
        score: '+20',
        imagePath: "/images/goods/javabasic.png",
        id: 199410165
      }, 
      {
        name: "JQuery自定义插件",
        score: '+30',
        imagePath: "/images/goods/jquery.png",
        id: 199410166
      }, 
      /*{
        name: "测试",
        score: 1,
        imagePath: "/images/goods/test.png",
        id: 199410167
      },*/
    ]
  },
  //点击兑换事件
  exchangeGoods: function(e) {
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
        if (typeof (goods[i].score) == 'string'&&goods[i].score.substring(0, 1) == '+') {
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
            image:'/images/goods/enough.png'
          })
          goods[i].score = "已兑换";
        } else if (typeof (goods[i].score) == 'string' && goods[i].score.substring(0, 1) != '+'){
              wx.vibrateLong({});
              wx.showToast({
                title: '已经兑换过了',
                image: '/images/goods/exchanged.png'
              })
            
          }else {
            wx.vibrateLong({});
            wx.showToast({
              title: '积分不足',
              image:'/images/goods/lack.png'
            })
          }
      }
    }
  },
})