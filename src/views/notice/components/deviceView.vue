<template>
	<div class="preview">
		<div class="device">
			预览效果 &emsp;
			<el-radio-group v-model="viewType">
				<el-radio label="1">横屏</el-radio>
				<el-radio label="2">竖屏</el-radio>
			</el-radio-group>
			<div class="screen transverse" v-show="viewType=='1'">
				<div v-if="data.contextType=='1'">
					<h3 class="ellipsis">{{data.title}}</h3>
					<!--<span>{{htmlstr}}</span>-->
					<p><span v-html="data.context"></span></p>
					<div>{{data.publishers}}
						<div>{{data.upTime | transTime }}</div>
					</div>
				</div>
				<div v-else>
					<h3 class="ellipsis">{{data.title}}</h3>
					<img :src="data.context">
				</div>
			</div>
			<div class="screen vertical" v-show="viewType=='2'">
				<div v-if="data.contextType=='1'">
					<h3 class="ellipsis">{{data.title}}</h3>
					<!--<span>{{htmlstr}}</span>-->
					<p v-html="data.context"></p>
					<div>{{data.publishers}}
						<div>{{data.upTime | transTime }}</div>
					</div>
				</div>
				<div v-else>
					<h3 class="ellipsis">{{data.title}}</h3>
					<img :src="data.context">
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {getNotice} from "@/api/notice";
import {transTime} from "@/filters/notice";

export default {
	props:['id'],
	filters:{transTime},
	data(){
		return {
			viewType: '1',
			data:{}
		}
	},
	methods:{
		getData:function(){
			let self = this;
			getNotice({circularId:self.id}).then(function (response) {
				if (response.data && response.data.code === 1) {
					self.data = response.data.data
				} else {
					self.$parent.handleClose();
				}
			}).catch(function (a) {
				console.error(a)
			});
		}
	},
	mounted(){
		this.getData()
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
		margin: 0 auto;
		padding: 20px 30px;
		background-color: #fff;
		margin-top: 25px;
		>div{
			height: 100%;
			img{
				width: 100%
			}
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
				text-align: left;
				white-space: pre-wrap;
				word-break:break-word;
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
		width: 430px;
		height: 254px;
		overflow-y: hidden;
	}
	.vertical{
    width: 330px;
		height: 450px;
		/*padding: 30px 20px;*/
		overflow-y: hidden;
		>div h3{
			width: auto;
			margin: 16px auto
		}
	}
</style>
