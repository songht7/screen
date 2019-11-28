<template>
	<view class="content">
		<block v-if="bgIs=='video'">
			<video class="video" id="MeetVideo" :autoplay="autoplay" :loop="loop" :muted="muted" src="/static/video.mp4">
				<block v-for="(obj,k) in list" :key="k">
					<cView :list="obj" :bubble="bubble" :shaneType="sType"></cView>
				</block>
			</video>
		</block>
		<block else>
			<block v-for="(obj,k) in list" :key="k">
				<cView :list="obj" :bubble="bubble" :shaneType="sType"></cView>
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
				bubble: "./static/bubble.svg",
				bgIs: "img",
				sType: "floating",//fadeUpOut floating
				list: []
			}
		},
		onLoad() {
			this.$store.dispatch("connectSocket")
		},
		onShow() {
			var that = this;
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
				// let si = setTimeout(() => {
				// 	var _list = that.list;
				// 	//console.log(_left);
				// 	let p = {
				// 		"name": "赵钱孙"
				// 	}
				// 	_list.push(p);
				// }, 1000)
				// =============
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
</style>
