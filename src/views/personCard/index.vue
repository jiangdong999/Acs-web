<template>
  <div>
    <div class="app-container">


      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">

            <span class="control-left list-title">人卡核验列表</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form ref="searchForm" :model="searchForm" :inline="true">
                    
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="所属小区" class="room-place" prop="communityId">
                        <el-select v-model="searchForm.communityId" @change="initNode" placeholder="选择所属小区" clearable filterable>
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

                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place" label="房屋位置" prop="nodeId">
                          <div>
                            <el-popover
                            placement="bottom"
                            width="300"
                            ref="popover"
                            popper-class="popper-shadow"
                            v-model="popoverShow"
                            trigger="click">
                              <el-input
                                placeholder="输入关键字进行过滤"
                                class="mb-5"
                                v-model="filterText"
                                clearable>
                              </el-input>
                              <el-tree class="tree-node" 
                              ref="tree"
                              :data="roomOptions" 
                              accordion 
                              :props="defaultProps" 
                              :load="loadNode" 
                              empty-text="无此节点"
                              @node-click="handleNodeClick"
                              :filter-node-method="filterNode">
                              </el-tree>
                            </el-popover>
                          </div>
                          <el-input
                            class="widen-input"
                            placeholder="关联房间"
                            v-model="searchForm.room"
                            v-popover:popover
                            @clear="clearRoom"
                            clearable 
                            style="width:360px"
                            suffix-icon="el-icon-arrow-down">
                          </el-input>
                        </el-form-item>
                      </el-col>

                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="门禁卡号" prop="cardNo">
                          <el-input v-model="searchForm.cardNo" clearable placeholder="请输入门禁卡号"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="持卡人员" prop="cardholder">
                          <el-input v-model="searchForm.cardholder" clearable placeholder="请输入持卡人"/>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24">

                        <el-form-item class="room-place" label="时间范围" prop="timeRange">
                          <el-date-picker
                            v-model="timeRange"
                            type="daterange"
                            value-format="yyyyMMddHHmmssSSS"
                            align="center" 
                            :picker-options="oneMonthAgoPickerOptions()"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            range-separator="至"
                            :editable="false"
                            :clearable="true"
                            :default-time="['00:00:00', '23:59:59']">
                          </el-date-picker>
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
      <div class="table-container" v-loading="loading">
        <el-row>
          <el-table :data="tableData" stripe>
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="cardNo"
              min-width="100"
              label="门禁卡号">
            </el-table-column>
            <el-table-column
              prop="cardholder"
              min-width="100"
              label="持卡人员">
            </el-table-column>
            <el-table-column
              prop="communityName"
              min-width="140"
              label="所属小区">
            </el-table-column>
            <el-table-column
              prop="roomNodeName"
              min-width="200"
              label="所属房屋">
            </el-table-column>
            <el-table-column
              prop="errorCount"
              min-width="80"
              label="异常次数">
            </el-table-column>
            <el-table-column
              prop="cardStatus"
              min-width="80"
              label="门卡状态">
              <template slot-scope="scope">
                {{ scope.row.cardStatus | transCardStatus }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="100"
              fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleShow(scope.row)"
                  :loading="btnLoading"
                  size="small">
                  查看
                </el-button>
                <el-button
                  type="text"
                  @click="handleEnable(scope.row.cardId)"
                  v-if="scope.row.cardStatus=='6'"
                  size="small">
                  启用
                </el-button>
                <el-button
                  type="text"
                  @click="handleFreeze(scope.row.cardId)"
                  v-if="(scope.row.cardStatus=='1' ||
                              scope.row.cardStatus=='5')"
                  size="small">
                  禁用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div class="page-container">
          <el-pagination
            background
            @size-change="limitChange"
            @current-change="turnPage"
            :current-page="page"
            layout="prev, pager, next"
            :total="totalRecord">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from "@/utils/mixin";
  import {oneMonthAgoPickerOptions} from "@/utils/validate";
  import {transCardStatus} from "@/filters/card";
  import dateUtil from "@/utils/times";
  import {fetchFacecardList2} from "@/api/personCard";
  import { enableCard, freezeCard } from "@/api/card";
  import { mapGetters } from 'vuex';
  import {dropdownNodeComplex} from "@/api/node";

  export default {
    mixins: [mixin],
    filters:{//卡状态:0删除,1正常,2过期(租客过期),3挂失，5复制卡，6禁用
      transCardStatus
    },
    data() {
      return {
        loading: false,
        btnLoading: false,
        searchForm: {
          room: '',
          communityId: '',
          roomNodeId: '',
          cardNo:'',
          cardholder:'',
          startTime: '',
          endTime:''
        },
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf: 'leaf'
        },
        roomOptions:[],
        popoverShow:false,
        filterText:''
      }
    },
    watch: {
      'filterText':function(val) {
        this.$refs.tree.filter(val);
      }
    },
    computed:{
      ...mapGetters([
        'communityList'
      ]),
      timeRange:{
        set(newValue){
          this.searchForm.startTime = newValue?newValue[0]:''
          this.searchForm.endTime = newValue?newValue[1]:''
        },
        get(){
          if(this.searchForm.startTime == ''){
            this.searchForm.startTime = dateUtil.toServerDateString(new Date(Date.now() - 6 * 86400000))
            this.searchForm.endTime = dateUtil.toServerDateString(new Date())
          }
          return [this.searchForm.startTime,this.searchForm.endTime]
        }
      }
    },
    methods: {
      oneMonthAgoPickerOptions,
      clearRoom:function(){
        this.searchForm.roomNodeId = '';
        this.searchForm.room = '';
      },
      handleShow: function(data){
        this.$router.push({
          name: 'personCardDetail',
          query: {
            cardholder: data.cardholder,
            roomNodeId: data.roomNodeId,
            cardNo: data.cardNo,
          }
        })
      },
      handleReset: function () {
        this.$refs.searchForm.resetFields();
        this.roomOptions = [];
        this.timeRange = ''
        this.clearRoom()
        this.loadData()
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let listObj = {
          offset: offset,
          limit: limit
        }

        fetchFacecardList2({...self.searchForm, ...listObj}).then(function (response) {
          if(response.data && response.data.code===1){
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            offset==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      initNode: function (data) {
        let self = this;
        if (data) {
          dropdownNodeComplex({communityId: data}).then(function (response) {
            if (response.data && response.data.code==1) {
              self.roomOptions = response.data.dataList;
            }
          }).catch(function (a) {
            console.error(a)
          });
        }
      },
      loadNode(node, resolve) {

        if(node.data.children && node.data.children.length>0){
          let data = node.data.children

          for(let children of data){
            children.leaf = !children.disabled
          }
          resolve(data);
        }
      },
      handleNodeClick(data) {
        if (!data.disabled && data.parentId != -1) {
          this.searchForm.roomNodeId = data.value;
          this.searchForm.room = data.nodeLabel;
          this.popoverShow = data.disabled 
        }
        if(data.parentId == -1 && !data.children){
          this.$message({
            message: '该节点下没有数据',
            type: 'error'
          });
        }
      },
      handleEnable(cardId){
        let self = this;
        self.$confirm('确定启用此门禁卡吗？').then(_ => {
          enableCard({
            cardId: cardId
          }).then(function (response) {
            if (response.data && response.data.code==1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.loadData(self.offset, self.limit)
            }
          }).catch(function (a) {
            console.error(a)
          })
        }).catch((a) => {
          console.error(a);
        });
      },
      handleFreeze(cardId){
        let self = this;
        self.$confirm('确定禁用此门禁卡吗？').then(_ => {
          freezeCard({
            cardId: cardId
          }).then(function (response) {
            if (response.data && response.data.code==1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.loadData(self.offset, self.limit)
            }
          }).catch(function (a) {
            console.error(a)
          })
        }).catch((a) => {
          console.error(a);
        });
      }
    },
    mounted() {
      this.loadData();
    },
  }
</script>
<style scoped>
</style>
