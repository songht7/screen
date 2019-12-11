<template>
	<view class="content">
		<block v-if="bgIs=='video'">
			<video class="video" id="MeetVideo" :autoplay="autoplay" :loop="loop" :muted="muted" :src="video">
				<block v-for="(obj,k) in list" :key="k">
					<cView :list="obj" :ckey="k" :bubble="bubble" :shaneType="sType" :txtType="txtType"></cView>
				</block>
				<cover-view class="typeBox">
					<view class="typeBtn socketErr" v-if="$store.state.socketErr" @click="$store.dispatch('connectSocket')">{{$store.state.socketErr}}</view>
					<text class="nav">—</text>
					<view class="typeBtn shakeSwitch" @click="shakeSwitch('')">
						<text class="navBtn">{{shakeSwitchState?'关闭':'开启'}}助力</text>
					</view>
					<block v-if="tstBtns">
						<view class="typeBtn" @click="test">测试</view>
						<view class="typeBtn" @click="reset">清空</view>
						<view class="typeBtn" @click="setTxtType('textFlash')">发光</view>
						<view class="typeBtn" @click="setTxtType('gradual')">渐变</view>
						<view class="typeBtn" @click="changeShaneType">切换</view>
						<view class="typeBtn" @click="closeTst">关闭测试按钮</view>
					</block>
				</cover-view>
			</video>
		</block>
		<block v-else>
			<block v-for="(obj,k) in list" :key="k">
				<cView :list="obj" :ckey="k" :bubble="bubble" :shaneType="sType" :txtType="txtType"></cView>
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
				bgIs: "video", //背景video img
				sType: "floating", //fadeUpOut 上浮 floating 固定闪耀 danmu 右到左
				txtType: "textFlash", //gradual 渐变 textFlash 发光
				list: [],
				tstBtns: true,
				shakeSwitchState: false,
				fixedPosition: 14, //固定位置数0-max
				fixedType: true //是否固定 true false
			}
		},
		onLoad() {
			//that.shakeSwitch('activityCheck');
		},
		onShow() {
			var that = this;
			this.$store.dispatch("connectSocket")
			uni.onSocketOpen(function(res) {
				console.log('WebSocket连接已打开！');
				that.$store.state.socketErr = "";
			});
			that.shakeSwitch('activityCheck');
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
						var _data = res.data;
						var bles = _data.split(',');
						var p = {
							"name": res.data
						}
						if (bles && bles[0] == 'blessing') {
							p = {
								"name": bles[1],
								"city": bles[2],
								"blessing": bles[3],
								"position": 'random'
							}
						} else {
							let pos = that.loopPosition();
							p['position'] = pos; //pos 'random';
						}
						setTimeout(() => {
							_list.push(p);
						}, 30000)
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
			shakeSwitch(type) {
				var that = this;
				var shakeSwitchState = that.shakeSwitchState;
				var _inter = type ? type : (shakeSwitchState ? 'activityStop' : 'activityStart');
				console.log(shakeSwitchState, _inter)
				let _data = {
					"inter": _inter
				};
				_data["fun"] = function(res) {
					if (res) {
						that.shakeSwitchState = res == 'on' ? true : false;
					}
				}
				that.$store.dispatch("getData", _data)

			},
			loopPosition() {
				var that = this;
				let _rPosition = that.$store.state.rPosition;
				let _random = _rPosition + 1;
				if (_random > that.fixedPosition) {
					_random = 0
				}
				that.$store.state.rPosition = _random;
				if (!that.fixedType) {
					_random = 'random';
				}
				return _random;
			},
			changeShaneType() {
				this.sType = this.sType == "floating" ? "fadeUpOut" : "floating";
			},
			test() {
				var that = this;
				var _list = that.list;
				let p = {
					"name": "恒洁洁",
					// "city":"上海",
					// "danmu":"欢迎莅临恒洁2020年度经销商大会"
				}
				let pos = that.loopPosition();
				p['position'] = pos; //pos 'random';
				console.log(p)
				setTimeout(() => {
					_list.push(p);
				}, 1000)
			},
			setTxtType(type) {
				var that = this;
				that.txtType = type;
			},
			reset() {
				this.list = [];
			},
			closeTst() {
				this.tstBtns = false
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
		right: 1%;
		top: 1%;
		text-align: right;
		line-height: 0;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		align-items: flex-end;
	}

	.typeBtn,
	.nav {
		color: #FFFFFF;
		font-size: 12upx;
		line-height: 1.4;
		cursor: pointer;
		display: none;
	}

	.socketErr {
		display: inline-block;
	}

	.nav {
		display: inline;
		position: relative;
		line-height: 1.2;
		opacity: 0.5;
	}

	.typeBox:hover .typeBtn {
		display: block;
	}

	.typeBox:hover .nav {
		display: none;
	}

	.nav:before,
	.nav:after {
		content: "—";
		color: inherit;
		font-size: inherit;
		position: absolute;
		top: 20%;
		left: 0;
		line-height: 0;
	}

	.nav:after {
		top: auto;
		bottom: 20%;
	}
</style>
