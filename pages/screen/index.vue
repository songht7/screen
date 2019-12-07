<template>
	<view class="content">
		<block v-if="bgIs=='video'">
			<video class="video" id="MeetVideo" :autoplay="autoplay" :loop="loop" :muted="muted" :src="video">
				<block v-for="(obj,k) in list" :key="k">
					<cView :list="obj" :bubble="bubble" :shaneType="sType" :txtType="txtType"></cView>
				</block>
				<cover-view class="typeBox" v-if="tstBtns">
					<view class="typeBtn" @click="test">测试</view>
					<view class="typeBtn" @click="setTxtType('textFlash')">发光</view>
					<view class="typeBtn" @click="setTxtType('gradual')">渐变</view>
					<view class="typeBtn" @click="changeShaneType">切换</view>
					<view class="typeBtn" v-if="$store.state.socketErr" @click="$store.dispatch('connectSocket')">{{$store.state.socketErr}}</view>
				</cover-view>
			</video>
		</block>
		<block v-else>
			<block v-for="(obj,k) in list" :key="k">
				<cView :list="obj" :bubble="bubble" :shaneType="sType" :txtType="txtType"></cView>
			</block>
		</block>
	</view>
</template>

<script>
	import cView from "../../components/c-view.vue"
	export default {
		data() {
			return {
				autoplay: true,
				loop: true,
				muted: true,
				video: "/static/video.mp4",
				bubble: "./static/bubble.svg",
				bgIs: "video",
				sType: "floating", //fadeUpOut 上浮 floating 固定闪耀
				txtType: "textFlash", //gradual 渐变 textFlash 发光
				list: [],
				tstBtns: true
			}
		},
		onLoad() {},
		onShow() {
			var that = this;
			this.$store.dispatch("connectSocket")
			uni.onSocketOpen(function(res) {
				console.log('WebSocket连接已打开！');
			});
			that.getList();
		},
		onHide() {
			this.sendSocketMessage('space_close')
		},
		onUnload() {
			this.sendSocketMessage('space_close')
		},
		components: {
			cView
		},
		computed: {},
		methods: {
			getList() {
				var that = this;
				var _data = {};
				_data["fun"] = function(res) {
					console.log(res)
					if (res.data != 'space_close') {
						var _list = that.list;
						let p = {
							"name": res.data
						}
						setTimeout(() => {
							_list.push(p);
						}, 2500)
					}
				}
				that.$store.dispatch("onSocketMessage", _data)
			},
			sendSocketMessage(val) {
				var that = this;
				that.up = true;
				that.paused = "running";
				let _data = {
					"msg": val
				};
				_data["fun"] = function() {
					setTimeout(() => {
						that.up = false;
						that.paused = "paused";
					}, 3000)
				}
				console.log(_data);
				that.$store.dispatch("sendSocketMessage", _data)
			},
			changeShaneType() {
				this.sType = this.sType == "floating" ? "fadeUpOut" : "floating";
			},
			test() {
				var that = this;
				var _list = that.list;
				let p = {
					"name": "测试字"
				}
				_list.push(p);
			},
			setTxtType(type) {
				var that = this;
				that.txtType = type;
			}
		}
	}
</script>

<style>
	page {
		width: 100%;
		height: 100%;
	}

	.content {
		width: 100%;
		height: 100%;
		background: url(../../static/bg-scren.jpg) no-repeat 50% 50% #152152;
		background-size: contain;
	}

	#MeetVideo {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.typeBox {
		position: absolute;
		z-index: 1;
		right: 5%;
		bottom: 5%;
	}

	.typeBtn {
		color: #FFFFFF;
		font-size: 12upx;
		line-height: 1.4;
	}
</style>
