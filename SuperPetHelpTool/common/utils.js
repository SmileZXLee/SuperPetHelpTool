const updateUserInfo = function updateUserInfo(openid,openkey,token,id,nick,avatar,coins,level,expirenece){
	if(openid){
		uni.setStorageSync('openid',openid);
	}
	if(openkey){
		uni.setStorageSync('openkey',openkey);
	}
	if(token){
		uni.setStorageSync('token',token);
	}
	if(id){
		uni.setStorageSync('id',id);
	}
	if(nick){
		uni.setStorageSync('nick',nick);
	}
	if(avatar){
		uni.setStorageSync('avatar',avatar);
	}
	if(coins){
		uni.setStorageSync('coins',coins);
	}
	if(level){
		uni.setStorageSync('level',level);
	}
	if(expirenece){
		uni.setStorageSync('expirenece',expirenece);
	}
}

function baseRequest(url,method,data){
	uni.request({
	    url: url,
	    method: method,
	    data: data,
	    header: {
	        'x-game-version': '5.311.0820'
	    },
	    success: (res) => {
	        
	    }
	});
}

export default {  
    updateUserInfo  
}