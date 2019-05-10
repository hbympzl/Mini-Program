var cookie = "smidV2=20190221114552f661e22e25254f3ef5e440c7e8b7c85600f895bee8fea8d40; _ga=GA1.2.399364159.1550724389; dy_did=e5f5410afcee8b1c1491275a00071501; acf_did=e5f5410afcee8b1c1491275a00071501; PHPSESSID=j2gvfssumbmn1gjgc19imhv221; Hm_lvt_e99aee90ec1b2106afe7ec3b199020a7=1556608117,1557019139,1557109647,1557110784; acf_auth=2653gHF544cy8VjYU7ZJQ3JcicsZWLfaXaTOjQw0Yma14X%2BQxKnXTT7oVOuRJeIr3mCYT0Nmhcwikj9p784DXUuXYLUpBng18kHm1YexX3MCy5RY3QO2VuhEodm7uQ; wan_auth37wan=08d13cd9364bOSc%2FO6TqQFVhoKEfd1cOL0wX9qylcAW%2Fv3J2V0aWKHPOAJbuDrzKkkVvy5bqew3HIFzsYrOOVg1gaDt5dXpk3wpwHW0vAD8d1cdrUw; acf_uid=21433408; acf_username=auto_MxMA8U3Igp; acf_nickname=whaaaaaaaaaaaaat; acf_own_room=0; acf_groupid=1; acf_phonestatus=1; acf_avatar=https%3A%2F%2Fapic.douyucdn.cn%2Fupload%2Favatar_v3%2F201810%2F31aab2a99ec01a303ce8c4ee77872865_; acf_ct=0; acf_ltkid=73608778; acf_biz=1; acf_stk=ccbc79dc61c06c4a; Hm_lpvt_e99aee90ec1b2106afe7ec3b199020a7=1557110792"
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
        that.setData({
          obj: targetItem
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