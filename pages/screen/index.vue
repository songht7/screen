<template>
	<view class="content">
		<video class="video" id="MeetVideo" :autoplay="autoplay" :loop="loop" :muted="muted" src="/static/video.mp4">
			<block v-for="(obj,k) in list" :key="k">
				<cView :list="obj" :bubble="bubble"></cView>
			</block>
		</video>
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
			this.$store.dispatch("closeSocket")
		},
		onUnload() {
			this.$store.dispatch("closeSocket")
		},
		components: {
			cView
		},
		computed: {},
		methods: {
			getList() {
				var that = this;
				// let si = setInterval(() => {
				// 	var _list = that.list;
				// 	//console.log(_left);
				// 	let p = {
				// 		"name": "赵钱孙"
				// 	}
				// 	_list.push(p);
				// }, 2000)
				// =============
				var _data = {};
				_data["fun"] = function(res) {
					var _list = that.list;
					console.log(res)
					let p = {
						"name": res.data
					}
					setTimeout(() => {
						_list.push(p);
					}, 2500)
				}
				that.$store.dispatch("onSocketMessage", _data)
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
	}

	#MeetVideo {
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>
