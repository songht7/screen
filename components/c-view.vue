<template>
	<!-- shine>50?'shine big':'', -->
	<cover-view :class="['coverView',shaneType]" :style="{'left':randomLeft,'bottom':shaneType=='floating'?randomBottom:'2%'}">
		<view class="cover-block">
			<img :src="bubble" class="bubble" v-if="bubbleShow" />
			<view :class="['cover-name',txtType]">
				{{list.name}} {{list.city?list.city:''}}
			</view>
			<view v-if="list.blessing" :class="['cover-name',txtType]">
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
			}
		},
		data() {
			return {

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
		animation-duration: 5s;
		animation-direction: alternate;
		animation-timing-function: linear;
		animation-iteration-count: 6;
		/* 6; infinite*/
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
			opacity: 0.3;
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
		font-size: 24upx;
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
</style>
