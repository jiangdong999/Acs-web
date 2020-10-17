<template>
  <div>
		<div class="app-container">
			<div class="control-panel  clearfix" style="marin-bottom:0px;">
				<el-form ref="searchForm" :model="searchForm" :inline="true">
					<el-row>
						<el-form-item label="事件" prop="event">
							<el-select v-model="searchForm.event" placeholder="请选择事件" clearable filterable>
								<el-option
									v-for="item in eventList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
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
						<el-form-item label="时间段" prop="startTime">
							<el-date-picker
								v-model="timeRange"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="yyyyMMddHHmmssSSS">
							</el-date-picker>
						</el-form-item>
						<span class="control-right">
							<el-button @click="handleReset()">重置</el-button>
							<el-button type="primary"  @click="fetchAlarmRecord()">搜索</el-button>
						</span>
					</el-row>
				</el-form>
			</div>
			<div class="topBar">
				<label class="el-icon-arrow-left back" @click="$router.back()">返回</label>
				<div>{{searchForm.wirelessName ? searchForm.wirelessName : ''}}</div>
				<span>{{searchForm.fullNodeName ? searchForm.fullNodeName : ''}}</span>
				<span>编号：{{searchForm.wirelessDeviceId}}</span>
			</div>
			<div class="table-container" v-loading="loading">
				<div class="table-control-panel clearfix">
					<span class="control-left list-title">警情记录</span>
				</div>
				<el-row>
					<el-table :data="tableData" stripe>
						<div slot="empty" class="empty-table"></div>
							<el-table-column
								type="index"
								:index="indexMethod"
								
								 
								width="60" label="序号">
							</el-table-column>
							<el-table-column
								prop="statDesc"
								
								 
								min-width="120"
								label="状态">
							</el-table-column>
							<el-table-column
								prop="eventDesc"
								
								 
								min-width="120"
								label="事件">
							</el-table-column>
							<el-table-column
								prop="voltage"
								
								 
								min-width="120"
								label="电量">
							</el-table-column>
							<el-table-column
								prop="temperature"
								
								 
								min-width="200"
								label="温度">
							</el-table-column>
							<el-table-column
								prop="applyTime"
								
								 
								min-width="180"
								label="报警时间">
								<template slot-scope="scope">
									{{scope.row.applyTime | formatDateTime}}
								</template>
							</el-table-column>
							<el-table-column
								prop="createTime"
								
								 
								min-width="180"
								label="记录时间">
								<template slot-scope="scope">
									{{scope.row.createTime | formatDateTime}}
								</template>
							</el-table-column>
						</el-table>
					</el-row>
				<div class="page-container">
					<el-pagination
						background
						@size-change="limitChange"
						@current-change="turnPage"
						layout="prev, pager, next"
						:current-page="page"
						:total="totalRecord">
					</el-pagination>
				</div>
			</div>
		</div>		
	</div>     
</template>
<script>
import { formatDateTime } from "@/filters/index";
import mixin from "@/utils/mixin";
import { getEventList, fetchAlarmRecord, getStatusList } from "@/api/smoke";
  export default {
		mixins: [mixin],
		filters: {
      formatDateTime
		},
		computed:{
			timeRange:{
				set(newValue){
					// console.log('newValue',newValue)
					this.searchForm.startTime = newValue?newValue[0]:''
					this.searchForm.endTime = newValue?newValue[1]:''
				},
				get(){
					return this.searchForm.startTime? [this.searchForm.startTime,this.searchForm.endTime]: []
				}
			}
		},
		created () {
			this.getEventList()
			this.fetchAlarmRecord()
			this.searchForm.wirelessDeviceId = this.$route.query.wirelessDeviceId
			this.searchForm.wirelessName = this.$route.query.wirelessName
			this.searchForm.fullNodeName = this.$route.query.fullNodeName
		},
		mounted () {
			this.getStatusList()
		},
		data (){
			return {
				searchForm: {
					stat: '',
					event: null,
					wirelessDeviceId: '',
					wirelessName: '',
					startTime: '',
					endTime: ''
				},
				statusList: [],
				eventList: [],
				tableData: [],
				loading: false,
				totalRecord: null
			}
		},
		methods: {
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
			handleReset(formName) {
				this.searchForm.event = null
				this.searchForm.stat = ''
				this.searchForm.startTime = ''
				this.searchForm.endTime = ''
				this.timeRange = ''
				this.fetchAlarmRecord()
			},
			fetchAlarmRecord (offset=0, limit=10) {
				let _this = this
				_this.loading = true
				let listObj = {
          offset: offset,
          limit: limit,
				}
				let keyObject = Object.assign(_this.searchForm,listObj)
				fetchAlarmRecord(keyObject).then(function (response) {	
					_this.loading = false				
					if (response.data && response.data.code === 1) {
						_this.tableData = response.data.dataList.map(item=>{
							item.temperature = item.temperature+'℃'
							item.voltage = item.voltage+'%'
							return item
						})
						 _this.totalRecord = response.data.totalCount
					}
				}).catch(function (a) {
					_this.loading = false	
				})
			},
			getEventList () {
				let _this = this
				getEventList().then(function (response) {
					
					if (response.data && response.data.code === 1) {
						let list = []
						for(let key in response.data.data){
							list.push({'value':key, 'label':response.data.data[key]})
						}
						_this.eventList = list
					}
				}).catch(function (a) {
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
.topBar {
  height: 54px;
  line-height: 54px;
  padding: 0 20px;
  background-color: #fff;
  font-size: 14px;
	border-top: 1px solid #eee;
	margin-bottom: 10px;
}
.topBar > div {
  font-size: 16px;
  color: #000;
  display: inline-block;
  font-weight: 900;
  margin: 0 15px;
}
.topBar > span {
  color: rgba(136, 136, 136, 1);
	margin-right: 15px;
}
</style>