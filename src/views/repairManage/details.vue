<template>
	<div>
		<div class="topBar">
      <label class="el-icon-arrow-left back" @click="$router.back()">返回</label>
			<div>报修详情</div>
    </div>
		<section>
			<div class="sec-top" v-loading="loading"> 
				<span class="status">{{details.statusDesc}}</span>
				<div class="left">
					<div class="first">
						<div class="first-box">
							<div>
								<div class="font-style">报修编号</div>
								<div class="font">{{details.num}}</div>
							</div>
							<div>
								<div class="font-style">报修日期</div>
								<div class="font">{{details.applyTime | formatDate}}</div>
							</div>
						</div>
						<div class="line-box">
							<label>姓名</label>
							<span class="font-style">{{details.repairName}}</span>
						</div>
						<div class="line-box">
							<label>手机</label>
							<span class="font-style">{{details.phone}}</span>
						</div>
						<div class="line-box">
							<label>所在小区</label>
							<span class="font-style">{{details.communityName}}</span>
						</div>
						<div class="line-box">
							<label>详细地址</label>
							<span class="font-style">{{details.fullNodeName}}</span>
						</div>
					</div>
				</div>
				<div class="middle">
					<div class="mid-box">
						<!-- <div class="mid-first">
							<label class="label">预约时间</label>
							<span class="font-style">{{details.expectTime | formatDateTimeHHmm}}</span>
						</div> -->
						<div class="repair-reason">
							<label class="label">报修原因</label>
							<span class="font-style reson">{{details.content}}</span>
						</div>
					</div>
				</div>
				<div class="right">				
					<label class="label file">附件</label>	
					<div class="file none" v-if="details.repairPhotos ? !details.repairPhotos.length : true">无</div>
					<div class="img-box">						
						<el-image 
					   	v-for="(item,index) in details.repairPhotos" :key="index"
							:src="item" 
							:preview-src-list="[item]">
							<div slot="error" class="image-slot">
								<span class="img-err pic-wid2"></span>
							</div>
						</el-image>
					</div>
				</div>
			</div>
			<div class="sec-bottom" v-loading="loading">
				<div class="bot-left">
					<div class="title">处理进度</div>
					<el-timeline v-for="(item,index) in details.operationList" :key="index">
						<el-timeline-item 
							:timestamp="item.createTime | formatDateTimeHHmm" 
							placement="top" 
							:color="index === details.operationList.length-1 ? '#007EE4' : '#eee'">
							<el-card>
								<h4>{{item.eventDesc}}</h4>
								<!-- event   1 -->								
								<p v-if="item.event === '1'" class="word-break">原因：{{item.remark}}</p>
								<p v-if="item.event === '1'">投诉人：{{item.householdName}}</p>
								<!-- event   2 -->
								<el-button v-if="item.event==='2' && distriBtn" class="distribute-btn" type="primary" @click="distribute">派发工单</el-button>
								<!-- event   3 -->
								<p v-if="item.event==='3'">维修人员：{{item.householdName}}</p>
								<p v-if="item.event==='3'" class="word-break">备注：{{item.remark ? item.remark : '无'}}</p>
								<!-- event   4 -->
								<el-button v-if="reportBtn && item.event === details.operationList[details.operationList.length-1].event" class="distribute-btn" type="primary" @click="handleReport(item.event)">填写报告</el-button>
								<!-- event   5 -->
								<p v-if="item.event==='5'">维修人员：{{item.householdName}}</p>
								<p v-if="item.event==='5'" class="word-break">处理反馈：{{item.remark ? item.remark : '无'}}</p>
								<div v-if="item.event==='5'" class="repair-end">
									<el-image 
									  v-for="(ele,idx) in item.photos" :key="idx"
										:src="ele" 
										:preview-src-list="[ele]">
										<div slot="error" class="image-slot">
											<span class="img-err pic-wid"></span>
										</div>
									</el-image>
								</div>
							</el-card>
						</el-timeline-item>
					</el-timeline>
				</div>
				<div class="bot-right" v-if="details.grade">
					<div class="title">住户评价</div>
					<div class="service">
						<label class="label labelWid">服务满意度</label>
					  <el-rate v-model="details.grade" :disabled="true"></el-rate>
					</div>
					<div>
						<label class="label labelWid">评价</label>
					  <span class="font-style" v-if="!details.remark">无</span>
					  <span class="font-style word-break">{{details.remark}}</span>
					</div>
				</div>
			</div>
		</section>	

    <!-- 工单派发 -->
		<div>
			<el-dialog :visible.sync="orderVisible" title="工单派发" width="540px" :before-close="beforeCloseOrder">
				<el-form ref="orderForm" :model="orderForm" :rules="rules" label-width="84px">
					<el-form-item label="维修人员" prop="householdId">
						<el-select v-model="orderForm.householdId" placeholder="请选择" clearable :filterable="true">
							<el-option
								v-for="item in householdList"
								:key="item.householdId"
								:label="item.householdName"
								:value="item.householdId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注" prop="remark">
						<el-input type="textarea" :rows="5" class="remark" v-model.trim="orderForm.remark" :maxlength="100" clearable placeholder="请输入"/>
					</el-form-item>
				</el-form>
				<div class="form-control dialog-btn">
					<el-button type="default" @click="setInvalid" :loading="setInvalidDisLoading">设为无效</el-button>
					<el-button type="default" @click="beforeCloseOrder">返回</el-button>
					<el-button type="primary" @click="confirmDistri()" :loading="disLoading">派单</el-button>
				</div>
			</el-dialog>
		</div>
    <!-- 填写报告 -->
		<div>
			<el-dialog :visible.sync="reportVisible" title="填写报告" width="540px" :before-close="beforeCloseReport">
				<el-form ref="reportForm" :model="reportForm" label-width="84px">
					<el-form-item label="维修人员" prop="householdName">
						<span>{{reportForm.householdName}}</span>
					</el-form-item>
					<el-form-item label="处理反馈" prop="remark">
						<el-input type="textarea" :rows="5" class="remark" v-model.trim="reportForm.remark" :maxlength="100" clearable placeholder="请输入"/>
					</el-form-item>
					<el-form-item label="附件" prop="photos" style="height: 85px;">
						<div class="image-box" style="float:left;" v-for="(item,index) in reportForm.photos" :key="index">
							<img  :src="item" class="avatar upload-photo">
							<span class="close" @click="closeImg(index)"><i class="el-icon-close"></i></span>
						</div>
						<el-upload
							style="float:left;"
							v-if="reportForm.photos.length < 3"
							class="avatar-uploader"
							action="xxx"
							:show-file-list="false"
							:before-upload="beforeUpload">						
							<i class="el-icon-plus avatar-uploader-icon"></i>						
						</el-upload>
					</el-form-item>
				</el-form>
				
				<div class="form-control dialog-btn">
					<el-button type="default" :loading="setInvalidLoading" @click="report('2',0)">设为无效</el-button>
					<el-button type="default" @click="beforeCloseReport">返回</el-button>
					<el-button type="primary" @click="report('1',null)" :loading="handLoading">提交</el-button>
				</div>
			</el-dialog>
		</div>
	</div>	
</template>

<script>
import { repairDetails, repairAssign, fetchWorkerList, report, receiveInfo, uploadFile } from "@/api/repairManage"
import { formatDateTimeHHmm, formatDate } from "@/filters/index"
import lrz from 'lrz'

export default {
	name: 'repairDetails',
	filters: {
		formatDateTimeHHmm: formatDateTimeHHmm,
    formatDate: formatDate
  },
	data () {
		return {
			orderVisible: false,
			reportVisible: false,
			disLoading: false,
			handLoading: false,
			setInvalidLoading: false,
			setInvalidDisLoading: false,
			loading: false,
			repairId: null,
			details: {
				num: '',
				fullNodeName: '',
				repairName: '',
				phone: '',				
				applyTime: '',
				expectTime: '',
				content: '',				
				statusDesc: '',
				communityName: '',
				communityId: null,
				grade: null,
				remark: '',
				operationList: []
			},
			orderForm: {				
				householdId: null,
				remark: ''
			},
			reportForm: {
				householdId: null,
				householdName: '',
				remark: '',
				photos: [],				
				del: null
			},
			householdList: [],
			rules: {
				householdId: {
					required: true, message: '请选择维修人员', trigger: 'change'
				}
			}
		}
	},
	created () {
		let query = JSON.parse(localStorage.getItem('query'))
		this.repairId = query.id	
		if(query.isRead === '0'){
			this.receiveInfo()
		}	else{
			this.getRepairDatails()			
		}
		
	},
	computed: {
		distriBtn() {
			let _this = this
			let isBtn = false
			let list = _this.details.operationList
			if(list[list.length-1].event === '2'){
				isBtn = true
			}
			return isBtn
		},
		reportBtn() {
			let _this = this
			let isBtn = false
			let list = _this.details.operationList
			if(list[list.length-1].event === '3' || list[list.length-1].event === '4'){
				isBtn = true
			}
			return isBtn
		}
	},
	methods: {
		receiveInfo() {
			let _this = this
			receiveInfo({
				repairId: _this.repairId
			}).then(res=>{
				if(res.data && res.data.code === 1) {
					this.getRepairDatails()
				}
			}).catch(err=>{
				console.error(err)
			})
		},
		//报修详情
		getRepairDatails () {
			let _this = this
			_this.loading = true
			repairDetails ({repairId:_this.repairId}).then(res=>{
				_this.loading = false
				if(res.data && res.data.code == 1){
					_this.details = res.data.data					
				}
			}).catch(err=>{
				_this.loading = false
				console.error(err)
			})
		},
		//工作人员下拉
		fetchWorkerList () {
			let _this = this
			fetchWorkerList({
				communityId: _this.details.communityId,
				limit: -1,
				offset: -1
			}).then(function (response) {
				if(response.data && response.data.code===1){
					_this.householdList = response.data.dataList || []					
				}
			}).catch(function (a) {
				console.error(a)
			})
		},		
		//派发工单按钮
		distribute () {
			this.orderVisible = true
			this.fetchWorkerList()
		},		
		//设为无效 工单
		setInvalid () {
			this.repairAssign('2',0)
		},
		//确认派发
		confirmDistri () {
			let _this = this
			// if(!_this.orderForm.householdId) {
			// 	_this.$message({
			// 		type: 'warning',
			// 		message: '请选择维修人员'
			// 	})
			// }else{
				
			// }
			_this.$refs['orderForm'].validate(valid=>{
				if(valid) {
					_this.disLoading = true
		    	_this.repairAssign('1',null)
				}
			})			
		},
		//派发工单  设为无效
		repairAssign(val,code) {
			let _this = this
			val === '1' ?	_this.disLoading = true : _this.setInvalidDisLoading = true
			repairAssign({
        ..._this.orderForm,
				repairId: +_this.repairId,
				del: code
			}).then(res=>{
				val === '1' ?	_this.disLoading = false : _this.setInvalidDisLoading = false
				if(res.data && res.data.code === 1) {				
					_this.getRepairDatails ()					
					_this.orderVisible = false							
					_this.$message({
						type: 'success',
						message: res.data.message
					})
				}
			}).catch(err=>{
				val === '1' ?	_this.disLoading = false : _this.setInvalidDisLoading = false
				console.error(err)
			})
		},
		beforeCloseOrder () {
			this.$refs.orderForm.resetFields()
			this.orderVisible = false
		},		
		beforeUpload (file) {
			let _this = this;
			// console.log(file.size)
			const isType = file.type === 'image/jpg' || file.type ==='image/png' || file.type ==='image/jpeg';
			const isSize = file.size <= 2 * 1024 * 1024
			if (!isType) {
				_this.$message.error('上传图片只能是 JPG/PNG 格式!');
			}
			if (!isSize) {
				_this.$message.error('上传图片大小不能超过 2MB!');
			}
			if (isType && isSize) {

        let formData = new FormData()
				formData.append('fileToUpload', file)		
				formData.append('type', 'repair')									
        uploadFile(formData).then(res => {
					// console.log(res)
					if(res.data.code === 1) {
						_this.reportForm.photos.push(res.data.data.url)
						// console.log(_this.reportForm.photos)
					}
        }).catch(error => {

				})
				
				return false
      }
		},
		closeImg(idx) {
			this.reportForm.photos.splice(idx,1)
		},
		//填写报告按钮
		handleReport (event) {
			let _this = this
			_this.reportVisible = true
			_this.details.operationList.forEach(item=>{
				if(item.event === event) {
					_this.reportForm.householdName = item.householdName
					_this.reportForm.householdId = item.householdId
				}
			})
		},
		//填写报告
		report (val,code) {
			let _this = this
			val === '1' ? _this.handLoading = true : _this.setInvalidLoading = true
			report({
				..._this.reportForm,
				repairId: +_this.repairId,
				del: code 			
			}).then(res=>{
				val === '1' ? _this.handLoading = false : _this.setInvalidLoading = false
				if( res.data && res.data.code === 1){
					_this.getRepairDatails ()	
					_this.reportVisible = false								
					_this.$message({
						type: 'success',
						message: res.data.message
					})
				}
			}).catch(err=>{
				val === '1' ? _this.handLoading = false : _this.setInvalidLoading = false
				console.error(err)
			})
		},
		beforeCloseReport () {
			this.$refs.reportForm.resetFields()
			this.reportVisible = false
		}	
	}
}
</script>
<style lang="scss" scoped>
.topBar {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background-color: #fff;
  font-size: 14px;
}
.topBar > div {
  font-size: 16px;
  display: inline-block;
  font-weight: 900;
  margin: 0 15px;
}
section{
	padding: 20px 20px 0;
	.sec-top{
		background:#fff;
		margin-bottom: 20px;
		padding: 20px;
		position: relative;
		.status{
			position: absolute;
			right: 30px;
			top: 30px;
			display: inline-block;
			width: 68px;
			height: 28px;
			background: rgba(44,159,251,0.1);
			color: #2C9FFB;
			font-size: 16px;
			font-weight: bolder;
			line-height: 28px;
			text-align: center;
		}
		.left{
			background: #F0F0F0;
			border-radius: 8px;
			padding: 20px 0px 32px 50px;
		}	
		.middle,.right{
			position: relative;
		}
	}
	.sec-bottom{
		background:#fff;
		padding: 20px 0 0 30px;
		overflow: hidden;
		.bot-left, .bot-right{
			width: 50%;
			float: left;
		}
		.title{
			color: #333333;
			font-size: 18px;
			font-weight: bolder;
			margin-bottom: 32px;
		}		
	}
}
.service{
	margin-bottom: 30px;
}
section>div:nth-of-type(1){
	height: 300px;
	border-radius: 8px;
}
section>div:nth-of-type(2){
	border-radius: 8px;
}
.sec-top>div{
	width: 33.33%;
	height: 100%;
	float: left;
}
.first>div>label,.label{
	font-size: 12px;
	font-weight: bolder;
	display: inline-block;
	width: 48px;
	text-align: right;
	margin-right: 8px;
}
.labelWid{
	width: 60px;
}
.first-box{
	height: 28%;
}
.first-box>div{
	width: 50%;
	float: left;
}
.first{
	height: 100%;
}
.line-box{
	height: 18%;
}
.font-style{
	color: #888888;
  font-size: 12px;
}
.font{
	color: #333333;
	font-size: 14px;
	font-weight: bolder;
}
.mid-box{
	width: 80%;
	height: 50px;
	margin: auto;
	position: absolute;
	top: -80px;	
	bottom: 0;
	left: 0;
	right: 0;
	.mid-first{
		margin-bottom: 20px;
	}
}
.reson{
	display: inline-block;
	width: 60%;
	padding-top: 2px;
	line-height: 16px;
	vertical-align: top;
	word-break: break-all;
}
.img-box{
	width: 100%;
	height: 80px;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	img{
		width: 100%;
		height: 100%;
	}
}
.file{
  width: 100%;
	height: 10px;
	position: absolute;
	top: -120px;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	text-align: left;
}
.none{
	top: -70px;
	height: 40px;
	line-height: 40px;
}
.el-timeline{
	width: 400px;
}
.distribute-btn{
	color: #fff;
	font-size: 12px;
	display: inline-block;
	height: 36px;	
	border-radius: 8px;
}
.dialog-btn{
	text-align: center;
}
.remark{
	width: 350px;
}
.avatar-uploader .el-upload:hover {
	border-color: #409EFF;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #D7D7D7;
	width: 70px;
	height: 70px;
	line-height: 70px;
	text-align: center;
}
.avatar {
	width: 70px;
	height: 70px;
	display: block;
}
.repair-end{
	overflow: hidden;
}
.upload-photo{
	float: left;
	margin-right: 10px;
}
.pic-wid{
	display: inline-block;
	width: 40px;
	height: 40px;
}
.pic-wid2{
	display: inline-block;
	width: 80px;
	height: 80px;
}
.image-box{
	position: relative;
}
.close{
	position: absolute;
	width: 16px;
	height: 16px;
	right: 11px;
	top: 1px;
	border-radius: 50%;
	background: rgba(255,255,255,.8);
	color: #434343;
	line-height: 18px;
	font-size: 12px;
	text-align: center;
	cursor: pointer;
}
.word-break{
	word-break: break-all;	
}

</style>