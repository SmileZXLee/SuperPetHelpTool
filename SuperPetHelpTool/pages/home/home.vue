<template>
	<view class="content">
		<view class="user-info main-bac-color">
			<view>
				<image class="user-icon" :src="iconSrc"></image>
				<text class="user-name" style="margin-left: 20rpx;font-size: 35rpx;">{{userName}}</text>
			</view>
			<view>
				<image class="little-icon" src="../../static/star_icon.png"></image><text class="user-level">{{userLevel + '级'}}</text><text style="font-size: 20rpx;color: white;margin-left: 6rpx;">{{'('+userExp+'/'+(userLevel+1)+')'}}</text>
				<image class="little-icon" src="../../static/coin_icon.png"></image><text class="user-level">{{userCoin}}</text>
			</view>
		</view>
		<view class="detail-item" v-for="(item,index) in itemList" :key="index" @click="detailItemClick(index)">
			<view class="detail-item-title">
				<image class="title-icon" :src="item.titleIconSrc"></image>
				<text class="detail-title main-text-color">{{item.title}}</text>
			</view>
			<view class="detail-item-msg">
				<text class="detail-msg">{{item.msg}}</text>
				<image class="more-icon" src="../../static/more_icon.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iconSrc: '../../static/main-icon.png',
				userName: '--',
				userExp: 0,
				userLevel: 0,
				userCoin: 0,
				bankNum: 10,
				itemList: [
					{
						titleIconSrc: '../../static/feed_icon.png',
						title: '宠物喂食',
						msg: '',
					},
					{
						titleIconSrc: '../../static/bank_icon.png',
						title: '收取金币',
						msg: '',
					},
					{
						titleIconSrc: '../../static/mission_icon.png',
						title: '我的任务',
						msg: '',
					},
					{
						titleIconSrc: '../../static/game_icon.png',
						title: '宠物小游戏',
						msg: '',
					},
					{
						titleIconSrc: '../../static/friend_icon.png',
						title: '好友列表',
						msg: '',
					},
					{
						titleIconSrc: '../../static/set_icon.png',
						title: '设置',
						msg: '',
					}
				]
			}
		},
		onShow() {
			this.updateLocalUserInfo();
		},
		onLoad() {
			if(this.userInfo){
				console.log(this.userInfo.openid);
			}
			uni.startPullDownRefresh({
				success: function(res){
				}
			});
		},
		onPullDownRefresh() {
		    this.requestUserInfo(this.updatedCallback);
		},
		methods: {
			updatedCallback(success,data){
				uni.stopPullDownRefresh();
				if(success){
					this.updateLocalUserInfo();
				}
			},
			feededCallback(success,data){
				this.requestUserInfo(this.updatedCallback);
			},
			updateLocalUserInfo(){
				var vm = this;
				var nick = this.userInfo().nick;
				if(nick){
					this.userName = nick;
					this.iconSrc = this.userInfo().avatar;
					this.userLevel = this.userInfo().level;
					this.userCoin = this.userInfo().coins;
					this.userExp = this.userInfo().expirenece;
				}else{
					alert('用户信息读取失败！点击确定重试');
					vm.userAutoLogin(this.updatedCallback);
				}
			},
			detailItemClick(index){
				switch(index) {
				    case 0:{
						this.feed(this.feededCallback)
						break;
					}
				    case 1:{
						this.getCoins(this.updatedCallback)
						break;
				    }
					case 2:{
						alert('暂不支持');
						break;
					}
					case 3:{
						this.prePostGameData(420);
						break;
					}
					case 4:{
						uni.navigateTo({
							url: '../friendList/friendList'
						})
						break;
					}
					case 5:{
						alert('暂不支持');
						break;
					}
				    default:
						break;
				} 
			},
			prePostGameData(score){
				uni.showLoading({
					title: '提交中...'
				});
				var vm = this;
				uni.request({
				        url: this.gameUrl,
				        method: 'POST',
				        data: {
				           game: 'mcd'
				        },
				        header: {
				            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 QQ/8.1.8.429 V1_IPH_SQ_8.1.8_1_APP_A Pixel/1080 Core/WKWebView Device/Apple(iPhone 8Plus) NetType/4G QBWebViewType/1 WKType/1',
				            'x-game-version': '5.311.0820',
							'Authorization': 'Bearer ' + uni.getStorageSync(this.token)
				        },
				        success: (res) => {
				            if(res.statusCode == 200){
								vm.postGameData(score,res.data.id);
				            }else{
								uni.hideLoading();
				                uni.showToast({
				                    icon: 'none',
				                    title: '失败，错误信息为：' + res.data.message,
				                    position: 'bottom'
				                })
				                
				            }
				        }
				});
			},
			postGameData(score,id){
				uni.request({
				        url: this.gameUrl + '/' + id,
				        method: 'PUT',
				        data: {
				           game: 'mcd',
						   score: score,
						   ad: false
				        },
				        header: {
				            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 QQ/8.1.8.429 V1_IPH_SQ_8.1.8_1_APP_A Pixel/1080 Core/WKWebView Device/Apple(iPhone 8Plus) NetType/4G QBWebViewType/1 WKType/1',
				            'x-game-version': '5.311.0820',
							'Authorization': 'Bearer ' + uni.getStorageSync(this.token)
				        },
				        success: (res) => {
							uni.hideLoading();
				            if(res.statusCode == 200){
								var coins = res.data.coins;
								var sumCoin = 0;
								coins.forEach((item,index,array)=>{
								    sumCoin += item;
								})
								uni.showToast({
								    icon: 'none',
								    title: '宠物打工成功，增加金币：' + sumCoin,
								    position: 'bottom'
								})
				            }else{
				                uni.showToast({
				                    icon: 'none',
				                    title: '失败，错误信息为：' + res.data.message,
				                    position: 'bottom'
				                })
				                
				            }
				        }
				});
			}
			
		},
		watch: {
			bankNum(newVal, oldVal){
				this.itemList[0].msg = newVal;
			}
		}
	}
</script>

<style>
	.user-info{
		width: 100%;
		height: 300rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.user-icon{
		width: 120rpx;
		height: 120rpx;
		margin-left: 40rpx;
		border: white solid 1px;
		border-radius: 50%;
	}
	.user-info>view:first-child{
		margin-top: 40rpx;
		display: flex;
		align-items: center;
	}
	.user-info>view:last-child{
		display: flex;
		align-items: center;
		margin-top: 20rpx;
	}
	.little-icon{
		width: 40rpx;
		height: 40rpx;
		margin-left: 60rpx;
	}
	.user-level{
		font-size: 30rpx;
		margin-left: 10rpx;
	}
	.detail-item{
		width: 100%;
		height: 100rpx;
		border-bottom: #dddddd solid 1px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.more-icon{
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}
	.detail-title{
		margin-left: 16rpx;
		font-size: 32rpx;
	}
	.title-icon{
		width: 48rpx;
		height: 48rpx;
		margin-left: 30rpx;
	}
	.detail-item-msg,.detail-item-title{
		display: flex;
		align-items: center;
	}
	.detail-msg{
		color: #007AFF;
		font-size: 32rpx;
		margin-right: 10rpx;
	}
</style>
