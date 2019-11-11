<template>
	<view>
		<view class="detail-item" v-for="(item,index) in itemList" :key="index" @click="friendItemClick(index)">
			<view class="detail-item-title">
				<text class="title-rank">{{item.rank}}</text>
				<image class="title-icon" :src="item.avatar"></image>
				<text class="detail-title main-text-color">{{item.nick}}</text>
			</view>
			<view class="detail-item-msg">
				<image class="detail-icon" :src="item.hasCoins? '../../static/coin_light_icon.png':'../../static/coin_unlight_icon.png'"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemList: []
			}
		},
		onNavigationBarButtonTap(e) {
			console.log("开始")		
		},
		onLoad() {
			var vData = this;
			this.requestFriendList(function(success,data){
				var me = data.me;
				var friendList = data.friends;
				if(friendList){
					friendList.unshift(me);
					vData.itemList = friendList;
				}
			})
		},
		methods: {
			friendItemClick(){
				
			}
		}
	}
</script>

<style>
	.detail-item{
		width: 100%;
		height: 100rpx;
		border-bottom: #dddddd solid 1px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.detail-title{
		margin-left: 16rpx;
		font-size: 32rpx;
	}
	.title-rank{
		margin-left: 30rpx;
		font-weight: 700;
		font-size: 30rpx;
		color: orangered;
		width: 40rpx;
		text-align: center;
	}
	.title-icon{
		width: 70rpx;
		height: 70rpx;
		margin-left: 30rpx;
		border-radius: 50%;
	}
	.detail-item-msg,.detail-item-title{
		display: flex;
		align-items: center;
	}
	.detail-icon{
		width: 45rpx;
		height: 45rpx;
		margin-right: 30rpx;
	}
</style>
