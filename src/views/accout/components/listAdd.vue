<template>
  <div  v-loading="loading">
    <el-row class="app-container">
      <el-col :span="6">
        <div class="app-container-left">
          <el-form inline :model="form" :rules="rules" ref="form">
            <el-row class="jdClassAdd">
              <el-col :span="24" style="margin-bottom: 6px;">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="form.name" clearable placeholder="请输入"/>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-bottom: 6px;">
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="form.phone" clearable :maxlength="11" placeholder="请输入"/>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-bottom: 6px;">

                <el-form-item label="帐号类型" prop="accountType">
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">物业帐号：绑定的最小节点为小区<br/>政府帐号：绑定的最小节点为居委会，可查看居委会下所有小区</div>
                    <i class="el-icon-question" style="position: absolute;left: 61px;top: -23px;"></i>
                  </el-tooltip>
                  <el-select v-model="form.accountType" placeholder="请选择">
                    <el-option
                      v-for="item in accountOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

              </el-col>

              <el-col :span="24" style="margin-bottom: 6px;">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="form.remarks" :maxlength="20" placeholder="请输入" :rows="2" type="textarea" style="width: 200px;"/>
                </el-form-item>
              </el-col>

              <el-col :span="24" style="margin-top:20px">
                <span style="margin-right:20px">角色</span>
                <span @click="selectRoleClick= true" style="color:#007ee4;cursor:pointer">选择</span>
              </el-col>
              <el-col :span="24">
                <div class="jdDiv" v-show="flaglabel"></div>
                <div class="jdLabel">
                  <el-tag v-for="item in roleArr" type="info" :key="item.value">{{item.roleName}}</el-tag>
                </div>
              </el-col>
              <el-col :span="24">
                <el-form-item style="line-height: 16px;margin-top: 20px;" label="脱敏类型" prop="sensitive">
                  <el-radio-group  v-model="form.sensitive">
                    <el-radio
                    v-for="item in sensitiveOptions" 
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                      {{item.label}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="18" class="app-container-right-div">
        <div class="app-container-right">
          <el-row>
            <el-col :span="12">
              <div class="app-container-right-title">分配节点</div>
            </el-col>
            <el-col :span="12">
              <div class="app-container-right-title">已选节点</div>
            </el-col>
          </el-row>
          <el-row v-show='treeShow'>
            <el-col :span="12" class="app-container-right-scroll">
              <div class="app-container-right-cont">
                <el-input
                  placeholder="请输入搜索内容"
                  suffix-icon="el-icon-search"
                  v-model="filterText">
                </el-input>
                <el-col :span="24">
                  <div class="right-view jdTreeClass">
                    <el-tree
                      :data="menuTree"
                      ref="tree"
                      node-key="code"
                      show-checkbox
                      :default-checked-keys="defaultCheckedKeys"
                      :props="defaultProps"
                      :filter-node-method="filterNode"
                      @check="handleNodeClick"
                      >
                    </el-tree>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="app-container-right-ul">
                <el-tag
                  v-for="tag in tags"
                  :key="tag.name"
                  closable
                  type="info"
                  @close="showInput(tag)">
                  {{tag.name}}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row v-show='treeShow_A'>
            <el-col :span="12" class="app-container-right-scroll">
              <div class="app-container-right-cont">
                <el-input
                  placeholder="请输入搜索内容"
                  suffix-icon="el-icon-search"
                  v-model="filterText_A">
                </el-input>
                <el-col :span="24">
                  <div class="right-view jdTreeClass">
                    <el-tree
                      :data="menuTree_A"
                      ref="tree_A"
                      node-key="code"
                      show-checkbox
                      :default-checked-keys="defaultCheckedKeys_A"
                      :props="defaultProps"
                      :filter-node-method="filterNode_A"
                      @check="handleNodeClick_A"
                      >
                    </el-tree>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="app-container-right-ul">
                <el-tag
                  v-for="tag in tags_A"
                  :key="tag.name"
                  closable
                  type="info"
                  @close="showInput_A(tag)">
                  {{tag.name}}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          <div class="app-container-right-empty" v-show='treeEmptyShow'></div>
          <div class="app-container-right-submit">
            <el-button @click="$router.back()">取消</el-button>
            <el-button type="primary" @click="submitBtn">提交</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="selectRoleClick">
      <el-dialog
        title="选择角色"
        :visible.sync="selectRoleClick"
        width="780px">
        <select-role @handleClose="roleList" :roleArr="roleArr"></select-role>
      </el-dialog>
    </div>
    <div v-if="submitBtnState">
      <el-dialog
        title="请确认添加的帐号信息"
        :visible.sync="submitBtnState"
        width="800px"
        class="jdDialog">
        <accout-info :data="form" :roleArr="roleArr" :arrcommunitCode="arrcommunitCode"></accout-info>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { areaTree,userAdd } from '@/api/login'
import { sensitiveOptions,accountOptions,sensitiveOptionsNew } from "@/utils/role"
import { validateMobile } from "@/utils/rules";
import selectRole from './selectRole'
import accoutInfo from './accoutInfo'
export default {
  components:{
    selectRole,
    accoutInfo,
  },
  data() {
    return {
      submitBtnState:false,//详情
      treeShow:false,
      treeShow_A:false,
      treeEmptyShow:true,
      flaglabel:true,
      loading:false,
      selectRoleClick:false,
      menuTree:[],//物业树
      menuTree_A:[],//政府树
      accountOptions: [],//帐号类型
      sensitiveOptions:[],//敏感类型
      roleArr:[],//角色列表
      defaultCheckedKeys: [],//默认显示的节点
      defaultCheckedKeys_A: [],//默认显示的节点
      arrcommunitCode:[],
      defaultProps: {
        label: 'name',//显示的节点名称
        // children: 'zones'
        // isLeaf: 'leaf'
      },
      tags: [//标签的数组
        // { name: '标签一' },
      ],
      tags_A: [//标签的数组
        // { name: '标签一' },
      ],
      filterText: '',//筛选节点
      filterText_A:'',
      form:{
        name:'',
        phone:'',
        sensitive:'1',
        accountType:'',
        roleIds:[],
        remarks:''
      }, 
      rules:{
        name: [
          {required: true, message: '请填写姓名', trigger: 'blur'},
          { min: 2, max: 20, message: '请输入2-20的字符' }
        ],
        phone: [
          {required: true, validator: validateMobile, message: '请填写正确的手机号', trigger: 'blur'}
        ],
        accountType: [
          {required: true, message: '请选择帐号类型', trigger: 'blur'}
        ],
        sensitive: [
          {required: true, message: '是否脱敏', trigger: 'blur'},
        ],
      },
    };
  },
  methods:{
    //角色列表
    roleList:function(childValue){
      // console.log(childValue);
      
      this.roleArr = [];
      if(childValue.length === 0){
        this.flaglabel = true
      }else{
        this.flaglabel = false
        this.roleArr = childValue
      }
    },
    //加载树的数据
    getMenuTree(){
      this.loading = true;
      areaTree({}).then(response => {
        if (response.data && response.data.code === 1) {
          this.loading = false;
          const msg = response.data.dataList;
          this.menuTree = JSON.parse(JSON.stringify(msg)); //深拷贝，不改变原对象的值
          this.menuTree_A = JSON.parse(JSON.stringify(msg));  //深拷贝，不改变原对象的值
    
          this.menuTree_A.forEach((item)=>{
            item.children.forEach((ele)=>{
              ele.children.forEach((value)=>{
                value.children.forEach((val)=>{
                  val.children.forEach((V)=>{
                    V.children = [];
                  })
                })
              })
            })
          })
        }
      })

    },
    //搜索过滤树节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
     //搜索过滤树节点
    filterNode_A(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //树结构复选框点击事件
    handleNodeClick(data,node){
      let treeNodes = this.$refs.tree.getCheckedNodes(true);
      // console.log(treeKeys);
      // console.log(treeNodes);
      this.tags = treeNodes
    },
    //树结构复选框点击事件
    handleNodeClick_A(data,node){
      let treeNodes = this.$refs.tree_A.getCheckedNodes(true);
      // console.log(treeKeys);
      // console.log(treeNodes);
      this.tags_A = treeNodes
    },
    //删除标签事件
    showInput(tag){
      
      //标签数组删除时改变树选中的节点  最终树没有改变
      let arr = [];
      for(let i in this.tags){
        if(this.tags[i].code == tag.code){
          this.tags.splice(i,1);
        }
      }
      for(let i in this.tags){
        arr.push(this.tags[i].code)
      }
      this.$refs.tree.setCheckedKeys([]);
      this.defaultCheckedKeys = arr
    },
    //删除标签事件
    showInput_A(tag){
      
      //标签数组删除时改变树选中的节点  最终树没有改变
      let arr = [];
      for(let i in this.tags_A){
        if(this.tags_A[i].code == tag.code){
          this.tags_A.splice(i,1);
        }
      }
      for(let i in this.tags_A){
        arr.push(this.tags_A[i].code)
      }
      this.$refs.tree_A.setCheckedKeys([]);
      this.defaultCheckedKeys_A = arr
    },
    //提交
    submitBtn(){
      let self = this;
      var arr = [];
      for(let i in this.roleArr){
        arr.push(this.roleArr[i].id)
      }
      this.form.roleIds = arr;
      this.$refs.form.validate(valid=>{
        if(this.form.phone === ''){
          self.$message({
            message: '手机号不能为空',
            type: 'warning'
          });
          return false;
        }
        if(this.form.roleIds.length === 0){
          self.$message({
            message: '角色不能为空',
            type: 'warning'
          });
          return false;
        }

        if(valid){
          if(this.form.accountType == '10'){
            let treeNodes = this.$refs.tree.getCheckedNodes(true);
            let treeKeys = this.$refs.tree.getCheckedKeys(true);
            // console.log(treeNodes);
            // console.log(treeKeys);
            if(treeKeys.length === 0){
              self.$message({
                message: '请先选择小区',
                type: 'warning'
              });
              return false;
            }
            
            this.arrcommunitCode = treeNodes //小区列表
            this.form.communityIds = treeKeys//小区code
            this.form.zoningCodes = []//行政区划编码
          }else{

            let treeNodes = this.$refs.tree_A.getCheckedNodes(true);
            let treeKeys = this.$refs.tree_A.getCheckedKeys(true);

            if(treeKeys.length === 0){
              self.$message({
                message: '请先选择居委会',
                type: 'warning'
              });
              return false;
            }
            // console.log(treeNodes);
            // console.log(treeKeys);
            this.arrcommunitCode = treeNodes //居委会整个列表
            this.form.communityIds = []//已分配小区列表
            this.form.zoningCodes = treeKeys//行政区划编码
          }

          this.submitBtnState = true;//显示详情
        }
      })
    }
  },
  watch: {
    //过滤树节点
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    //过滤树节点
    filterText_A(val) {
      this.$refs.tree_A.filter(val);
    },
    //监听帐号类型
    'form.accountType':function(val, oldVal) {
      // console.log('1111111111');
      // console.log('new: %s, old: %s', val, oldVal);
      if(val == '10'){//10 物业帐号  20政府帐号
        this.treeShow = true
        this.treeShow_A = false
        this.treeEmptyShow = false
        // this.tags = []
        // // console.log(this.defaultCheckedKeys);

        // this.defaultCheckedKeys = []
        // this.$refs.tree.setCheckedKeys([]);

        // //将树合起来
        // for (let i = 0; i < this.menuTree.length; i++) {
        //   this.$refs.tree.store.nodesMap[this.menuTree[i].code].expanded = false
        // }
        
        // console.log('我是物业帐号');
      }else if(val == '20'){
        this.treeShow = false
        this.treeShow_A = true
        this.treeEmptyShow = false
        // this.tags_A = []
        // this.defaultCheckedKeys_A = []
        // this.$refs.tree_A.setCheckedKeys([]);
        // // console.log('我是政府帐号');

        // //将树合起来
        // for (let i = 0; i < this.menuTree_A.length; i++) {
        //   this.$refs.tree_A.store.nodesMap[this.menuTree_A[i].code].expanded = false
        // }
      }
    }
  },
  mounted(){
    this.getMenuTree()
    this.accountOptions = accountOptions
    //判断是否脱敏
    // console.log(this.$store.getters.accountType)
    let sensitiveType = this.$store.state.user.sensitive
    if(sensitiveType == 0){//0不脱敏 1全部脱敏 2部分脱敏
      this.sensitiveOptions = sensitiveOptionsNew
    }else if(sensitiveType == 1){
      let sensitiveOptionArr = sensitiveOptionsNew.filter(function(item){      
        return item.label=='全部脱敏';
      });
      this.sensitiveOptions = sensitiveOptionArr
    }else{
      let sensitiveOptionArr = sensitiveOptionsNew.filter(function(item){
        return item.label!=='不脱敏';
      });
      this.sensitiveOptions = sensitiveOptionArr
    }
  }
};
</script>

<style scoped>
.jdClassAdd{
  padding: 25px 30px;
}
.app-container{
  margin: 20px 30px;
}
.app-container-left{
  background: #fff;
  height: 685px;
  margin-right: 10px;
  border-radius: 4px;
  overflow: auto;
}
.app-container-right{
  background: #fff;
  height: 685px;
  border-radius: 4px;
  position: relative;
  padding: 20px;
}
.jdClassAdd .el-form-item__label {
  display: block !important;
  width: 68px !important;
}
.jdClassAdd .el-form-item__content {
  margin-left: 10px;
}
.jdClassAdd .room-place .el-input__inner {
  width: 349px !important;
}
.el-form--inline .el-form-item{
  margin-right: 0px;
}
.jdDiv{
  width: 200px;
  height: 160px;
  /* background: #F2F5F5; */
  text-align: center;
  font-size: 16px;
  color: #999;
  margin-top: 10px;
  margin-bottom: 10px;
  background-image: url('../../../assets/image/roles-icon.png');
  background-position: 50% 50%;
  background-repeat: no-repeat;
}
.jdLabel{
  margin-top:10px;
}
.jdLabel span{
  margin: 3px 2px;
}
span{
  font-size: 14px;
}
.el-form-item{
  margin-bottom: 10px;
}
.el-radio{
  display: block;
  margin: 10px 0;
}
.app-container-right-empty{
  height: 400px;
  width: 500px;
  background-image: url('../../../assets/image/search.png');
  background-position: 50% 50%;
  background-repeat: no-repeat;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.app-container-right-title{
  color: #333333;
  font-size: 16px;
  font-weight: 500;
}
.app-container-right-submit{
  position:absolute;
  bottom:30px;
  right: 16%;
}
.app-container-right-cont{
  padding: 20px 60px 20px 0;
}
.app-container-right-div{
  height: 685px;
}
.app-container-right-scroll{
  height: 630px;
  background: #fff;
}
.app-container-right-ul{
  margin-top: 20px;
  overflow: auto;
  height: 540px;
}
.jdClassAdd .el-form-item--medium .el-form-item__content{
  height: 40px;
  line-height: 40px;
}
.app-container-right-div .app-container-right-ul .el-tag{
  margin: 0 10px 10px 0;
}
</style>
<style>
.jdClassAdd .el-table .cell, .el-table, label.el-form-item__label{
  font-size: 14px;
}
.jdClassAdd .el-form-item__label{
  display: block;
  text-align: left;
}
/* .jdClass-container .el-checkbox-group{
  height: 200px;
  overflow: auto;
} */
.jdTreeClass{
  overflow: auto;
  height: 535px;
  margin-top: 20px;
}
.el-tag.el-tag--info{
  color: #333333;
}
.el-icon-question:before{
  color: #999;
}
</style>