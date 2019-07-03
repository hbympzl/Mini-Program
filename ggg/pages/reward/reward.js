// pages/reward/reward.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    whatwewant: [{
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1000,
        imagePath: "/images/goods/ns.jpg",
        id: 199410161
      },
      {
        name: "LOL至臻皮肤门票",
        score: 30,
        imagePath: "/images/goods/zz.png",
        id: 199410162
      },
      /*{
        name: "测试",
        score: 1,
        imagePath: "/images/goods/test.png",
        id: 199410163
      },*/
    ]
  },
  exchangeGoods: function(e) {
    var exchangeId = e.currentTarget.dataset.whatwewantId;
    var totalScore = wx.getStorageSync("total_score");
    var that = this;
    var goods = that.data.whatwewant;
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].id == exchangeId) {
        if (totalScore >= goods[i].score) {
          wx.setStorageSync("total_score", totalScore - goods[i].score);
          wx.showToast({
            title: '兑换成功',
          })
          goods[i].score = "已兑换";
        } else {
          if (typeof(goods[i].score) == 'string') {
            wx.showToast({
              title: '已经兑换过了',
            })
          } else {
            wx.showToast({
              title: '积分不足',
            })
          }
        }
      }
    }
  },
})