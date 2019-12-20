<template>
	<view class="content" :style="{'background-image':bgIs=='img'?'url(../../static/bg-scren.jpg)':'none'}">
		<block v-if="!switchBtn">
			<block v-if="bgIs=='video'">
				<video class="video" id="MeetVideo" :autoplay="autoplay" :loop="loop" :muted="muted" :src="videoUrl+videoKey+'.mp4'">
					<block v-for="(obj,k) in list" :key="k">
						<cView :list="obj" :ckey="k" :bubble="bubble" :duration="animationDuration" :animationCount="animationCount"
						 :shaneType="shaneType" :txtType="txtType"></cView>
					</block>
					<cover-view class="typeBox screen-type-box">
						<view class="typeBtn screen-tst socketErr" v-if="$store.state.socketErr" @click="$store.dispatch('connectSocket')">{{$store.state.socketErr}}</view>
						<view class="typeBtn screen-tst" v-if="false" @click="test">测试</view>
					</cover-view>
				</video>
			</block>
			<block v-else v-for="(obj,k) in list" :key="k">
				<cView :list="obj" :ckey="k" :bubble="bubble" :shaneType="shaneType" :txtType="txtType"></cView>
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
				videoUrl: "http://plbs-test-1257286922.cos.ap-shanghai.myqcloud.com/data/media_doc/",
				videoKey: "1576684104",
				videoType: "video", //video:签到视频 1576684104 blessing：寄语视频 1576684357
				bubble: "./static/bubble.svg",
				bgIs: "video", //背景video img
				shaneType: "floating", //fadeUpOut 上浮 floating 固定闪耀 danmu 右到左
				txtType: "textFlash", //gradual 渐变 textFlash 发光
				animationCount: "6", //闪耀次数
				animationDuration: "3s", //闪耀时间
				list: [],
				listStorage: [], //list 存储
				listDelay: [], //延时存储
				clearLi: false, //是否清除list
				tstBtns: true, //测试按钮
				shakeSwitchState: false,
				fixedPosition: 19, //固定位置数0-max
				getContNumb: 3, //同时获取个数 Math.floor(Math.random() * (5 - 1) + 1)
				fixedType: true, //是否固定 true false
				switchBtn: false,
				delayTime: 25000, //延迟显示时间
				clearTime: 25000, //清除list时间
				clearState: true, //是否清除list
				setListTime: 5000, //每N秒设置list
				ckListStorage: 0, //计时检测是否获取到数据
				countDelay: 0, //计时检测是否获取到数据
				getDataType: 'api' //接受、发送数据方式api，socket
			}
		},
		onLoad(option) {
			var that = this;
			let btn = option.btn ? true : false;
			let _videoType = option.type ? '1576684357' : "1576684104";
			that.videoType = _videoType == '1576684104' ? 'video' : 'blessing';
			that.videoKey = _videoType;
			if (_videoType == '1576684357') {
				that.fixedPosition = 8;
				that.getContNumb = 4;
				that.clearTime = 50000;
				that.setListTime = 2000;
				that.delayTime = 1;
				that.clearState = false;
				that.animationCount = "4";
				that.animationDuration = "2s";
			}
			that.switchBtn = btn;
			if (btn) {
				that.$store.dispatch("getSystemInfo")
			}
			//that.shakeSwitch('activityCheck');
		},
		onShow() {
			var that = this;
			var _getDataType = that.getDataType;
			var _setListTime = that.setListTime;
			that.$store.dispatch("connectSocket")
			uni.onSocketOpen(function(res) {
				console.log('WebSocket连接已打开！');
				that.$store.state.socketErr = "";
			});
			that.shakeSwitch('activityCheck');
			that.getList();
			setInterval(() => {
				that.sendSocketMessage('heart')
			}, 50000);
			setInterval(() => {
				that.setList();
			}, _setListTime); //20000
		},
		onHide() {
			var that = this;
			//var _getDataType = that.getDataType;
			that.sendSocketMessage('space_close')
		},
		onUnload() {
			var that = this;
			//var _getDataType = that.getDataType;
			that.sendSocketMessage('space_close')
		},
		components: {
			cView
		},
		computed: {},
		methods: {
			getList() {
				var that = this;
				var _getDataType = that.getDataType;
				var _data = {};
				_data["fun"] = function(res) {
					console.log(res)
					if (res.data != 'space_close') {
						var _data = res.data;
						if (_data == '') {
							return
						}
						var vType = that.videoType;
						var p = {};
						if (vType == 'video') {
							var bles = _data.split('[|]');
							if (bles && bles[0] == 'sign') {
								var pos = that.loopPosition();
								if (_getDataType == 'socket') {
									p = {
										"name": res.data,
										"position": pos //pos 'random';
									}
								} else {
									p = {
										"name": bles[1],
										"position": pos //pos 'random';
									}
								}
							}
						} else {
							var bles = _data.split('[|]');
							if (bles && bles[0] == 'blessing') {
								var pos = that.loopPosition();
								p = {
									"name": bles[1],
									"city": bles[2],
									"blessing": bles[3],
									"position": pos, // pos 'random'
									"danmu": true
								}
								//that.shaneType = 'danmu';
							}
						}
						if (p.name) {
							that.listDelay.push(p)
							var _delayTime = that.delayTime;
							setTimeout(() => {
								let _listDelay = that.listDelay;
								var _listStorage = that.listStorage;
								that.listStorage = [..._listStorage, ..._listDelay];
								that.listDelay = [];
								//that.listStorage.push(p);
								that.setListStorage();
								if (vType == 'blessing') {
									that.delayTime = 1;
								}
							}, _delayTime)
						}
					}
				}
				that.$store.dispatch("onSocketMessage", _data)
			},
			setList() {
				var that = this;
				var _listStorag = that.listStorage.length ? that.listStorage : [];
				if (_listStorag.length <= 0) {
					uni.getStorage({
						key: 'listStorage',
						success(res) {
							_listStorag = res.data.length ? res.data : _listStorag;
							that.setPageList(_listStorag);
							// console.log("getList-res:", res.data);
						},
						complete() {}
					});
				} else {
					that.setPageList(_listStorag);
				}
			},
			setPageList(_listStorag) {
				var that = this;
				console.log("getList-listStorage:", _listStorag);
				that.checkListStorage(_listStorag);
				if (_listStorag.length) {
					var _fixedPosition = that.fixedPosition;
					var _getContNumb = that.getContNumb;
					var temp = _listStorag.filter((obj, k) => k < _getContNumb); //_fixedPosition
					var nowList = that.list;
					that.list = [...nowList, ...temp];
					console.log("---list---", that.list);
					var leftover = _listStorag.filter((obj, k) => k >= _getContNumb);
					that.listStorage = leftover;
					that.setListStorage();
					// console.log("leftover：", that.listStorage)
					// console.log("list：", that.list)
					if (that.list.length >= _fixedPosition * 2) {
						//that.clearList('1')
						if (!that.clearLi) {
							that.clearLi = true;
						}
						var _clearTime = that.clearTime;
						setTimeout(() => {
							if (that.clearLi) {
								that.clearList('1')
							}
						}, _clearTime)
					}
				} else {
					if (that.list.length > 0) {
						if (!that.clearLi) {
							that.clearLi = true;
						}
						var _clearTime = that.clearTime;
						setTimeout(() => {
							if (that.clearLi) {
								that.clearList('2')
							}
						}, _clearTime)
					}
				}
			},
			clearList(type) {
				console.log("to-clearList-:", type)
				var that = this;
				if (that.clearState) {
					let _list = that.list;
					that.clearLi = false;
					that.list = _list.filter((obj, k) => k > that.getContNumb);
					console.log("clearList, list:", that.list)
				}
			},
			setListStorage() {
				var that = this;
				var _listStorag = that.listStorage;
				//console.log("setListStorage:", _listStorag)
				uni.setStorage({
					key: 'listStorage',
					data: _listStorag,
					success: function() {
						//console.log('success');
					}
				});
			},
			checkListStorage(data) {
				var that = this;
				that.countDelay += 2;
				console.log(that.countDelay)
				if (that.countDelay >= 200) {
					that.countDelay = 0;
					setTimeout(() => {
						that.list = [];
					}, 8000)
					that.delayTime = 9000;
				}
				if (data.length <= 0) {
					that.ckListStorage += 2;
					if (that.ckListStorage >= 12) {
						that.list = [];
						that.ckListStorage = 0;
						//console.log("ckl-1:", that.list)
					}
				} else {
					that.ckListStorage = 0;
					//console.log("ckl-2")
				}
				//console.log(that.ckListStorage)
			},
			sendSocketMessage(val) {
				var that = this;
				that.up = true;
				that.paused = "running";
				let _data = {
					"msg": val
				};
				_data["fun"] = function() {
					// setTimeout(() => {
					// 	that.up = false;
					// 	that.paused = "paused";
					// }, 3000)
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
				let _fixedPosition = that.fixedPosition;
				let _random = _rPosition + 1;
				if (_random > _fixedPosition) {
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
			test(type) {
				var that = this;
				var vType = that.videoType;
				var pos = that.loopPosition();
				var p = {};
				if (vType == 'video') {
					p = {
						"name": "恒洁洁" + pos,
						"position": pos //pos 'random';
					}
				} else {
					p['name'] = "恒洁洁" + pos;
					p['city'] = "上海";
					p['blessing'] = "欢迎莅临恒洁2020年度经销商大会";
					p['position'] = pos; // pos;
					p['danmu'] = true;
					//that.shaneType = 'danmu';//设置显示风格
				}
				//that.clearState = false; /**************测试阻止清除list *************/
				console.log(p)
				that.listDelay.push(p);
				var _delayTime = that.delayTime; // that.delayTime; 测试用 10000
				setTimeout(() => {
					let _listDelay = that.listDelay;
					var _listStorage = that.listStorage;
					that.listStorage = [..._listStorage, ..._listDelay];
					that.listDelay = [];
					that.setListStorage();
				}, _delayTime)
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
