<template>
	<view class="content">
		<image class="logo" src="/static/main-icon.png"></image>
		<input class="openid-input main-text-color" v-model="openidValue" type="text" value="" placeholder="请输入openid"/>
		<input class="openkey-input main-text-color" v-model="openkeyValue" type="text" value="" placeholder="请输入openkey"/>
		<text class="notice-text">如何获取？<text class="text-gray">使用手机抓包工具，进入QQ超级萌宠，选择链接为https://qqpet.jwetech.com/api/authorizations的请求，查看请求体，复制请求体中的openid和openkey即可</text></text>
		<button class="login-btn main-bac-color" @click="login">登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openidValue: '',
				openkeyValue: '',
			}
		},
		onLoad() {
			var vData = this;
			var cacheOpenid = uni.getStorageSync(this.openid); 
			if(cacheOpenid && cacheOpenid.length){
				vData.openidValue = cacheOpenid;
			}
			var cacheOpenkey = uni.getStorageSync(this.openkey);
			if(cacheOpenkey && cacheOpenkey.length){
				vData.openkeyValue = cacheOpenkey;
			}
		},
		methods: {
			callback(success,data){
				if(success){
					uni.showToast({
						icon: 'none',
						title: '登录成功，欢迎您：' + data.nick,
						position: 'bottom'
					})
					setTimeout(function(){
						uni.redirectTo({
							url: '../home/home'
						})
					},1000)
					
				}else{
					uni.showToast({
						icon: 'none',
						title: '登录失败，错误信息为：' + data.message,
						position: 'bottom'
					})
				}
			},
			login(){
				if(!this.openidValue.length || !this.openkeyValue.length){
					uni.showToast({
						icon: 'none',
						title: 'openid或openkey不得为空！',
						position: 'bottom'
					})
					return;
				}
				uni.showLoading({
					title: '正在验证...'
				});
				this.userLogin(this.openidValue,this.openkeyValue,this.callback);
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 100rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
	.openid-input,.openkey-input{
		width: 80%;
		height: 80rpx;
		background: #f8f8f8;
		border-radius: 200rpx;
		padding-left: 40rpx;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
	.notice-text{
		width: calc(80% + 20rpx);
		font-size: 20rpx;
		margin-top: 20rpx;
		color: #007AFF;
	}
	.login-btn{
		width: calc(80% + 20rpx);
		margin-top: 60rpx;
		height: 80rpx;
		border-radius: 200rpx;
		line-height: 80rpx;
		font-size: 28rpx;
	}
</style>
