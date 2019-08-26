
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
function updateDbdata(total_score) {
  console.log("updateDbData方法")
  var that = this;
  that.getOpenIdTap();
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
//获取数据库中参数的方法并设置到前端页面缓存的方法
//??出现问题,如果缓存中的分数没有在自动更新参数的时候同步的话 会把缓存中的数据更新到数据库中 这是//不对的
function getDbdata() {
  console.log("getDbdata方法");
  var that = this;
  var _total_score;
  that.getOpenIdTap();
  var dbscore = db.collection("score");
  OPEN_ID = wx.getStorageSync("open_id");
  if (OPEN_ID != "") {
    // var aaa = dbscore.where({ _openid: OPEN_ID}).get();
    // console.log("????????" + aaa);//[object Promise]
    dbscore.where({
      _openid: OPEN_ID
    }).get({
      success:  (res) => {
        console.log("数据库中的参数" + res.data.length);

        //获取数据库中的参数设置到页面显示参数和缓存当中,并刷新页面,on
        //Load方法中不应该放入此函数
        console.log("获取数据库总分 并设置")
        _total_score = res.data[0]._total_score;
        console.log("==================" + _total_score+"=============");
        wx.setStorageSync('total_score', _total_score);
        // return{
        //   "_total_score": _total_score
        // };
      }
    })
  }
}
//初始化用户信息的方法
function initDbSelf(){
  console.log("initDbSelf方法");
  var that = this;
  var dbscore = db.collection("score");
  OPEN_ID = wx.getStorageSync("open_id");
  if (OPEN_ID != "") {
    dbscore.where({
      _openid: OPEN_ID
    }).get({
      success: function (res) {
        var user = wx.getStorageSync('userMsg');
        //为空的时候往数据库添加当前操作人的open_id和其他信息
        if (res.data.length == 0) {
          db.collection('score').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              _username: user.nickName,
              _city: user.city,
              _total_score: 0
            },
            success: function (res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              // if (res.errMsg == "collection.add:ok") {
              //   wx.setStorageSync("total_score", res.data[0]._total_score);

              // }
              console.log("用户数据录入成功!")
            }
          })
        }
      }
    })
  } else {
    console.log("走了else");
  }
}
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

//获取用户唯一id和session
function getOpenIdTap() {
  console.log("getOpenIdTap方法")
  var that = this;
  wx.login({
    success: function (res) {
      wx.request({
        //获取openid接口  
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        data: {
          appid: APP_ID,
          secret: APP_SECRET,
          js_code: res.code,
          grant_type: 'authorization_code'
        },
        method: 'GET',
        success: function (res) {
          OPEN_ID = res.data.openid; //获取到的openid  
          SESSION_KEY = res.data.session_key; //获取到session_key 
          wx.setStorageSync('open_id', OPEN_ID);
          wx.setStorageSync('seesion_key', SESSION_KEY);
          that.initDbSelf();
        }
      })
    }
  })
}
module.exports = {
   // '对外方法名':'本地方法名'
  updateDbdata: updateDbdata,
  getDbdata: getDbdata,
  initDbSelf: initDbSelf,
  getOpenIdTap: getOpenIdTap, 
}