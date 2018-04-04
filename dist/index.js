/*!
 * EasyWechat.js v1.3.6
 * (c) 2017-2018 Hpyer
 * Released under the MIT License.
 */
"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}function t(e){return new Promise(function(t,n){function i(s,c){try{var a=e[c?"throw":"next"](s)}catch(e){return void n(e)}a.done?t(a.value):Promise.resolve(a.value).then(i,r)}function r(e){i(e,1)}i()})}var n=e(require("merge")),i=e(require("request")),r=e(require("body")),s=e(require("url")),c=e(require("qs")),a=e(require("fs")),o=e(require("path")),u=e(require("wechat-crypto")),l=require("xml2js");const d=function(){let e=arguments;return e[0]="NodeEasywechat: "+e[0],console.log.apply(null,arguments)},p=function(){return parseInt((new Date).getTime()/1e3)},f=function(e=16){let t="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",n="";for(let i=0;i<e;i++)n+=t.charAt(Math.floor(Math.random()*t.length));return n},g=function(e){if(!e)return e;if("object"!=typeof e)return e;let t=new Object;for(let n in e)t[n]=g(e[n]);return t},h=function(){let e=arguments;if(0==e.length)return null;let t=g(e[0]);if(1==e.length)return t;for(let n=1;n<e.length;n++)if(e[n]&&"object"==typeof e[n])for(let i in e[n])t[i]=e[n][i];return t},y=require("crypto"),m=function(e,t="sha1"){return y.createHash(t).update(e).digest("hex")},_=function(e,t,n="sha256"){return y.createHmac("sha256",t).update(e).digest("hex")},$=function(e,t="sha1",n=""){let i="",r="",s=Object.keys(e);s=s.sort();for(let t=0;t<s.length;t++)"sign"!=s[t]&&(i+=r+s[t]+"="+e[s[t]],r="&");n&&(i+="&key="+n);let c="";switch(t=t.toLowerCase()){case"sha1":case"md5":c=m(i,t);break;case"hmac_sha256":t=t.replace("hamc_",""),c=_(i,t,n)}return c},b=e=>"[object String]"==Object.prototype.toString.call(e),S=e=>"[object Array]"==Object.prototype.toString.call(e),q=e=>"[object Number]"==Object.prototype.toString.call(e),w=e=>"[object Object]"==Object.prototype.toString.call(e);class k{constructor(e,t){this.$req=e,this.$res=t}getMethod(){return this.$req?this.$req.method:{}}getQuery(){return this.$req?s.parse(this.$req.url,!0).query:{}}_readBody(){return new Promise((e,t)=>{r(this.$req,(n,i)=>{n?t(n):e(i)})}).catch(e=>{d("app_server._readBody()",e)})}getBody(){return t(function*(){return this.$req?yield this._readBody():""}.call(this))}_initResponseOptions(e={}){return e.status=e.status||200,e.contentType=e.contentType||"text/html",e.headers=e.headers||{},e.headers["Content-Type"]=e.contentType,e}sendResponse(e,t={}){if(!this.$res)return!1;t=this._initResponseOptions(t),this.$res.writeHead(t.status,t.headers),this.$res.end(e)}}class I extends k{constructor(e){super(e.req,e.res),this.$ctx=e}sendResponse(e,t={}){if(!this.$ctx)return!1;t=this._initResponseOptions(t),this.$ctx.status=t.status;for(let e in t.headers)this.$ctx.set(e,t.headers[e]);this.$ctx.body=e}}class P extends k{constructor(e,t){super(e,t)}sendResponse(e,t={}){if(!this.$res)return!1;t=this._initResponseOptions(t),this.$res.status(t.status).set(t.headers).send(e)}}const E={appKey:"",appSecret:""};var A=null;class T{constructor(e={}){if(this.$config=n({},E,e),!this.$config.appKey)throw new Error("\u672a\u586b\u5199appKey");if(!this.$config.appSecret)throw new Error("\u672a\u586b\u5199appSecret");A=this,this.$plugins.forEach(e=>{this[e].init(this)})}setAppServerDefault(e,t){this.$config.app=new k(e,t)}setAppServerKoa2(e){this.$config.app=new I(e)}setAppServerExpress(e,t){this.$config.app=new P(e,t)}}T.prototype.requestGet=(e=>new Promise((t,n)=>{i({method:"GET",uri:e},function(e,i,r){if(e)n(e);else{try{r=JSON.parse(r)}catch(e){}t(r)}})})),T.prototype.requestFile=(e=>new Promise((t,n)=>{i({method:"GET",uri:e,encoding:"binary"},function(e,i,r){e?n(e):t(r)})})),T.prototype.requestPost=((e,t=null)=>new Promise((n,r)=>{i({method:"POST",uri:e,json:t},function(e,t,i){e?r(e):n(i)})})),T.prototype.buildApiUrl=(e=>t(function*(){let t=yield A.access_token.getToken();return e+"?access_token="+t}())),T.prototype.$plugins=[],T.registPlugin=((e,t)=>{T.prototype[e]=t,T.prototype.$plugins.push(e)});var U={EasyWechat:T,getInstance:()=>A};const x="https://open.weixin.qq.com/connect/oauth2/authorize",v="https://open.weixin.qq.com/connect/qrconnect",C="https://api.weixin.qq.com/sns/oauth2/access_token",M="https://api.weixin.qq.com/sns/userinfo";class N{constructor(){this.id="",this.nickname="",this.name="",this.avatar="",this.original={},this.token={}}}const j=function(e){},R=function(e=""){let t=U.getInstance();if(!t.$config.oauth)return"";if(!t.$config.oauth.scope)throw new Error("\u672a\u586b\u5199\u6388\u6743scope");if(!t.$config.oauth.redirect)throw new Error("\u672a\u586b\u5199\u6388\u6743\u56de\u8c03\u5730\u5740");let n=t.$config.oauth.redirect;if("http://"!=n.substr(0,7)&&"https://"!=n.substr(0,8))throw new Error("\u8bf7\u586b\u5199\u5b8c\u6574\u7684\u56de\u8c03\u5730\u5740\uff0c\u4ee5\u201chttp://\u201d\u6216\u201chttps://\u201d\u5f00\u5934");let i=x;"snsapi_login"==t.$config.oauth.scope&&(i=v);let r={appid:t.$config.appKey,redirect_uri:n,response_type:"code",scope:t.$config.oauth.scope};return e&&(r.state=e),i+"?"+c.stringify(r)+"#wechat_redirect"},D=function(e){return t(function*(){let t=yield K(e);return"snsapi_base"!=U.getInstance().$config.oauth.scope&&(t=yield O(t)),t}())},K=function(e){return t(function*(){let t=U.getInstance(),n={appid:t.$config.appKey,secret:t.$config.appSecret,code:e,grant_type:"authorization_code"},i=C+"?"+c.stringify(n),r=yield t.requestGet(i),s=new N;return s.id=r.openid,s.token=r,s}())},O=function(e){return t(function*(){let t={access_token:e.token.access_token,openid:e.id,lang:"zh_CN"},n=M+"?"+c.stringify(t),i=yield U.getInstance().requestGet(n);return i.errcode?(d("oauth.fetchUserInfo()",i),!1):(e.id=i.openid,e.nickname=i.nickname,e.name=i.nickname,e.avatar=i.headimgurl,e.original=i,e)}())};var W={init:function(e){},redirect:function(e=""){let t=U.getInstance();if(!t.$config.oauth)return"";if(!t.$config.oauth.scope)throw new Error("\u672a\u586b\u5199\u6388\u6743scope");if(!t.$config.oauth.redirect)throw new Error("\u672a\u586b\u5199\u6388\u6743\u56de\u8c03\u5730\u5740");let n=t.$config.oauth.redirect;if("http://"!=n.substr(0,7)&&"https://"!=n.substr(0,8))throw new Error("\u8bf7\u586b\u5199\u5b8c\u6574\u7684\u56de\u8c03\u5730\u5740\uff0c\u4ee5\u201chttp://\u201d\u6216\u201chttps://\u201d\u5f00\u5934");let i=x;"snsapi_login"==t.$config.oauth.scope&&(i=v);let r={appid:t.$config.appKey,redirect_uri:n,response_type:"code",scope:t.$config.oauth.scope};return e&&(r.state=e),i+"?"+c.stringify(r)+"#wechat_redirect"},user:function(e){return t(function*(){let t=yield K(e);return"snsapi_base"!=U.getInstance().$config.oauth.scope&&(t=yield O(t)),t}())}};class H{constructor(){this.$options={}}fetch(e){return null}contains(e){return!0}save(e,t=null,n=0){return!0}delete(e){return!0}}class F extends H{constructor(){super(),this.$datas={}}fetch(e){return!this.contains(e)||this.$datas[e].lifeTime>0&&this.$datas[e].lifeTime<p()?null:this.$datas[e].data}contains(e){return"object"==typeof this.$datas[e]}save(e,t=null,n=0){let i={data:t,lifeTime:n>0?n+p():0};return this.$datas[e]=i,!0}delete(e){return delete this.$datas[e],!0}}class J extends H{constructor(e){super();let t={path:"",dirMode:511,fileMode:438,ext:".cache"};this.$options=h(t,e),this.$options.path=o.resolve(this.$options.path);try{a.accessSync(this.$options.path,a.constants.R_OK&a.constants.W_OK)}catch(e){try{a.mkdirSync(this.$options.path,this.$options.dirMode)}catch(e){d("\u65e0\u6cd5\u521b\u5efa\u7f13\u5b58\u76ee\u5f55\uff1a"+this.$options.path,e)}}}getCacheFile(e){return this.$options.path+"/"+e+this.$options.ext}fetch(e){let t=null,n=this.getCacheFile(e);try{let e=JSON.parse(a.readFileSync(n,{encoding:"utf-8",flag:"r"}));t=e.lifeTime>0&&e.lifeTime<p()?null:e.data}catch(e){d("\u65e0\u6cd5\u8bfb\u53d6\u7f13\u5b58\u6587\u4ef6\uff1a"+n,e),t=null}return t}contains(e){let t=this.getCacheFile(e);try{a.accessSync(t,a.constants.R_OK&a.constants.W_OK)}catch(e){return!1}return!0}save(e,t=null,n=0){let i=this.getCacheFile(e);try{let e={data:t,lifeTime:n>0?n+p():0};a.writeFileSync(i,JSON.stringify(e),{mode:this.$options.fileMode,encoding:"utf-8",flag:"w"})}catch(e){return d("\u65e0\u6cd5\u5199\u5165\u7f13\u5b58\u6587\u4ef6\uff1a"+i,e),!1}return!0}delete(e){let t=this.getCacheFile(e);try{a.unlinkSync(t)}catch(e){return d("\u65e0\u6cd5\u5220\u9664\u7f13\u5b58\u6587\u4ef6\uff1a"+t,e),!1}return!0}}var G=Object.freeze({CacheInterface:H,MemoryCache:F,FileCache:J});const L=function(e){if(!e.$config.cache)switch(e.$config.cache_driver){case"file":e.$config.cache=new J(e.$config.cache_options);break;case"memory":default:e.$config.cache=new F}},Q=function(e){e&&"function"==typeof e.fetch&&"function"==typeof e.contains&&"function"==typeof e.save&&"function"==typeof e.delete&&(U.getInstance().$config.cache=e)};var B={init:function(e){if(!e.$config.cache)switch(e.$config.cache_driver){case"file":e.$config.cache=new J(e.$config.cache_options);break;case"memory":default:e.$config.cache=new F}},setCache:function(e){e&&"function"==typeof e.fetch&&"function"==typeof e.contains&&"function"==typeof e.save&&"function"==typeof e.delete&&(U.getInstance().$config.cache=e)}};const z="https://api.weixin.qq.com/cgi-bin/token",V=function(e){e.$config.access_token_cache_key=e.$config.access_token_cache_key||"NODE_EASYWECHAT_ACCESS_TOKEN"},Y=function(){return t(function*(){let e=U.getInstance(),t={appid:e.$config.appKey,secret:e.$config.appSecret,grant_type:"client_credential"},n=z+"?"+c.stringify(t);return yield e.requestGet(n)}())},X=function(e=!1){return t(function*(){let t=U.getInstance(),n=t.$config.cache.fetch(t.$config.access_token_cache_key);if(e||!n){let e=yield Y();Z(e.access_token,e.expires_in),n=e.access_token}return n}())},Z=function(e,t=7200){let n=U.getInstance();d("write AccessToken: ",n.$config.access_token_cache_key,e,t),n.$config.cache.save(n.$config.access_token_cache_key,e,t)};var ee={init:function(e){e.$config.access_token_cache_key=e.$config.access_token_cache_key||"NODE_EASYWECHAT_ACCESS_TOKEN"},getToken:function(e=!1){return t(function*(){let t=U.getInstance(),n=t.$config.cache.fetch(t.$config.access_token_cache_key);if(e||!n){let e=yield Y();Z(e.access_token,e.expires_in),n=e.access_token}return n}())},setToken:Z};const te="https://api.weixin.qq.com/cgi-bin/ticket/getticket",ne=function(e){e.$config.jssdk_cache_key=e.$config.jssdk_cache_key||"NODE_EASYWECHAT_JSSKD_TICKET"};var ie="";const re=function(e){ie=e},se=function(){return t(function*(){let e=U.getInstance(),t={access_token:yield e.access_token.getToken(),type:"jsapi"},n=te+"?"+c.stringify(t);return yield e.requestGet(n)}())},ce=function(e,n=!1,i=!0){return t(function*(){let t=U.getInstance(),r=t.$config.cache.fetch(t.$config.jssdk_cache_key);if(!r){let e=yield se();d("write JSSDK: ",t.$config.jssdk_cache_key,e.ticket,e.expires_in),t.$config.cache.save(t.$config.jssdk_cache_key,e.ticket,e.expires_in),r=e.ticket}let s=ie,c=f(),a=p(),o=$({jsapi_ticket:r,noncestr:c,timestamp:a,url:s}),u={debug:n,appId:t.$config.appKey,timestamp:a,nonceStr:c,signature:o,url:s,jsApiList:e};return ie="",i?JSON.stringify(u):u}())};var ae={init:function(e){e.$config.jssdk_cache_key=e.$config.jssdk_cache_key||"NODE_EASYWECHAT_JSSKD_TICKET"},setUrl:function(e){ie=e},config:function(e,n=!1,i=!0){return t(function*(){let t=U.getInstance(),r=t.$config.cache.fetch(t.$config.jssdk_cache_key);if(!r){let e=yield se();d("write JSSDK: ",t.$config.jssdk_cache_key,e.ticket,e.expires_in),t.$config.cache.save(t.$config.jssdk_cache_key,e.ticket,e.expires_in),r=e.ticket}let s=ie,c=f(),a=p(),o=$({jsapi_ticket:r,noncestr:c,timestamp:a,url:s}),u={debug:n,appId:t.$config.appKey,timestamp:a,nonceStr:c,signature:o,url:s,jsApiList:e};return ie="",i?JSON.stringify(u):u}())}};class oe{constructor(e){this.dataParams={ToUserName:"",FromUserName:"",CreateTime:p(),MsgType:""},this.json=null,this.data="","object"==typeof e?this.json=e:this.data=e}setAttribute(e,t){this.dataParams[e]=t}formatData(){return"<xml>"+this._formatData(this.dataParams)+"</xml>"}_formatData(e){if("object"==typeof e){let t="";for(let n in e)if(S(e[n]))for(let i=0;i<e[n].length;i++)t+=`<${n}>${this._formatData(e[n][i])}</${n}>`;else t+=`<${n}>${this._formatData(e[n])}</${n}>`;return t}return b(e)?"<![CDATA["+e+"]]>":e}getData(){return this.json?JSON.stringify(this.json):(this.data||(this.data=this.formatData()),this.data)}}class ue extends oe{constructor(e){super(""),this.dataParams={},this.dataParams.Encrypt=e.encrypt||"",this.dataParams.MsgSignature=e.sign||"",this.dataParams.TimeStamp=e.timestamp||p(),this.dataParams.Nonce=e.nonce||""}content(e){this.dataParams.Content=e}}class le extends oe{constructor(e){super(""),this.dataParams.MsgType="text",this.dataParams.Content=e.content||""}content(e){this.dataParams.Content=e}}class de extends oe{constructor(e){super(""),this.dataParams.MsgType="image",this.dataParams.Image={MediaId:e.media_id||""}}mediaId(e){this.dataParams.Image.MediaId=e}}class pe extends oe{constructor(e){super(""),this.dataParams.MsgType="voice",this.dataParams.Voice={MediaId:e.media_id||""}}mediaId(e){this.dataParams.Voice.MediaId=e}}class fe extends oe{constructor(e){super(""),this.dataParams.MsgType="video",this.dataParams.Video={MediaId:e.media_id||"",Title:e.title||"",Description:e.description||""}}mediaId(e){this.dataParams.Video.MediaId=e}title(e){this.dataParams.Video.Title=e}description(e){this.dataParams.Video.Description=e}}class ge extends oe{constructor(e){super(""),this.dataParams.MsgType="music",this.dataParams.Music={MediaId:e.media_id||"",Title:e.title||"",Description:e.description||"",MusicUrl:e.music_url||"",HQMusicUrl:e.hq_music_url||"",ThumbMediaId:e.thumb_media_id||""}}mediaId(e){this.dataParams.Music.MediaId=e}title(e){this.dataParams.Music.Title=e}description(e){this.dataParams.Music.Description=e}musicUrl(e){this.dataParams.Music.MusicUrl=e}hqMusicurl(e){this.dataParams.Music.HQMusicUrl=e}thumbMediaId(e){this.dataParams.Music.ThumbMediaId=e}}class he extends oe{constructor(e){super(""),this.dataParams.MsgType="news",this.dataParams.ArticleCount=1,this.dataParams.Articles={item:{Title:e.title||"",Description:e.description||"",Url:e.url||"",PicUrl:e.image||""}}}title(e){this.dataParams.Articles.item.Title=e}description(e){this.dataParams.Articles.item.Description=e}url(e){this.dataParams.Articles.item.Url=e}picUrl(e){this.dataParams.Articles.item.PicUrl=e}}var ye=Object.freeze({Raw:oe,Encrypt:ue,Text:le,Image:de,Voice:pe,Video:fe,Music:ge,News:he});const me=function(e){_e=function(){}};let _e,$e;const be=function(e){"function"!=typeof e&&(e=function(){}),_e=e},Se=function(e){let t=[],n=null;for(let i in e)"news"==e[i].dataParams.MsgType&&(n=e[i],t.push(e[i].dataParams.Articles.item));return t.length>0&&n&&(n.dataParams.ArticleCount=t.length,n.dataParams.Articles.item=t),n},qe=function(){return t(function*(){let e=U.getInstance(),t=e.$config.app;if(!t)throw new Error("\u672a\u5728\u914d\u7f6e\u6587\u4ef6\u4e2d\u8bbe\u7f6e\u5e94\u7528\u670d\u52a1\u5668");let n=null;if(e.$config.aesKey&&(n=new u(e.$config.token,e.$config.aesKey,e.$config.appKey)),"GET"==t.getMethod()){let r=t.getQuery();if(!(r.signature&&r.echostr&&r.timestamp&&r.nonce))return void t.sendResponse("Hello node-easywechat");let s;if(n)s=n.getSignature(r.timestamp||"",r.nonce||"",r.encrypt||"");else{var i=[e.$config.token,r.timestamp||"",r.nonce||"",r.encrypt||""].sort();s=m(i.join(""),"sha1")}s===r.signature?t.sendResponse(r.echostr):t.sendResponse("fail")}else{let e=yield t.getBody();if($e=yield we(e,n),_e&&"function"==typeof _e){let e=yield _e($e);if(!e||b(e)&&"SUCCESS"==e.toUpperCase())return void t.sendResponse("SUCCESS");let i=null;if((i=b(e)?new le({content:e}):S(e)?Se(e):e)&&"object"==typeof i){i.setAttribute("ToUserName",$e.FromUserName),i.setAttribute("FromUserName",$e.ToUserName);let e=i.getData();if(d("server.send().original",e),n&&$e._isEncrypt){e=n.encrypt(e);let t=p(),r=f(),s=n.getSignature(t,r,e);e=(i=new ue({encrypt:e,sign:s,timestamp:t,nonce:r})).getData(),d("server.send().encrypt",e)}t.sendResponse(e)}}}}())},we=function(e,n=null){return t(function*(){return new Promise((i,r)=>{l.parseString(e,(e,s)=>t(function*(){if(e)r(e);else{let e;if(s&&s.xml){e={};for(let t in s.xml)e[t]=s.xml[t][0];if(e._isEncrypt=!1,e.Encrypt&&n){let t=n.decrypt(e.Encrypt);if(d("parseMessage.decrypted",t),!(e=yield we(t.message)))throw new Error("\u65e0\u6cd5\u89e3\u5bc6\u6d88\u606f\uff0c\u8bf7\u786e\u8ba4 AppId\u3001Token\u3001AESKey \u7b49\u662f\u5426\u6b63\u786e");e._isEncrypt=!0}}i(e)}}()))}).catch(e=>{d("server.parseMessage()",e)})}())},ke=function(){return $e};var Ie={init:function(e){_e=function(){}},setMessageHandler:function(e){"function"!=typeof e&&(e=function(){}),_e=e},serve:function(){return t(function*(){let e=U.getInstance(),t=e.$config.app;if(!t)throw new Error("\u672a\u5728\u914d\u7f6e\u6587\u4ef6\u4e2d\u8bbe\u7f6e\u5e94\u7528\u670d\u52a1\u5668");let n=null;if(e.$config.aesKey&&(n=new u(e.$config.token,e.$config.aesKey,e.$config.appKey)),"GET"==t.getMethod()){let r=t.getQuery();if(!(r.signature&&r.echostr&&r.timestamp&&r.nonce))return void t.sendResponse("Hello node-easywechat");let s;if(n)s=n.getSignature(r.timestamp||"",r.nonce||"",r.encrypt||"");else{var i=[e.$config.token,r.timestamp||"",r.nonce||"",r.encrypt||""].sort();s=m(i.join(""),"sha1")}s===r.signature?t.sendResponse(r.echostr):t.sendResponse("fail")}else{let e=yield t.getBody();if($e=yield we(e,n),_e&&"function"==typeof _e){let e=yield _e($e);if(!e||b(e)&&"SUCCESS"==e.toUpperCase())return void t.sendResponse("SUCCESS");let i=null;if((i=b(e)?new le({content:e}):S(e)?Se(e):e)&&"object"==typeof i){i.setAttribute("ToUserName",$e.FromUserName),i.setAttribute("FromUserName",$e.ToUserName);let e=i.getData();if(d("server.send().original",e),n&&$e._isEncrypt){e=n.encrypt(e);let t=p(),r=f(),s=n.getSignature(t,r,e);e=(i=new ue({encrypt:e,sign:s,timestamp:t,nonce:r})).getData(),d("server.send().encrypt",e)}t.sendResponse(e)}}}}())},getMessage:function(){return $e}};const Pe="https://api.weixin.qq.com/cgi-bin/message/template/send",Ee="https://api.weixin.qq.com/cgi-bin/template/get_industry",Ae="https://api.weixin.qq.com/cgi-bin/template/api_set_industry",Te="https://api.weixin.qq.com/cgi-bin/template/api_add_template",Ue="https://api.weixin.qq.com/cgi-bin/template/get_all_private_template",xe="https://api.weixin.qq.com/cgi-bin/template/del_private_template",ve=function(e){Me=new Ce};class Ce{constructor(){this.reset()}}Ce.prototype.reset=function(){this.touser="",this.template_id="",this.url="",this.miniprogram={},this.data=[]};let Me=null;const Ne=function(e){return Me.touser=e,this},je=function(e){return Me.template_id=e,this},Re=function(e){return Me.url=e,this},De=function(e){return Me.data=Ke(e),this},Ke=function(e){let t={};for(let n in e){let i=e[n];"object"==typeof i?void 0!==i.length?t[n]={value:i[0],color:i[1]}:t[n]=i:t[n]={value:i}}return t},Oe=function(e=null){return t(function*(){if(e?e.data&&(e.data=Ke(e.data)):e={},e=n({},Me,e),Me.reset(),!e.touser)throw new Error("\u7528\u6237openid\u4e3a\u7a7a");if(!e.template_id)throw new Error("\u6a21\u677fid\u4e3a\u7a7a");let t=U.getInstance(),i=yield t.buildApiUrl(Pe);return yield t.requestPost(i,e)}())},We=function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(Ee);return yield e.requestPost(t)}())},He=function(e,n){return t(function*(){let t=U.getInstance(),i=yield t.buildApiUrl(Ae),r={industry_id1:e,industry_id2:n};return yield t.requestPost(i,r)}())},Fe=function(e){return t(function*(){let t=U.getInstance(),n=yield t.buildApiUrl(Te),i={template_id_short:e};return yield t.requestPost(n,i)}())},Je=function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(Ue);return yield e.requestPost(t)}())},Ge=function(e){return t(function*(){let t=U.getInstance(),n=yield t.buildApiUrl(xe),i={template_id:e};return yield t.requestPost(n,i)}())};var Le={init:function(e){Me=new Ce},to:Ne,withTo:Ne,andTo:Ne,receiver:Ne,withReceiver:Ne,andhReceiver:Ne,uses:je,withUses:je,andUses:je,template:je,withTemplate:je,andTemplate:je,templateId:je,withTemplateId:je,andTemplateId:je,url:Re,withUrl:Re,andUrl:Re,link:Re,withLink:Re,andLink:Re,linkTo:Re,withLinkTo:Re,andLinkTo:Re,data:De,withData:De,andData:De,send:function(e=null){return t(function*(){if(e?e.data&&(e.data=Ke(e.data)):e={},e=n({},Me,e),Me.reset(),!e.touser)throw new Error("\u7528\u6237openid\u4e3a\u7a7a");if(!e.template_id)throw new Error("\u6a21\u677fid\u4e3a\u7a7a");let t=U.getInstance(),i=yield t.buildApiUrl(Pe);return yield t.requestPost(i,e)}())},getIndustry:function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(Ee);return yield e.requestPost(t)}())},setIndustry:function(e,n){return t(function*(){let t=U.getInstance(),i=yield t.buildApiUrl(Ae),r={industry_id1:e,industry_id2:n};return yield t.requestPost(i,r)}())},addTemplate:function(e){return t(function*(){let t=U.getInstance(),n=yield t.buildApiUrl(Te),i={template_id_short:e};return yield t.requestPost(n,i)}())},getPrivateTemplates:function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(Ue);return yield e.requestPost(t)}())},deletePrivateTemplate:function(e){return t(function*(){let t=U.getInstance(),n=yield t.buildApiUrl(xe),i={template_id:e};return yield t.requestPost(n,i)}())}};const Qe="https://api.weixin.qq.com/cgi-bin/qrcode/create",Be="https://mp.weixin.qq.com/cgi-bin/showqrcode",ze=function(e){},Ve=function(e,n=null){return t(function*(){((n=parseInt(n))<=0||n>604800)&&(n=604800);let t="";"string"==typeof e?(e={scene_str:e},t="QR_STR_SCENE"):(e={scene_id:e},t="QR_SCENE");let i={expire_seconds:n,action_name:t,action_info:{scene:e}},r=U.getInstance(),s=yield r.buildApiUrl(Qe);return yield r.requestPost(s,i)}())},Ye=function(e){return t(function*(){let t="";"string"==typeof e?(e={scene_str:e},t="QR_LIMIT_STR_SCENE"):(e={scene_id:e},t="QR_LIMIT_SCENE");let n={action_name:t,action_info:{scene:e}},i=U.getInstance(),r=yield i.buildApiUrl(Qe);return yield i.requestPost(r,n)}())},Xe=function(e){return t(function*(){let t=Be+"?ticket="+e;return yield U.getInstance().requestFile(t)}())};var Ze={init:function(e){},temporary:function(e,n=null){return t(function*(){((n=parseInt(n))<=0||n>604800)&&(n=604800);let t="";"string"==typeof e?(e={scene_str:e},t="QR_STR_SCENE"):(e={scene_id:e},t="QR_SCENE");let i={expire_seconds:n,action_name:t,action_info:{scene:e}},r=U.getInstance(),s=yield r.buildApiUrl(Qe);return yield r.requestPost(s,i)}())},forever:function(e){return t(function*(){let t="";"string"==typeof e?(e={scene_str:e},t="QR_LIMIT_STR_SCENE"):(e={scene_id:e},t="QR_LIMIT_SCENE");let n={action_name:t,action_info:{scene:e}},i=U.getInstance(),r=yield i.buildApiUrl(Qe);return yield i.requestPost(r,n)}())},url:function(e){return t(function*(){let t=Be+"?ticket="+e;return yield U.getInstance().requestFile(t)}())}};const et="https://api.weixin.qq.com/cgi-bin/user/info",tt="https://api.weixin.qq.com/cgi-bin/user/info/batchget",nt="https://api.weixin.qq.com/cgi-bin/user/get",it="https://api.weixin.qq.com/cgi-bin/user/info/updateremark",rt="https://api.weixin.qq.com/cgi-bin/tags/members/getblacklist",st="https://api.weixin.qq.com/cgi-bin/tags/members/batchblacklist",ct="https://api.weixin.qq.com/cgi-bin/tags/members/batchunblacklist";class at{constructor(){this.id="",this.nickname="",this.name="",this.avatar="",this.original={},this.token={}}}const ot=function(e){},ut=function(e,n="zh_CN"){return t(function*(){let t=U.getInstance(),i=yield t.buildApiUrl(et);i+="&openid="+e+"&lang="+n;let r=yield t.requestGet(i),s=new at;return s.id=r.openid,s.nickname=r.nickname,s.name=r.nickname,s.avatar=r.headimgurl,s.original=r,s}())},lt=function(e){return t(function*(){let t=U.getInstance(),n={user_list:e},i=yield t.buildApiUrl(tt);return yield t.requestPost(i,n)}())},dt=function(e=null){return t(function*(){let t=U.getInstance(),n=yield t.buildApiUrl(nt);return e&&(n+="&next_openid="+e),yield t.requestGet(n)}())},pt=function(e,n){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(it);return yield e.requestPost(t)}())},ft=function(e){return t(function*(){let t=U.getInstance(),n={};e&&(n.begin_openid=e);let i=yield t.buildApiUrl(rt);return yield t.requestPost(i,n)}())},gt=function(e){return t(function*(){let t=U.getInstance(),n={openid_list:e},i=yield t.buildApiUrl(st);return yield t.requestPost(i,n)}())},ht=function(e){return t(function*(){let t=U.getInstance(),n={openid_list:e},i=yield t.buildApiUrl(ct);return yield t.requestPost(i,n)}())},yt=function(e){return t(function*(){return yield gt([e])}())},mt=function(e){return t(function*(){return yield ht([e])}())};var _t={init:function(e){},get:function(e,n="zh_CN"){return t(function*(){let t=U.getInstance(),i=yield t.buildApiUrl(et);i+="&openid="+e+"&lang="+n;let r=yield t.requestGet(i),s=new at;return s.id=r.openid,s.nickname=r.nickname,s.name=r.nickname,s.avatar=r.headimgurl,s.original=r,s}())},batchGet:function(e){return t(function*(){let t=U.getInstance(),n={user_list:e},i=yield t.buildApiUrl(tt);return yield t.requestPost(i,n)}())},lists:function(e=null){return t(function*(){let t=U.getInstance(),n=yield t.buildApiUrl(nt);return e&&(n+="&next_openid="+e),yield t.requestGet(n)}())},remark:function(e,n){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(it);return yield e.requestPost(t)}())},blacklist:function(e){return t(function*(){let t=U.getInstance(),n={};e&&(n.begin_openid=e);let i=yield t.buildApiUrl(rt);return yield t.requestPost(i,n)}())},batchBlock:gt,batchUnblock:ht,block:function(e){return t(function*(){return yield gt([e])}())},unblock:function(e){return t(function*(){return yield ht([e])}())}};const $t="https://api.weixin.qq.com/cgi-bin/menu/get",bt="https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info",St="https://api.weixin.qq.com/cgi-bin/menu/create",qt="https://api.weixin.qq.com/cgi-bin/menu/delete",wt=function(e){},kt=function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl($t);return yield e.requestPost(t)}())},It=function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(bt);return yield e.requestPost(t)}())},Pt=function(e){return t(function*(){let t={button:e},n=U.getInstance(),i=yield n.buildApiUrl(St);return yield n.requestPost(i,t)}())},Et=function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(qt);return yield e.requestPost(t)}())};var At={init:function(e){},all:function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl($t);return yield e.requestPost(t)}())},current:function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(bt);return yield e.requestPost(t)}())},add:function(e){return t(function*(){let t={button:e},n=U.getInstance(),i=yield n.buildApiUrl(St);return yield n.requestPost(i,t)}())},destroy:function(){return t(function*(){let e=U.getInstance(),t=yield e.buildApiUrl(qt);return yield e.requestPost(t)}())}};const Tt="https://api.weixin.qq.com/cgi-bin/shorturl",Ut=function(e){},xt=function(e){return t(function*(){let t={action:"long2short",long_url:e},n=U.getInstance(),i=yield n.buildApiUrl(Tt);return yield n.requestPost(i,t)}())};var vt={init:function(e){},shorten:function(e){return t(function*(){let t={action:"long2short",long_url:e},n=U.getInstance(),i=yield n.buildApiUrl(Tt);return yield n.requestPost(i,t)}())}};const Ct="https://api.mch.weixin.qq.com/pay/unifiedorder",Mt=function(e){},Nt=function(e){let t="<xml>";for(let n in e)q(e[n])?t+=`<${n}>${e[n]}</${n}>`:w(e[n])?t+=`<${n}>${JSON.stringify(e[n])}</${n}>`:t+=`<${n}><![CDATA[${e[n]}]]></${n}>`;return t+="</xml>"},jt=function(e){return t(function*(){let t=U.getInstance(),n=t.$config.payment,i={appid:t.$config.appKey,mch_id:n.merchantId,device_info:e.device_info||"WEB",nonce_str:f(16),body:e.body,detail:e.detail||"",attach:e.attach||"",out_trade_no:e.out_trade_no,fee_type:e.fee_type||"CNY",total_fee:e.total_fee,spbill_create_ip:e.spbill_create_ip,time_start:e.time_start||"",time_expire:e.time_expire||"",goods_tag:e.goods_tag||"",notify_url:e.notify_url||n.notifyUrl,trade_type:e.trade_type||"JSAPI",product_id:e.product_id||"",limit_pay:e.limit_pay||"",openid:e.openid||"",scene_info:e.scene_info||""},r=e.sign_type||"HMAC-SHA256";i.sign=$(i,r,n.key),i.sign_type=r;let s=Nt(i),c=yield t.requestPost(Ct,s);return d("payment.prepare(): ",i,c),c}())},Rt=function(e){return t(function*(){let t=U.getInstance(),n=t.$config.app;if(!n)throw new Error("\u672a\u5728\u914d\u7f6e\u6587\u4ef6\u4e2d\u8bbe\u7f6e\u5e94\u7528\u670d\u52a1\u5668");let i=t.$config.payment,r=yield n.getBody(),s=yield Dt(r),c={return_code:"",return_msg:""};if("SUCCESS"!==s.return_code)return d("payment.handleNotify(): invalid_sign",s),c.return_code="SUCCESS",c.return_msg="return_code\u5f02\u5e38",n.sendResponse(Nt(c));let a=$(s,s.sign_type,i.key);if(a!==s.sign)return d("payment.handleNotify(): invalid_sign",a,s.sign),c.return_code="FAIL",c.return_msg="\u7b7e\u540d\u9519\u8bef",n.sendResponse(Nt(c));let o=yield e(s,"SUCCESS"===s.result_code);!0===o?(c.return_code="SUCCESS",c.return_msg=""):(c.return_code="FAIL",c.return_msg=o),n.sendResponse(Nt(c))}())},Dt=function(e){return t(function*(){return new Promise((n,i)=>{l.parseString(e,(e,r)=>t(function*(){if(e)i(e);else{let e;if(r&&r.xml){e={};for(let t in r.xml)e[t]=r.xml[t][0]}n(e)}}()))}).catch(e=>{d("payment.parseMessage()",e)})}())},Kt=function(e,n=!0){return t(function*(){let t=f(16),i=p(),r={appId:instance.$config.appKey,timeStamp:i,nonceStr:t,package:"prepay_id="+e};return r.paySign=$(r,"HMAC-SHA256",instance.$config.appSecret),r.signType="HMAC-SHA256",n&&(r=JSON.stringify(r)),r}())},Ot=function(e,n=!0){return t(function*(){let t=f(16),i=p(),r={appId:instance.$config.appKey,timestamp:i,nonceStr:t,package:"prepay_id="+e};return r.paySign=$(r,"MD5",instance.$config.appSecret),r.signType="MD5",n&&(r=JSON.stringify(r)),r}())};var Wt={init:function(e){},prepare:function(e){return t(function*(){let t=U.getInstance(),n=t.$config.payment,i={appid:t.$config.appKey,mch_id:n.merchantId,device_info:e.device_info||"WEB",nonce_str:f(16),body:e.body,detail:e.detail||"",attach:e.attach||"",out_trade_no:e.out_trade_no,fee_type:e.fee_type||"CNY",total_fee:e.total_fee,spbill_create_ip:e.spbill_create_ip,time_start:e.time_start||"",time_expire:e.time_expire||"",goods_tag:e.goods_tag||"",notify_url:e.notify_url||n.notifyUrl,trade_type:e.trade_type||"JSAPI",product_id:e.product_id||"",limit_pay:e.limit_pay||"",openid:e.openid||"",scene_info:e.scene_info||""},r=e.sign_type||"HMAC-SHA256";i.sign=$(i,r,n.key),i.sign_type=r;let s=Nt(i),c=yield t.requestPost(Ct,s);return d("payment.prepare(): ",i,c),c}())},handleNotify:function(e){return t(function*(){let t=U.getInstance(),n=t.$config.app;if(!n)throw new Error("\u672a\u5728\u914d\u7f6e\u6587\u4ef6\u4e2d\u8bbe\u7f6e\u5e94\u7528\u670d\u52a1\u5668");let i=t.$config.payment,r=yield n.getBody(),s=yield Dt(r),c={return_code:"",return_msg:""};if("SUCCESS"!==s.return_code)return d("payment.handleNotify(): invalid_sign",s),c.return_code="SUCCESS",c.return_msg="return_code\u5f02\u5e38",n.sendResponse(Nt(c));let a=$(s,s.sign_type,i.key);if(a!==s.sign)return d("payment.handleNotify(): invalid_sign",a,s.sign),c.return_code="FAIL",c.return_msg="\u7b7e\u540d\u9519\u8bef",n.sendResponse(Nt(c));let o=yield e(s,"SUCCESS"===s.result_code);!0===o?(c.return_code="SUCCESS",c.return_msg=""):(c.return_code="FAIL",c.return_msg=o),n.sendResponse(Nt(c))}())},configForPayment:function(e,n=!0){return t(function*(){let t=f(16),i=p(),r={appId:instance.$config.appKey,timeStamp:i,nonceStr:t,package:"prepay_id="+e};return r.paySign=$(r,"HMAC-SHA256",instance.$config.appSecret),r.signType="HMAC-SHA256",n&&(r=JSON.stringify(r)),r}())},configForJSSDKPayment:function(e,n=!0){return t(function*(){let t=f(16),i=p(),r={appId:instance.$config.appKey,timestamp:i,nonceStr:t,package:"prepay_id="+e};return r.paySign=$(r,"MD5",instance.$config.appSecret),r.signType="MD5",n&&(r=JSON.stringify(r)),r}())}};U.EasyWechat.registPlugin("oauth",W),U.EasyWechat.registPlugin("cache",B),U.EasyWechat.registPlugin("access_token",ee),U.EasyWechat.registPlugin("jssdk",ae),U.EasyWechat.registPlugin("server",Ie),U.EasyWechat.registPlugin("notice",Le),U.EasyWechat.registPlugin("qrcode",Ze),U.EasyWechat.registPlugin("user",_t),U.EasyWechat.registPlugin("menu",At),U.EasyWechat.registPlugin("url",vt),U.EasyWechat.registPlugin("payment",Wt),U.EasyWechat.Cache={};for(let e in G)U.EasyWechat.Cache[e]=G[e];U.EasyWechat.Message={};for(let e in ye)U.EasyWechat.Message[e]=ye[e];var Ht=U.EasyWechat;module.exports=Ht;