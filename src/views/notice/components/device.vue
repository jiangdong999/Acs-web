<template>
	<div class="preview">
		<div class="device">
			预览效果 &emsp;
			<el-radio-group v-model="viewType">
				<el-radio label="1">横屏</el-radio>
				<el-radio label="2">竖屏</el-radio>
			</el-radio-group>
			<div v-show="viewType=='1'" >
				<div class="screen transverse" v-if="content.contextType=='1'">
					<div>
						<h3>{{content.title}}</h3>
						<!--<span>{{htmlstr}}</span>-->
						<p><span v-html="htmlstr"></span></p>
						<div>{{content.publishers}}
							<div>{{content.time[0] | transTime }}</div>
						</div>
					</div>
				</div>
				<div class="screen1 transverse" v-else>
					<div>
						<!-- <h3>{{content.title}}</h3> -->
						<img :src="content.context">
					</div>
				</div>
			</div>
			<div v-show="viewType=='2'">
				<div class="screen vertical" v-if="content.contextType=='1'">
					<div>
						<h3 class="ellipsis">{{content.title}}</h3>
						<!--<span>{{htmlstr}}</span>-->
						<p><span v-html="htmlstr"></span></p>
						<div>{{content.publishers}}
							<div>{{content.time[0] | transTime }}</div>
						</div>
					</div>
				</div>
				<div class="screen1 vertical" v-else>
					<div>
						<!-- <h3>{{content.title}}</h3> -->
						<img :src="content.context">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {transTime} from "@/filters/notice";
export default {
	filters:{transTime},
	props:['content','htmlstr'],
	data(){
		return {
			viewType: '1',

		}
	}
}
</script>

<style lang="scss" scoped>
	.preview{
		text-align: center;
	}
	.device{
		background-color: #E4E4E4;
		margin: 0 26px;
		padding: 26px;
		border-radius: 6px;
	}
	.screen{
		padding: 0px 30px 20px;
	}
	.screen,.screen1{
		margin: 0 auto;
		background-color: #fff;
		margin-top: 25px;
		>div{
			height: 100%;
			// img{
			// 	width: 100%;
			// }
			h3{
				font-size: 16px;
				color: #ff5252;
				text-align: center;
				height: auto;
				width: 100%;
			}
			p{
				font-size: 12px;
				color: #151515;
				line-height: 16px;
				word-break:break-word;
				text-align: left;
				white-space: pre-wrap;
				margin: 0;
			}
			div{
				font-size: 12px;
				line-height: 16px;
				color: #151515;
				text-align: right
			}
		}
	}
	.transverse{
		// width: 430px;
		// height: 254px;
		width: 406px;
		height: 255px;
		overflow-y: hidden;
		img{
			width: 100%;
		}
	}
	.vertical{
		// width: 210px;
		// height: 450px;
		width: 335px;
		height: 406px;
		// padding: 30px 20px;
		overflow-x: hidden;
		>div h3{
			width: auto;
			margin: 16px auto
		}
		img{
			height: 100%;
		}
	}
</style>
