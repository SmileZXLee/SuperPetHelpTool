import Vue from 'vue'
import App from './App'
import utils from './common/utils.js'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

//登录url
Vue.prototype.loginUrl = 'https://qqpet.jwetech.com/api/authorizations';
//获取个人信息
Vue.prototype.userInfoUrl = 'https://qqpet.jwetech.com/api/users/profile';
//获取、提交游戏信息
Vue.prototype.gameUrl = 'https://qqpet.jwetech.com/api/minigames';
//收取储蓄罐金币
Vue.prototype.getCoinsUrl = 'https://qqpet.jwetech.com/api/counters';
//宠物喂养
Vue.prototype.feedUrl = 'https://qqpet.jwetech.com/api/pet_feeds';
//获取好友列表
Vue.prototype.friendListUrl = 'https://qqpet.jwetech.com/api/rankings';
Vue.prototype.userInfo = function(){
	return {
		openid: uni.getStorageSync('openid'),
		openkey: uni.getStorageSync('openkey'),
		token: uni.getStorageSync('token'),
		id: uni.getStorageSync('id'),
		nick: uni.getStorageSync('nick'),
		avatar: uni.getStorageSync('avatar'),
		coins: uni.getStorageSync('coins'),
		level: uni.getStorageSync('level'),
		expirenece: uni.getStorageSync('expirenece'),
	}
}
//数据存储的key
Vue.prototype.openid = 'openid';
Vue.prototype.openkey = 'openkey';
Vue.prototype.token = 'token';
Vue.prototype.id = 'id';
Vue.prototype.nick = 'nick';
Vue.prototype.avatar = 'avatar';
Vue.prototype.coins = 'coins';
Vue.prototype.level = 'level';
Vue.prototype.expirenece = 'expirenece';
//登录请求

Vue.prototype.userLogin = function(openidValue,openkeyValue,callback){
	uni.request({
	        url: this.loginUrl,
	        method: 'POST',
	        data: {
	            "data": {
	                    "openid": openidValue,
	                    "openkey": openkeyValue
	            },
	            "opendata": "",
	            "provider": "qzone",
	            
	        },
	        header: {
	            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 QQ/8.1.8.429 V1_IPH_SQ_8.1.8_1_APP_A Pixel/1080 Core/WKWebView Device/Apple(iPhone 8Plus) NetType/4G QBWebViewType/1 WKType/1',
	            'x-game-version': '5.311.0820'
	        },
	        success: (res) => {
	            if(res.statusCode == 200){
					utils.updateUserInfo(openidValue,openkeyValue,res.data.token,res.data.id,res.data.nick,res.data.avatar,res.data.coins,res.data.pet.level,res.data.pet.expirenece);
					if(callback){
						callback(true,res.data);
					}
	            }else{
	                uni.showToast({
	                    icon: 'none',
	                    title: '登录失败，错误信息为：' + res.data.message,
	                    position: 'bottom'
	                })
	                if(callback){
	                	callback(false,res.data);
	                }
	            }
	        },
			fail: (err) => {
				uni.hideLoading();
				uni.showToast({
				    icon: 'none',
				    title: '登录失败，错误信息为：' + err.errMsg,
				    position: 'bottom'
				})
			}
	});
}

Vue.prototype.userAutoLogin = function(callback){
	var cacheOpenid = uni.getStorageSync(this.openid);
	var cacheOpenkey = uni.getStorageSync(this.openkey);
	if(cacheOpenid.length && cacheOpenkey.length){
		Vue.prototype.userLogin(cacheOpenid,cacheOpenkey,callback);
	}else{
		alert("openid或openkey读取失败，自动登录失败！")
	}
}

Vue.prototype.requestUserInfo = function(callback){
	Vue.prototype.baseRequest(this.userInfoUrl,'GET',{},'',function(success,res){
		if(success){
			utils.updateUserInfo(null,null,res.data.token,res.data.id,res.data.nick,res.data.avatar,res.data.coins,res.data.pet.level,res.data.pet.expirenece);
		}else{
		    uni.showToast({
		        icon: 'none',
		        title: '用户信息获取失败，错误信息为：' + res.data.message,
		        position: 'bottom'
		    })
		}
		if(callback){
			callback(success,res.data);
		}
	});
}

Vue.prototype.getCoins = function(callback){
	Vue.prototype.baseRequest(this.getCoinsUrl,'POST',{userId:uni.getStorageSync('id'),ad:true},'收取中...',function(success,res){
		if(success){
			utils.updateUserInfo(null,null,null,null,null,null,res.data.coins,null,null);
			uni.showToast({
			    icon: 'none',
			    title: '成功收取' + res.data.collected + '个金币',
			    position: 'bottom'
			})
		}else{
		    uni.showToast({
		        icon: 'none',
		        title: '收取金币失败，错误信息为：' + res.data.message,
		        position: 'bottom'
		    })
		}
		if(callback){
			callback(success,res.data);
		}
	});
}

Vue.prototype.feed = function(callback){
	Vue.prototype.baseRequest(this.feedUrl,'POST',{foodId:2,ad:true},'喂食中...',function(success,res){
		if(success){
			uni.showToast({
			    icon: 'none',
			    title: '喂食成功，经验值+4！' ,
			    position: 'bottom'
			})
		}else{
		    uni.showToast({
		        icon: 'none',
		        title: '喂食失败，错误信息为：' + res.data.message,
		        position: 'bottom'
		    })
		}
		if(callback){
			callback(success,res.data);
		}
	});
}

Vue.prototype.baseRequest = function(url,method,data,loadingStr,callback){
	if(loadingStr.length){
		uni.showLoading({
			title: loadingStr
		});
	}
	var header = {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 QQ/8.1.8.429 V1_IPH_SQ_8.1.8_1_APP_A Pixel/1080 Core/WKWebView Device/Apple(iPhone 8Plus) NetType/4G QBWebViewType/1 WKType/1','x-game-version': '5.311.0820'};
	var token = uni.getStorageSync(this.token);
	if(token){
		header['Authorization'] = 'Bearer ' + token;
	}
	uni.request({
	        url: url,
			method: method.toUpperCase(),
	        header: header,
			data: data,
	        success: (res) => {
				uni.hideLoading();
				if(callback){
					callback(res.statusCode == 200,res);
				}
	        },
			fail: (err)=> {
				uni.hideLoading();
				uni.showToast({
				    icon: 'none',
				    title: '网络错误，错误信息为：' + err.errMsg,
				    position: 'bottom'
				})
				if(callback){
					callback(false,err);
				}
			}
	});
}

Vue.prototype.requestFriendList = function(callback){
	Vue.prototype.baseRequest(this.friendListUrl,'GET',{},'获取好友列表...',function(success,res){
		if(success){
			
		}else{
		    uni.showToast({
		        icon: 'none',
		        title: '好友列表获取失败，错误信息为：' + res.data.message,
		        position: 'bottom'
		    })
		}
		if(callback){
			callback(success,res.data);
		}
	});
}


				
