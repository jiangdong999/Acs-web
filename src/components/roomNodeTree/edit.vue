<template>
  <div class="treeNodeClass">
    <el-tree
    ref="tree"
    :data="roomNode"
    :default-expanded-keys="expandedArr"
    node-key="id"
    :render-after-expand="true"
    :expand-on-click-node="false">
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <div>
          <el-popover
            :disabled="parseInt(data.level)==1 || parseInt(data.level)==999"
            placement="right"
            title="编辑当前节点名称"
            trigger="hover"
            width="200">
            <input class="el-input__inner" :value="data.nodeName" @change="editName(data, $event, node)" maxlength="16"/>
            <!-- <el-button @click="editName(data, $event)">确定</el-button> -->
            <span slot="reference" class="room-node-name">{{ data.nodeName }}</span>
          </el-popover>
        </div>
        <span>
          <div style="display:inline-block;width:30px">
            <el-button
              type="text"
              size="mini"
              class="node-ctrl"
              @click="handleAdd(node)"
              v-if="parseInt(data.level)!=6 && parseInt(data.level)!=999 "
              slot="reference">
              新增
            </el-button>
          </div>
          <div style="display:inline-block;width:30px">
            <el-button
              type="text"
              size="mini"
              class="node-ctrl"
              v-if="parseInt(data.level)!==1 && parseInt(data.level)!=999 "
              @click.stop="() => remove(node, data)">
              删除
            </el-button>
          </div>
        </span>
      </div>
    </el-tree>

    <div v-if="showForm">
      <el-dialog
      title="批量添加房屋"
      width="1011px"
      :visible.sync="showForm"
      :close-on-click-modal="false">
        <dialog-form 
        :node="currentNode.data"
        @creatNodes="appendNode"
        @creatRooms="appendRooms"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {delNode} from '@/api/room.js'
import {addBatchRoom,addNode,multiRoomModify} from "@/api/roomv1.js";
import {mapGetters} from 'vuex'
import form from "./form";

let id = 0;
let keys = new Object({
  areaCount: 2,
  buildCount: 3,
  partCount: 4,
  floorCount: 5,
  roomCount: 6
});

export default {
  props:['roomNode', 'params'],
  components:{
    dialogForm: form
  },
  data() {
    return {
      showForm:false,
      hasArea:false,
      count:1,
      childrenType:'',
      expandedArr:[],
      currentNode:{}
    }
  },
  computed:{
    ...mapGetters([
      'communityId'
    ]),
  },
  methods:{
    handleAdd(node){
      this.currentNode = node
      this.showForm = true
    },
    appendNode(parentNode, formData) {
      this.showForm = false
      this.currentNode.loading = true

      let nodes = []
      for(var key in formData){
        if(formData[key] != 0){
          let node = { number:null, level:'' }
          node.number = formData[key]
          node.level = keys[key]

          nodes.push(node)
        }
      }
      
      addBatchRoom({
        communityUuid: parentNode.communityUuid,
        parentUuid: parentNode.nodeUuid,
        nodes: JSON.stringify(nodes)
      }).then((response)=> {
        if(response.data && response.data.status ===0){
          this.$message({
            message: response.data.message,
            type: 'success'
          });

          if(!parentNode.children){
            this.$set(parentNode, 'children', []);
          }
          this.roomNode = response.data.content.children
        }
      }).finally(_=>{
        this.currentNode.loading = false
      })

    },
    appendRooms(parentNode, rooms ) {
      this.showForm = false
      this.currentNode.loading = true
      // console.log(parentNode,rooms);
      addNode({
        communityUuid: parentNode.communityUuid,
        parentUuid: parentNode.nodeUuid,
        level: 6,
        nodeNames: JSON.stringify(rooms)
      }).then((response)=> {
        if(response.data && response.data.status ===0){
          this.$message({
            message: response.data.message,
            type: 'success'
          });

          if(!parentNode.children){
            this.$set(parentNode, 'children', []);
          }
          parentNode.children.push(...response.data.content)
        }
      }).finally(_=>{
        this.currentNode.loading = false
      })
    },
    remove(node, data) {
      // console.log(node,data);
      this.$confirm('确认删除?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let parentNode = node.parent
        parentNode.loading=true
        delNode({
          roomId: data.id
        }).then(response=> {
          if (response && response.data.code === 1) {
            // console.log(response);
            this.$message({
              message: response.data.message,
              type: 'success'
            });
            const children = parentNode.data.children || parentNode.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
          }
          return false;
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{
          parentNode.loading=false
        })
      }).catch(() => {
      });
    },
    editName(data, $event, node){
      // console.log(data, newName)
      let newName = $event.target.value
      if(!(/^.*[^\s]+.*$/).test(newName)){
        this.$message.error('内容不可为空')
        return
      }
      node.loading=true
      // console.log(data);
      multiRoomModify({
        communityUuid: data.communityUuid,
        nodeUuid: data.nodeUuid,
        type: data.type,
        nodeName: newName,
      }).then((response)=> {
        if(response.data && response.data.status ===0){
          this.$message({
            message: response.data.message,
            type: 'success'
          }); 
          data.nodeName = newName
        }
      }).finally(_=>{
        node.loading=false
      })
    },
    getExpandedNode(nodes, maximum){
      for( let node of nodes){
        // 默认展开前100个节点
        if(this.expandedArr.length < 100){

          this.expandedArr.push(node.id);
          
          if(node.children && node.children.length>0){
            this.getExpandedNode(node.children, maximum)
          }
          
        }else{
          return
        }
      }
    }
  },
  mounted(){
    // 为新增节点类型筛选做判断
    if(this.roomNode[0].children[0].level==='3'){
      this.hasArea= false
    }else if(this.roomNode[0].children[0].level==='2'){
      this.hasArea= true
    }

    this.getExpandedNode(this.roomNode, this.roomNode[0].id+100)
  }
}
</script>
<style scoped>
  .count-input{
    width: 120px
  }
  .control-btn{
    padding-top: 20px;
    text-align: center;
    border-top: 1px solid #66DDDB;
  }
  .edit{
    font-size: 13px;
    color: #555555;
  }
  .title{
    font-size: 20px;
    margin: 15px 0;
  }
  .node-ctrl{
    text-decoration: underline;
    margin-right: 20px;
  }
</style>
<style>
  .el-popover .el-radio.is-bordered{
    margin: 0 10px 10px 10px;
  }
  .custom-tree-node.el-row::before{
    display: none
  }
  .room-node-name{
    display: inline-block;
    min-width: 50px;
    height: 16px
  }
  .treeNodeClass .el-tree-node__content:hover{
    background-color: #dfeafb;
  }
</style>
