//index.js
//获取应用实例
const app = getApp()
var cookie;
wx.getStorage({
  key: 'cookie',
  success: function (res) { cookie = res.data },
})
Page({
  onLoad: function (options) {
    var that = this;
    wx.request({
      //项目的真正接口，通过字符串拼接方式实现
      url: "https://www.douyu.com/wgapi/livenc/liveweb/followlist/0?sort=0",
      header: {
        "content-type": "application/json;charset=UTF-8",
        "cookie": cookie
      },
      method: 'GET',
      success: function (res) {
        //参数值为res.data,直接将返回的数据传入
        var list = res.data.data.list;
        var listshow = [];
        for(var i = 0 ;i<res.data.data.list.length;i++){
         
          if(list[i].show_status == 1){
            listshow[i]=list[i];
          }
        }
        //将参数传到wxml中
        that.setData({
          obj: listshow
        })
      },
      fail: function () {
        doFail();
      },
    })
    wx.startPullDownRefresh();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      //项目的真正接口，通过字符串拼接方式实现
      url: "https://www.douyu.com/wgapi/livenc/liveweb/followlist/0?sort=0",
      header: {
        "content-type": "application/json;charset=UTF-8",
        "cookie": cookie
      },
      method: 'GET',
      success: function (res) {
        //参数值为res.data,直接将返回的数据传入
        var list = res.data.data.list;
        var listshow = [];
        for (var i = 0; i < res.data.data.list.length; i++) {

          if (list[i].show_status == 1) {
            listshow[i] = list[i];
          }
        }
        that.setData({
          obj: listshow
        })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function () {
        doFail();
      },
    })
  },
  //事件处理函数
  toDtail: function (event) {
    wx.navigateTo({
      url: '/pages/detail/detail?room_id=' + event.currentTarget.dataset.zb_id
    })
  }
})

