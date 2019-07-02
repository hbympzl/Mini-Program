// pages/reward/reward.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    whatwewant: [
      {
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1000,
        imagePath: "/images/goods/ns.jpg",
        id: 199410161
      },
      {
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1001,
        imagePath: "/images/goods/ns.jpg",
        id: 199410162
      },
      {
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1001,
        imagePath: "/images/goods/ns.jpg",
        id: 199410163
      },
      {
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1001,
        imagePath: "/images/goods/ns.jpg",
        id: 199410164
      },
      {
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1001,
        imagePath: "/images/goods/ns.jpg",
        id: 199410165
      },
      {
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1001,
        imagePath: "/images/goods/ns.jpg",
        id: 199410166
      },
      {
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1001,
        imagePath: "/images/goods/ns.jpg",
        id: 199410167
      },
      {
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1001,
        imagePath: "/images/goods/ns.jpg",
        id: 199410168
      },
      {
        name: "日本任天堂（Nintendo）便携掌上游戏机 Switch NS主机 红蓝手柄 日版",
        score: 1001,
        imagePath: "/images/goods/ns.jpg",
        id: 199410169
      }
    ]
  },
  exchangeGoods:function(e){
    var exchangeId =  e.currentTarget.dataset.whatwewantId;
    var totalScore = wx.getStorageSync("total_score");
    var that = this;
    var goods = that.data.whatwewant;
    for (var i = 0; i< goods.length; i ++){
      if (goods[i].id == exchangeId){
        if (totalScore >= goods[i].score){
          console.log("兑换成功!!")
        }else{
          console.log("兑换失败!!")
        }
      }
    }
   
  }
})