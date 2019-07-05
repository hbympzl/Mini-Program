// pages/reward/reward.js
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
  //点击兑换事件
  exchangeGoods: function(e) {
    var exchangeId = e.currentTarget.dataset.whatwewantId;
    var totalScore = wx.getStorageSync("total_score");
    var that = this;
    var goods = that.data.whatwewant;
    //循环判断指定id对应的商品信息
    for (var i = 0; i < goods.length; i++) {
      //找到商品进行处理
      if (goods[i].id == exchangeId) {
        //将商品需要的分数与现有总数进行对比
        if (totalScore >= goods[i].score) {
          wx.vibrateLong({});
          wx.setStorageSync("total_score", totalScore - goods[i].score);
          wx.showToast({
            title: '兑换成功',
            image:'/images/goods/enough.png'
          })
          goods[i].score = "已兑换";
        } else {
          if (typeof(goods[i].score) == 'string') {
            wx.vibrateLong({});
            wx.showToast({
              title: '已经兑换过了',
              image: '/images/goods/exchanged.png'
            })
          } else {
            wx.vibrateLong({});
            wx.showToast({
              title: '积分不足',
              image:'/images/goods/lack.png'
            })
          }
        }
      }
    }
  },
})