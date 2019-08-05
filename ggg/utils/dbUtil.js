
// ============================数据库相关===================================
//初始化环境
wx.cloud.init({
  env: 'hbympzl',
  traceUser: true
})
// 实例化数据库
const db = wx.cloud.database({});
var OPEN_ID = '' //储存获取到openid  

// ============================数据库相关===================================
function updateDbdata(total_score) {
  console.log("updateDbData方法")
  var that = this;
  // that.getOpenIdTap();
  var dbscore = db.collection("score");
  OPEN_ID = wx.getStorageSync("open_id");
  if (OPEN_ID != "") {
    dbscore.where({
      _openid: OPEN_ID
    }).get({
      success: function (res) {
        var db_id = res.data[0]._id;
        db.collection('score').doc(db_id).update({
          // data 传入需要局部更新的数据
          data: {
            // 设置分数参数
            _total_score: total_score
          },
          success: function (res) {
            console.log("分数更新成功")
            that.getDbdata();
          }
        })
      }
    })
  }
}

module.exports = {
  updateDbdata: updateDbdata,
  // '对外方法名':'本地方法名'
}