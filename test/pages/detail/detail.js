var cookie;
wx.getStorage({
  key: 'cookie',
  success: function (res) {cookie = res.data},
})
console.log(cookie)
Page({
   onLoad: function (option) {
    var that = this;
    //https://www.douyu.com/wgapi/livenc/home/followList
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
        for(var item in res.data.data.list){
          if (option.room_id == res.data.data.list[item].room_id){
            var targetItem = res.data.data.list[item];
          }
        }
        wx.setNavigationBarTitle({
          title: targetItem.nickname
        })
        that.setData({
          obj: targetItem
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
    //https://www.douyu.com/wgapi/livenc/home/followList
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
        for (var item in res.data.data.list) {
          if (that.options.room_id == res.data.data.list[item].room_id) {
            var targetItem = res.data.data.list[item];
          }
        }
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        
        that.setData({
          obj: targetItem,
          nowtime: timestamp
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
  }
})