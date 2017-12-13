var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var p = require('bluebird')

var index = require('./routes/index');
var users = require('./routes/users');
var wechatHandler = require('./routes/wechatHandler');

var WechatAPI = require('wechat-api');
//var WechatAPI = p.promisifyAll(require('wechat-api'));
var appid = 'wxb81c19145617ca88';
var appsecret =  '26768d2175092a6aa779645392e7d3e2';
var api = p.promisifyAll(new WechatAPI(appid, appsecret));


var menu = {
 "button":[
   {
     "name":"托管项目",
     "sub_button":[
       {
         "type":"view",
         "name":"项目公示",
         "url":"http://www.czzhengtai.com:37077/zt/pages/xmgs.html"
       },
        {
         "type":"view",
         "name":"进度查询",
         "url":"http://www.czzhengtai.com:37077/zt/pages/xmjd.html"
       },
	 {
         "type":"view",
         "name":"进度查询",
         "url":"http://www.czzhengtai.com:37077/zt/pages/xmjd.html"
       }
       ]
     },
{
     "name":"机构概况",
     "sub_button":[
       {
         "type":"view",
         "name":"托管机构",
         "url":"http://www.czzhengtai.com:37077/zt/pages/托管机构.html"
       },
        {
         "type":"view",
         "name":"工作动态",
         "url":"http://www.czzhengtai.com:37077/zt/pages/工作动态.html"
       },
{
         "type":"view",
         "name":"联系我们",
         "url":"http://www.czzhengtai.com:37077/zt/pages/联系我们.html"
       },
       ]
     },
{
     "name":"托管指南",
     "sub_button":[
       {
         "type":"view",
         "name":"托管流程",
         "url":"http://www.czzhengtai.com:37077/zt/pages/托管流程.html"
       },
        {
         "type":"view",
         "name":"常见问题",
         "url":"http://www.czzhengtai.com:37077/zt/pages/常见问题.html"
       },
{
         "type":"view",
         "name":"政策文件",
         "url":"http://www.czzhengtai.com:37077/zt/pages/政策文件.html"
       },

       ]
     }
]
   };
 
api.removeMenuAsync()
.then(function(res){
	console.log("remove menu:");
	console.dir(res);
	return api.createMenuAsync(menu);
})
.then(function(res){
	console.log("create menu");
	console.dir(res);
})
.catch(function(e){
	console.dir(e);
});
/*
api.removeMenu(function(err, res){
api.createMenu(menu, function(err, res){
console.dir(err);
console.dir(res);
});
});
*/

/////////////
var templateId= 'UJ_w_pNFveifcNIAD0qRLnCR_3e7l57sOLeZNFY0Fss';
// URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
var url= 'http://www.baidu.com/';
var data = {
   "test1": {
     "value":"参数1！",
     "color":"#173177"
   },
   "test2":{
     "value":"参数2",
     "color":"#173177"
   },
   "test3": {
     "value":"参数3",
     "color":"#173177"
   },
   "test4": {
     "value":"参数4",
     "color":"#173177"
   },
   "remark":{
     "value":"欢迎再次购买！",
     "color":"#173177"
   }
};


setInterval(function(){
data.test1.value = new Date();
console.log(data.test1.value);


api.getFollowers(function(err, res){

console.dir(res)
if(res.count > 0){
for(var i in res.data.openid){
var openid = res.data.openid[i]
console.log(openid)
api.sendTemplate( openid, templateId, url, data, function(err,res){
console.dir(err);
console.dir(res);
});

}
}
});
}, 3600 * 1000);
//////////

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/wechat', wechatHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
