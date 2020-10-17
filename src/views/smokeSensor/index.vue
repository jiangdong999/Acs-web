<template>
  <div class="jdDIV">
		<div class="app-container">
			<el-row :span="24">
				<el-col>
					<div class="table-control-panel">
						<span class="control-left list-title">共有 {{countData.totalCount}} 台设备 </span>
						<span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
						<span class="control-left">
              <el-button type="primary" class="jdaddbtn" icon="el-icon-plus" @click="showModal = true">新增烟感设备</el-button>
            </span>
						<span class="control-right">
							<el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
								<div class="control-panel jdClass">
									<el-form ref="searchForm" :model="searchForm" :inline="true">
											<el-row :gutter="20">
												<el-col :span="12">
													<el-form-item label="所属小区" class="room-place" prop="communityId">
														<el-select v-model="searchForm.communityId" placeholder="选择所属小区" clearable :filterable="true">
															<el-option
																v-for="item in communityList"
																:key="item.communityId"
																:label="item.communityName"
																:value="item.communityId">
															</el-option>
														</el-select>
													</el-form-item>
												</el-col>
												
											</el-row>

											<el-row :gutter="20">
												<el-col :span="12">
													<el-form-item label="设备状态" prop="stat">
														<el-select v-model="searchForm.stat" placeholder="请选择设备状态" clearable filterable>
															<el-option
																v-for="item in statusList"
																:key="item.value"
																:label="item.label"
																:value="item.label">
															</el-option>
														</el-select>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="设备名称" prop="wirelessName">
														<el-input v-model="searchForm.wirelessName" :maxlength="20" clearable placeholder="请输入"/>
													</el-form-item>
												</el-col>
												
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="设备编号" prop="wirelessDeviceId">
														<el-input v-model="searchForm.wirelessDeviceId" clearable placeholder="请输入"/>
													</el-form-item>
												</el-col>
											</el-row>
											<span class="jdClassbtn">
												<el-button @click="handleReset()">重置</el-button>
												<el-button type="primary"  @click="loadData()">搜索</el-button>
											</span>
									</el-form>
								</div>
								<el-button plain slot="reference" class="jdbtn">
									<svg-icon iconClass="filter" class="jdIconSize" />筛选
								</el-button>
							</el-popover>
						</span>
					</div>
				</el-col>
			</el-row>

			<div class="header module" style="margin-top:-15px">
				<el-row :gutter="20">
					<el-col :span="12" class="item">
						<div class="online" :class="{'checked': searchForm.online==1}" @click="onlineChange(1)">
							在线
							<div>
								<count-to :startVal="0" :endVal="parseInt(countData.onlineCount) || 0" :duration="2500"></count-to>
							</div>
						</div>
					</el-col>
					<el-col :span="12" class="item">
						<div class="offline" :class="{'checked': searchForm.online==0}" @click="onlineChange(0)">
							离线
							<div>
								<count-to :startVal="0" :endVal="parseInt(countData.offlineCount) || 0" :duration="2500"></count-to>
							</div>
						</div>
					</el-col>					
					
				</el-row>
			</div>
			
		</div>
		<div class="content">
			<div class="device-list" ref="deviceList">
				<div class="device-item" v-for="(device,i) in tableData" :key="i">
					<div class="device-body">
						<div class="setting" @click="openAlarmRecord(device)">
							<img src="../../assets/icon/more.png">
						</div>
						<p>
							<el-tooltip effect="dark" :content="device.fullNodeName" placement="top">
								<label>{{device.fullNodeName}}</label>
							</el-tooltip>
						</p>
						<el-tooltip effect="dark" :content="device.wirelessName" placement="bottom">
							<h4>{{device.wirelessName}}</h4>
						</el-tooltip>
						<div class="tags">
								<span class="zx" v-if="device.online==1">在线</span>
								<span class="lx" v-if="device.online==0">离线</span>
							<template v-if="device.statDesc">
								<span class="zx" v-if="device.statDesc[0]==='正常'">{{device.statDesc[0]}}</span>
								<el-tooltip v-else effect="dark" placement="right">
									<div slot="content" v-for="(item,i) in device.statDesc" :key="i">{{item}}<br/></div>
									<label class="mck">{{device.statDesc[0]}}...</label>
								</el-tooltip>
							</template>
						</div>
						<div class="device-box">
							<div class="line-box">
								<i class="iconfont icon-wangluo"></i>
								<label>网络</label>
								<span class="data-con">{{device.wirelessType | transWirelessType}}</span>
							</div>
							<div class="line-box">
								<i class="iconfont icon-xinhao"></i>
								<label>信号</label>
								<span class="data-con" v-if="device.rssi<=-111">差({{device.rssi}})</span>
								<span class="data-con" v-else-if="device.rssi>=-110 && device.rssi<=-101">中({{device.rssi}})</span>
								<span class="data-con" v-else-if="device.rssi>=-100 && device.rssi<=-81">良好({{device.rssi}})</span>
								<span class="data-con" v-else-if="device.rssi>=-80 && device.rssi<=0">优({{device.rssi}})</span>
							</div>
							<div class="line-box">
								<i class="iconfont icon-dianliang"></i>
								<label>电量</label>
								<span class="data-con" v-if="device.voltage">{{device.voltage}}%</span>
							</div>
							<div class="line-box">
								<i class="iconfont icon-wendu"></i>
								<label>温度</label>
								<span class="data-con" v-if="device.temperature">{{device.temperature}}℃</span>
							</div>
							<div class="line-box delbot">
								<i class="iconfont icon-bianhao"></i>
								<label>编号</label>
								<span class="data-con">{{device.wirelessDeviceId}}</span>
							</div>
						</div>
						
					</div>
					<div class="device-footer">
						<div @click="handleChange(device)" class="after-line"><i class="iconfont icon-bianji"></i> 编辑设备</div>
						<div @click="handleDel(device.wirelessDeviceId)"><i class="iconfont icon-shanchu"></i> 删除设备</div>
					</div>
				</div>
			</div>
		</div>

    <div v-if="showModal">
      <el-dialog
        title="新增设备"
				width="550px"
        :visible.sync="showModal"
        :close-on-click-modal="false">
        <device-form @submit="handleClose(0, offset, true)"/>
      </el-dialog>
    </div>
		<div v-if="editModal">
      <el-dialog
        title="编辑设备"
				width="640px"
        :visible.sync="editModal"
        :close-on-click-modal="false">
        <edit-device :rowData="rowData" @submit="handleClose(0, offset, true)"/>
      </el-dialog>
    </div>
		<div v-if="showChange">
      <el-dialog
        title="更换设备"
		width="440px"
        :visible.sync="showChange"
        :close-on-click-modal="true">
        <changeDevice :device="rowData" @submit="handleClose(0, offset)"/>
      </el-dialog>
    </div>

	</div>
</template>

<script>
import countTo from 'vue-count-to'
import deviceForm from './components/form'
import editDevice from './components/edit'
import changeDevice from './components/changeDevice.vue'
import { mapGetters } from 'vuex';
import { fetchList, getStatusList, delDevice } from "@/api/smoke"
import { transWirelessType } from "@/filters/smoke";

let $el
let _scrollTop = 0
export default {
	components: {
		countTo,
		deviceForm,
		changeDevice,
		editDevice
	},
	filters: {
		transWirelessType
	},
	computed:{
		...mapGetters([
			'communityList'
		])
	},
	data () {
		return {
			statusList: [],
			searchForm: {
				communityId: null,
				stat: '',
				wirelessDeviceId: '',
				wirelessName: '',
				online: null
			},
		  tableData: [],
			countData:{
				totalCount: 0,
				onlineCount: 0,
				offlineCount: 0,
			},
			showModal: false,
			editModal: false,
			showChange: false,
			rowData: {},
			loading: false
		}
	},
	methods: {
		loadData: function (offset=0, limit=this.eachCount*5, contact) {
			let _this = this;
			_this.loading = true
			let listObj = {
				offset: offset,
				limit: limit,
			}

			let keyObject = Object.assign(_this.searchForm, listObj)
			fetchList(keyObject).then(function (response) {
				if (response.data && response.data.code === 1) {
					_this.tableData = response.data.dataList
					_this.countData.offlineCount = response.data.offlineCount
					_this.countData.onlineCount = response.data.onlineCount
					_this.countData.totalCount = response.data.totalCount

					_this.tableData = contact ? _this.tableData.concat(response.data.dataList) : response.data.dataList;
					_this.offset = offset + limit
				}
			}).finally(function (a) {
				_this.loading = false
			})
		},
		getStatusList () {
      let _this = this
			getStatusList().then(function (response) {
				if (response.data && response.data.code === 1) {
					let list = []
					for(let key in response.data.data){
						list.push({'value':key, 'label':response.data.data[key]})
					}
					_this.statusList = list
				}
			}).catch(function (a) {
			})
		},
		//重置
		handleReset () {
			this.$refs.searchForm.resetFields();
      this.loadData()
		},
		onlineChange(status){
			this.searchForm.online = this.searchForm.online==status? null : status
			this.loadData()
		},
		openAlarmRecord (device) {
			let _this = this
      _this.$router.push({
				path:'/equipment/smokeSensor/alarmRecord',
				query: {
					wirelessDeviceId: device.wirelessDeviceId,
					wirelessName: device.wirelessName,
					fullNodeName: device.fullNodeName
				}
			})
		},
		// 编辑设备
		handleChange (data) {
			this.rowData = data
			this.editModal = true
		},
		//删除设备
		handleDel (id) {
			let _this = this
			if (id) {
				_this.$confirm('确定删除此设备吗？')
					.then(_ => {
						_this.loading = true
						delDevice({
							wirelessDeviceId: id
						}).then(function (response) {
							if (response.data && response.data.code === 1) {
								_this.$message({
									message: response.data.message,
									type: 'success'
								});
								_this.loadData(0, _this.offset)
							}
						}).catch(function (a) {
						}).finally(_=>{
							_this.loading = false
						})
					})
					.catch((a) => {
					})
			}
		},
		handleClose: function (offset, limit) {
			this.loadData(offset, limit)
			this.showModal = false
			this.editModal = false
			this.showChange = false
		},
	},
	onScroll(e){
		let el = e.target
		
		// 距离底部小于200高度的时候进行加载判断
		if((el.scrollHeight-200) < (el.scrollTop+el.offsetHeight)){
			// 判断滚动条的滚动方向
			if((el.scrollTop - _scrollTop) > 0){

				!this.loading && this.loadData(this.offset, this.eachCount*5, true)
			}
			_scrollTop = el.scrollTop

		}else{
			// console.log('还没到')
		}
	},
	mounted() {
		this.getStatusList()
		// $el = document.querySelector(".content-view")
		$el = document.querySelector(".jdDIV")
		this.eachCount = Math.floor($el.offsetWidth/260)
		
		this.loadData()
		this.$nextTick(()=> {
			$el.addEventListener('scroll', this.onScroll)
		})
	},
	destroyed(){
		$el.removeEventListener('scroll', this.onScroll)
	},
}
</script>
<style lang="scss" scoped>
@import '../../styles/iconfont/iconfont.css';
.checked:before{
	content:'';
	display: inline-block;
	width: 20px;
	height: 20px;
	background-image: url(../../assets/icon/checked.png);
	background-size: contain;
	position: absolute;
	left: 9px;
	top: 9px;
}
.module{
    background-color: #fff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
    padding: 10px 30px;
  }
  .header{
    text-align: center;
    line-height: 30px;
    padding: 20px;
  }
  .item{
    font-size: 14px;
    cursor: pointer;
    color: #fff;
  }
  .item>div{
    font-weight: 900;
    font-size: 14px;
    border-radius: 8px;
    padding: 10px 0;
    position: relative;
  }
  .offline{background: linear-gradient(#555555, #999999);}
  .online{background: linear-gradient(#0090E9, #007EE4);}
  .offline:after{
    content:'';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-position: bottom right;
    background-image: url('../../assets/image/lx.png')
  }
  .online:after{
    content:'';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-position: bottom right;
    background-image: url('../../assets/image/online.png')
  }

  .item>div>div{
    font-size: 30px;
  }
  .btn-add{
    width: 80px;
    height: 80px;
    margin: 0 auto;
    font-size: 0px;
    background-color: #007EE4;
    border-radius: 8px;
    cursor: pointer;
    padding: 10px 0;
    transition: .3s;
  }
  .btn-add:hover{
    opacity: .6;
  }
  .btn-add>p{
    color: #fff;
    font-size: 10px;
    margin: 0;
    line-height: 7px;
  }
  .content{
    padding: 0 20px;
  }
	.device-list{
    margin-top: 20px;
  }
	.device-item{
    background-color: #fff;
    border-radius: 8px;
    display: inline-block;
    width: 240px;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
    cursor: default;
    margin-bottom: 20px;
    margin-right: 20px;
  }
	.device-body{
    padding: 15px 20px;
    color: #888888;
    position: relative; 
		>.setting{
      position: absolute;
      border-radius: 50%;
      right: 10px;
      top: 10px;
      cursor: pointer;
      img{
        width: 34px;
        height: 34px;
      }  
		}
		>p{
      margin: 0;
      label{
        font-size: 12px;
        color: #888;
        display: inline-block;
        line-height: 18px;
        max-width: 130px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
		}
  }
	h4{
		margin: 0;
		font-size: 20px;
		color: #333333;
		display: inline-block;
		max-width: 86%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		cursor: pointer;
		transition: all .3s;
	}
	h4:hover{
		color: #007EE4
	}
	.tags{
		margin-top: 6px;
		min-height: 25px;
		span,label{
			font-size: 11px;
			padding: 3px 5px;
			margin-bottom: 5px;
			display: inline-block;
			margin-right: 5px;
			line-height: 14px;
			border-radius: 2px;
		}
		.zx{
			color: #008FE8;
			background: rgba(229,243,252,1);
		}
		.lx{
        color: #666;
	     	background: rgba(85,85,85,0.1);
      }
		.mck{
			color: #FF6767;
			background: rgba(255,103,103,0.1);
		}
	}
	.device-box{
		margin-top: 14px;
		width: 200px;
		background: rgba(253,253,253,1);
		border: 0.5px solid rgba(212,217,222,1);
		border-radius: 4px;
		.line-box{
			overflow: hidden;
			font-size: 12px;
			color:#666;
			padding: 15px 16px 15px 14px;
			border-bottom: 0.5px solid rgba(212,217,222,1);
			label{
				float: left;
				font-weight: bolder;				
			}
			i{
				float: left;
				margin-right: 10px;
			}
			span{
				float: right;
			}
		}
		.delbot{
			border-bottom: 0;
		}
	}
	.device-footer{
    border-top: 1px solid #E6E9ED;
    display: flex;
    >div{
      flex: auto;
      color: #333333;
      text-align: center;
      font-size: 12px;
      line-height: 40px;
      position: relative;
      cursor: pointer;
    }
    .after-line:after{
      content:'';
      display: inline-block;
      height: 20px;
      width: 1px;
      background-color: #D4D9DE;
      position: absolute;
      right: 0;
      top: 10px;
    }
  }
  .iconfont{
    margin-right: 5px;
    font-size: 10px;
  }
  .icon-details_change_iconx{
    color: #1E8EEA;
  }
  .icon-details_delete_iconx{
    color: #FF6767;
  }
	.icon-bianji{
		color: #349EF5;
	}
	.icon-shanchu{
		color: #FF6767;
	}	
	.divider{
    font-size: 14px;
    color: #888888;
  }
</style>