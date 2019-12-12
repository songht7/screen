<template>
	<view class="content" :style="{'background-image':bgIs=='img'?'url(../../static/bg-scren.jpg)':'none'}">
		<block v-if="!switchBtn">
			<block v-if="bgIs=='video'">
				<video class="video" id="MeetVideo" :autoplay="autoplay" :loop="loop" :muted="muted" :src="video">
					<block v-for="(obj,k) in list" :key="k">
						<cView :list="obj" :ckey="k" :bubble="bubble" :shaneType="sType" :txtType="txtType"></cView>
					</block>
					<cover-view class="typeBox screen-type-box">
						<view class="typeBtn screen-tst socketErr" v-if="$store.state.socketErr" @click="$store.dispatch('connectSocket')">{{$store.state.socketErr}}</view>
						<view class="typeBtn screen-tst" v-if="!false" @click="test">测试</view>
					</cover-view>
				</video>
			</block>
			<block v-else v-for="(obj,k) in list" :key="k">
				<cView :list="obj" :ckey="k" :bubble="bubble" :shaneType="sType" :txtType="txtType"></cView>
			</block>
		</block>
		<block v-else>
			<view class="typeBox switchBtns">
				<text class="nav" v-show="false">—</text>
				<view class="typeBtn shakeSwitch" @click="shakeSwitch('')" :style="{'font-size':$store.state.systemInfo.platform=='other'?'32px':'48upx'}">
					<text class="navBtn">{{shakeSwitchState?'关闭':'开启'}}助力</text>
				</view>
				<block v-if="!tstBtns">
					<view class="typeBtn" @click="test">测试</view>
					<view class="typeBtn" @click="reset">清空</view>
					<view class="typeBtn" @click="setTxtType('textFlash')">发光</view>
					<view class="typeBtn" @click="setTxtType('gradual')">渐变</view>
					<view class="typeBtn" @click="changeShaneType">切换</view>
					<view class="typeBtn" @click="closeTst">关闭测试按钮</view>
				</block>
			</view>
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
				listStorage: [], //list 存储
				listDelay: [], //延时存储
				clearLi: false, //是否清除list
				tstBtns: true, //测试按钮
				shakeSwitchState: false,
				fixedPosition: 19, //固定位置数0-max
				getContNumb: Math.floor(Math.random() * (5 - 1) + 1), //同时获取个数
				fixedType: true, //是否固定 true false
				switchBtn: false
			}
		},
		onLoad(option) {
			var that = this;
			let btn = option.btn ? true : false;
			console.log(btn)
			that.switchBtn = btn;
			if (btn) {
				that.$store.dispatch("getSystemInfo")
			}
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
			setInterval(() => {
				that.setList();
			}, 5000); //20000
			// setTimeout(() => {
			// 	that.setList();
			// }, 10000);
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
						that.listDelay.push(p)
						setTimeout(() => {
							let _listDelay = that.listDelay;
							var _listStorage = that.listStorage;
							that.listStorage = [..._listStorage, ..._listDelay];
							that.listDelay = [];
							//that.listStorage.push(p);
							that.setListStorage();
						}, 25000)
					}
				}
				that.$store.dispatch("onSocketMessage", _data)
			},
			setList() {
				var that = this;
				uni.getStorage({
					key: 'listStorage',
					success: function(res) {
						var _listStorag = res.data.length ? res.data : that.listStorage;
						console.log("getList:", _listStorag);
						if (_listStorag.length) {
							var _fixedPosition = that.fixedPosition;
							var _getContNumb = that.getContNumb;
							var temp = _listStorag.filter((obj, k) => k <= _getContNumb); //_fixedPosition
							var nowList = that.list;
							that.list = [...nowList, ...temp];
							var leftover = _listStorag.filter((obj, k) => k > _getContNumb);
							that.listStorage = leftover;
							that.setListStorage();
							console.log("leftover：", that.listStorage)
							console.log("list：", that.list)
							if (that.list.length > _fixedPosition) {
								console.log("to-clearList-1:")
								if (!that.clearLi) {
									that.clearLi = true;
								}
								setTimeout(() => {
									if (that.clearLi) {
										that.clearList()
									}
								}, 19000)
							}
						} else {
							console.log("to-clearList-2:")
							if (!that.clearLi) {
								that.clearLi = true;
							}
							setTimeout(() => {
								if (that.clearLi) {
									that.clearList()
								}
							}, 19000)
						}
					}
				});
			},
			clearList() {
				this.list = this.list.filter((obj, k) => k > 10);
				this.clearLi = false;
				console.log("clearList, list:", this.list)
			},
			setListStorage() {
				var that = this;
				var _listStorag = that.listStorage;
				console.log("setListStorage:", _listStorag)
				uni.setStorage({
					key: 'listStorage',
					data: _listStorag,
					success: function() {
						//console.log('success');
					}
				});
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
				let p = {
					"name": "恒洁洁",
					// "city":"上海",
					// "danmu":"欢迎莅临恒洁2020年度经销商大会"
				}
				let pos = that.loopPosition();
				p['position'] = pos; //pos 'random';
				console.log(p)
				that.listDelay.push(p);
				setTimeout(() => {
					let _listDelay = that.listDelay;
					var _listStorage = that.listStorage;
					that.listStorage = [..._listStorage, ..._listDelay];
					that.listDelay = [];
					that.setListStorage();
				}, 25000)
				// setTimeout(() => {
				// 	that.setList();
				// }, 10000)
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
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-color: #152152;
		background-size: contain;
	}

	#MeetVideo {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.switchBtns {
		width: 50%;
		margin: 0 auto;
		padding: 50upx 0 0;
	}

	.typeBox {
		text-align: right;
		line-height: 1.4;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		align-items: center;
	}

	.typeBtn,
	.nav {
		color: #FFFFFF;
		font-size: 48upx;
		line-height: 1.4;
		cursor: pointer;
		/* display: none; */
	}

	.screen-type-box {
		position: absolute;
		z-index: 1;
		right: 1%;
		top: 1%;
		line-height: 0;
		align-items: flex-end;
	}

	.screen-tst {
		font-size: 16px;
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

	/* 	.typeBox:hover .typeBtn {
		display: block;
	}

	.typeBox:hover .nav {
		display: none;
	} */

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
