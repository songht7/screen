<template>
	<!-- shine>50?'shine big':'', -->
	<cover-view :class="['coverView',shaneType,'c-'+ckey,list.danmu?'coverView-danmu':'']" :data-pos="list.position?list.position:''" :style="shaneType=='floating'?(list.position=='random'?{'left':randomLeft,'bottom':randomBottom}:(list.danmu?dmPosition[list.position]:signPosition[list.position])):{'left':randomLeft,'bottom':randomBottom}">
		<view class="cover-block">
			<img :src="bubble" class="bubble" v-if="bubbleShow" />
			<view :class="['cover-name',txtType]">
				{{list.name}} {{list.city?list.city:''}}
			</view>
			<view v-if="list.blessing" :class="['cover-name',txtType,'cover-blessing']">
				{{list.blessing}}
			</view>
		</view>
	</cover-view>
</template>

<script>
	export default {
		name: "c-view",
		props: {
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			ckey: {
				type: Number,
				default: 0
			},
			shaneType: {
				type: String,
				default: ""
			},
			txtType: {
				type: String,
				default: "textFlash"
			},
			bubble: {
				type: String,
				default: ""
			},
			bubbleShow: {
				type: Boolean,
				default: false
			},
			animationCount: { //floating:infinite / 6, fadeUpOut:1
				type: String,
				default: "6"
			},
			duration: { //animation-duration 3s/2s
				type: String,
				default: "3s"
			}
		},
		data() {
			return {
				signPosition: [{
					"left": '12%',
					"bottom": "55%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '38%',
					"bottom": "70%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '60%',
					"bottom": "70%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '32%',
					"bottom": "40%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '20%',
					"bottom": "60%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '22%',
					"bottom": "40%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '73%',
					"bottom": "60%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '32%',
					"bottom": "82%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '60%',
					"bottom": "40%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '40%',
					"bottom": "25%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '70%',
					"bottom": "82%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '55%',
					"bottom": "25%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '28%',
					"bottom": "25%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '77%',
					"bottom": "75%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '20%',
					"bottom": "82%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '48%',
					"bottom": "75%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '27%',
					"bottom": "70%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '55%',
					"bottom": "85%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '18%',
					"bottom": "25%",
					"animation-iteration-count": this.animationCount
				}, {
					"left": '45%',
					"bottom": "40%",
					"animation-iteration-count": this.animationCount
				}],
				dmPosition: [{
					"left": '2%',
					"bottom": "55%",
					"animation-duration": this.duration,
					"animation-iteration-count": this.animationCount
				}, {
					"left": '16%',
					"bottom": "23%",
					"animation-duration": this.duration,
					"animation-iteration-count": this.animationCount
				}, {
					"left": '18%',
					"bottom": "75%",
					"animation-duration": this.duration,
					"animation-iteration-count": this.animationCount
				}, {
					"left": '35%',
					"bottom": "70%",
					"animation-duration": this.duration,
					"animation-iteration-count": this.animationCount
				}, {
					"left": '52%',
					"bottom": "75%",
					"animation-duration": this.duration,
					"animation-iteration-count": this.animationCount
				}, {
					"left": '68%',
					"bottom": "55%",
					"animation-duration": this.duration,
					"animation-iteration-count": this.animationCount
				}, {
					"left": '32%',
					"bottom": "30%",
					"animation-duration": this.duration,
					"animation-iteration-count": this.animationCount
				}, {
					"left": '50%',
					"bottom": "25%",
					"animation-duration": this.duration,
					"animation-iteration-count": this.animationCount
				}, {
					"left": '20%',
					"bottom": "50%",
					"animation-duration": this.duration,
					"animation-iteration-count": this.animationCount
				}]
			};
		},
		computed: {
			randomLeft() {
				let random = Math.floor(Math.random() * (80 - 10) + 10);
				//console.log("random:", random);
				return random + "%";
			},
			randomBottom() {
				let random = Math.floor(Math.random() * (70 - 10) + 10);
				//console.log("random:", random);
				return random + "%";
			},
			shine() {
				let _shine = Math.floor(Math.random() * (100 - 1) + 1);
				//console.log(_shine);
				return _shine;
			}
		},
		methods: {}
	}
</script>

<style>
	.coverView {
		/* width: 100upx;
		height: 100upx; */
		position: absolute;
		overflow: initial;
		bottom: 2%;
		opacity: 0.5;
	}

	.coverView-danmu {
		width: 250px;
		height: auto;
	}

	uni-cover-view.coverView-danmu {
		white-space: pre-wrap;
		word-break: break-all;
	}

	.fadeUpOut {
		animation-name: fadeUpOut;
		animation-duration: 15s;
		animation-timing-function: linear;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
		/* animation-play-state: paused; */
	}

	.floating {
		opacity: 0;
		animation-name: floating;
		animation-duration: 3s;
		animation-direction: alternate;
		animation-timing-function: linear;
		animation-iteration-count: 6;
		animation-fill-mode: none;
	}

	.big {
		width: 115upx;
		height: 115upx;
	}

	.shine:before {
		content: " ";
		width: 0;
		height: 0;
		border-radius: 50%;
		box-shadow: 0 0 6upx 6upx #FFFFFF;
		background: #FFFFFF;
		position: absolute;
		right: -10%;
		top: 30%;

		animation-name: shine;
		animation-duration: 2s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-direction: alternate;
		opacity: 0;
	}

	.shine:after {
		content: " ";
		width: 0;
		height: 0;
		border-radius: 50%;
		box-shadow: 0 0 5upx 5upx #FFFFFF;
		background: #FFFFFF;
		position: absolute;
		left: -5%;
		top: 80%;

		animation-name: shine;
		animation-duration: 3s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-direction: alternate;
		opacity: 0;
	}

	@keyframes fadeUpOut {
		0% {
			bottom: 2%;
		}

		10% {
			opacity: 0.8;
		}

		30% {
			opacity: 1;
		}

		100% {
			opacity: 1;
			bottom: 120%;
		}
	}

	@keyframes floating {
		from {
			opacity: 0.1;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes shine {
		from {
			opacity: 0.1;
		}

		to {
			opacity: 1;
		}
	}

	.cover-block {
		width: 100%;
		height: 100%;
		line-height: 0;
		position: relative;
	}

	.cover-name {
		color: #FFF;
		z-index: 2;
		font-size: 10upx;
		/*8upx*/
		/* position: absolute; */
		top: 0;
		line-height: 1.4;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;
	}

	.coverView-danmu .cover-name {
		justify-content: flex-start;
		font-size: 8upx;
	}

	.floating .cover-name {
		color: #CB937D;
		background-size: 100% 100%;
	}

	.textFlash {
		animation-name: flash;
		animation-duration: 1.5s;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
		animation-direction: alternate;
		/* animation-play-state: paused; */
	}

	.cover-name.gradual {
		background-image: -webkit-linear-gradient(left, #CBB281, #DB9824);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		background-size: 200% 100%;
		animation: masked-animation 4s infinite linear;
		/* animation-play-state: paused; */
	}

	@keyframes masked-animation {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: -100% 0;
		}
	}

	@keyframes flash {
		from {
			text-shadow: 0 0 5px #CBB281,
				0 0 10px #CBB281,
				0 0 35px #DB9824,
				0 0 40px #DB9824;
		}

		to {
			text-shadow: 0 0 10px #CBB281,
				0 0 20px #CBB281,
				0 0 40px #DB9824,
				0 0 70px #DB9824;
		}

		/* from {
			text-shadow: 0 0 5px #CBB281,
				0 0 10px #CBB281,
				0 0 15px #CBB281,
				0 0 20px #DB9824,
				0 0 35px #DB9824,
				0 0 40px #DB9824,
				0 0 50px #DB9824,
				0 0 75px #DB9824;
		}
		
		to {
			text-shadow: 0 0 10px #CBB281,
				0 0 20px #CBB281,
				0 0 30px #CBB281,
				0 0 40px #DB9824,
				0 0 70px #DB9824,
				0 0 80px #DB9824,
				0 0 100px #DB9824,
				0 0 150px #DB9824;
		} */
	}

	.bubble {
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.danmu {
		opacity: 0;
		animation-name: danmu;
		animation-duration: 60s;
		animation-timing-function: ease-in-out;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
	}

	@keyframes danmu {
		0% {
			left: 110%;
			opacity: 0;
		}

		5% {
			opacity: 0.5;
		}

		10% {
			opacity: 0.8;
		}

		30% {
			opacity: 1;
		}

		100% {
			opacity: 1;
			left: -110%;
		}
	}
</style>
