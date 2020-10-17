<template>
  <el-tree
    ref="tree"
    :data="tree"
    :default-expanded-keys="notRoomNodes"
    node-key="id"
    :render-after-expand="true"
    :expand-on-click-node="false">
    <span class="custom-tree-node" slot-scope="{ node, data }">
      <span>
        <el-popover
          :disabled="data.level===1"
          placement="right"
          title="编辑当前节点名称"
          trigger="hover"
          width="200">
        <el-input :value="data.label" maxlength="16" @change="checkEmptyValue(data, $event)"></el-input>
          <span slot="reference">{{ data.label }}</span>
        </el-popover>
      </span>
      <span>
        <el-popover v-if="data.type!='R'"
          placement="left"
          trigger="hover"
          width="200">
          <p>当前节点名称：<h4 class="title">{{data.label}}</h4></p>
          <span v-if="data.level<5">
            <el-form label-position="top" inline>
              <p>新增节点类型: <strong>{{ filterNodeType(data.level) }}</strong></p>
              <el-form-item label="数量">
                <el-input-number v-model="count" class="count-input" :precision="0" :step="1" :min="1" :max="50"></el-input-number>
              </el-form-item>
            </el-form>
            <div class="control-btn">
              <el-button type="primary" @click="appendNode(data, count)">确定</el-button>
            </div>
          </span>
          <span v-if="data.level==5">
            <p class="edit">请输入要添加房间的房间号，以回车区分</p>
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 8 }"
              placeholder="请输入内容"
              v-model="rooms">
            </el-input>
            <div style="text-align:center;margin-top:20px;">
              <el-button type="primary" @click="setRooms(data, rooms)">确定</el-button>
            </div>
          </span>

          <el-button
            type="text"
            size="mini"
            class="node-ctrl"
            slot="reference">
            新增
          </el-button>
        </el-popover>
        <div style="display:inline-block;width:30px">
          <el-button
            type="text"
            size="mini"
            class="node-ctrl"
            @click.stop="() => remove(node, data)">
            删除
          </el-button>
        </div>
      </span>
    </span>
  </el-tree>
</template>

<script>
let id = 0;

export default {
  props:['roomNode'],
  data() {
    return {
      hasArea:false,
      tree: [],
      notRoomNodes:[],
      count:1,
      rooms:''
    }
  },
  methods:{
    filterNodeType(level) {
      switch(level){
        case 1:
          if(this.hasArea)
            return '区域'
          else{
            return '楼栋'
          }
        case 2:
          return '楼栋'
        case 3:
          return '单元'
        case 4:
          return '楼层'
        case 5:
          return '房间'
      }
    },
    getUnit(level) {
      switch(level){
        case 1:
          if(this.hasArea)
            return '区'
          else{
            return '栋'
          }
        case 2:
          return '栋'
        case 3:
          return '单元'
        case 4:
          return '层'
        default:
          return ''
      }
    },
    getChildrenLevel(level) {
      let childrenLevel
      level = parseInt(level)

      if(typeof(level)==="number"){
        if(level===1){
          childrenLevel = this.hasArea?2: 3
        }else{
          childrenLevel = level+1
        }
      }

      return childrenLevel
    },
    checkEmptyValue(node, newName){
      if(newName.match(/^\s+$/)){
        node.label = '未命名节点'
      }else{
        node.label = newName
      }
    },
    getAppendName(parentNode){
      let level = parseInt(parentNode.level)

      if(level>=1 && level<5){
        if(level == 1){
          return this.hasArea?String.fromCharCode(parentNode.children.length+65): parentNode.children.length+1
        }else{
          return parentNode.children.length+1
        }
      }
    },
    appendNode(parentNode, count) {

      if(!count){
        this.$message.error('请输入正确的数量')
        return false
      }

      if (!parentNode.children) {
        this.$set(parentNode, 'children', []);
      }
      for(var i=0; i<count; i++){

        let newChild = { id: id++ };
        newChild.level = this.getChildrenLevel(parentNode.level)
        newChild.label = this.getAppendName(parentNode) + this.getUnit(parentNode.level)
        newChild.type = newChild.level===6? 'R': 'N'

        parentNode.children.push(newChild);
      }

      this.$emit('update:roomNode', this.tree)

    },
    remove(node, data) {
      this.$confirm('确认删除?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // const parent = node.parent;
        // const children = parent.data.children || parent.data;
        // const index = children.findIndex(d => d.id === data.id);
        // children.splice(index, 1);
        this.$refs.tree.remove(node)

        this.$emit('update:roomNode', this.tree)
      }).catch(() => {
      });
    },
    createNode(nodeParams) {
      this.tree = []
      // level:1为小区，2为区域，3为楼栋，4为单元，5为楼层，6为房间
      let communityNode = { id: id++, label: nodeParams.communityName||'当前小区', type:"N", level: 1, children: [] }
      // 收集非房间节点的id，这些节点默认展开
      this.notRoomNodes.push(communityNode.id)

      // 为新增节点类型筛选做判断
      if(nodeParams.areaCount<1){
        this.hasArea= false
      }else{
        this.hasArea= true
      }
      
      this.createArea(nodeParams, communityNode)
      this.tree.push(communityNode)
      this.$emit('update:roomNode', this.tree)
    },
    createArea(nodeParams, parentNode) {
      let areaCount = parseInt(nodeParams.areaCount)

      if(areaCount === 0){
        // 若小区不设置区域
        this.createBuild(nodeParams, parentNode)
      }else{

        for(var i=0; i<areaCount; i++){
          let areaNode = { type:"N", level: 2, children: []}
          areaNode.id = id++
          areaNode.label = String.fromCharCode(i+65)+'区'

          this.createBuild(nodeParams, areaNode)
          this.notRoomNodes.push(areaNode.id)
          parentNode.children.push(areaNode)
        }
      }
    },
    createBuild(nodeParams, parentNode) {
      let buildCount = parseInt(nodeParams.buildCount)

      if(buildCount === 0){
        this.message.error('楼栋数量错误')
      }else{

        for(var i=0; i<buildCount; i++){
          let buildNode = { type:"N", level: 3, children: [] }
          buildNode.id = id++
          buildNode.label = (i+1)+'栋'

          this.createPart(nodeParams, buildNode)
          this.notRoomNodes.push(buildNode.id)
          parentNode.children.push(buildNode)
        }
      }
    },
    createPart(nodeParams, parentNode) {
      let partCount = parseInt(nodeParams.partCount)

      if(partCount === 0){
        this.message.error('单元数量错误')
      }else{

        for(var i=0; i<partCount; i++){
          let partNode = { type:"N", level: 4, children: [] }
          partNode.id = id++
          partNode.label = (i+1)+'单元'

          this.createFloor(nodeParams, partNode)
          this.notRoomNodes.push(partNode.id)
          parentNode.children.push(partNode)
        }
      }
    },
    createFloor(nodeParams, parentNode) {
      let floorCount = parseInt(nodeParams.floorCount)

      if(floorCount === 0){
        this.message.error('楼层数量错误')
      }else{

        for(var i=0; i<floorCount; i++){
          let floorNode = { type:"N", level: 5, children: [] }
          floorNode.id = id++
          floorNode.label = (i+1)+'层'

          this.createRoom(nodeParams, floorNode, i+1)
          parentNode.children.push(floorNode)
        }
      }
    },
    createRoom(nodeParams, parentNode, floor) {
      let roomCount = parseInt(nodeParams.roomCount)
      let floorStr = floor>9? floor+'': '0'+floor

      for(var i=0; i<roomCount; i++){
        let roomNode = { type:"R", level: 6 }
        roomNode.id = id++

        let roomStr = (i+1)>9? (i+1)+'': '0'+(i+1)
        roomNode.label = floorStr+roomStr

        parentNode.children.push(roomNode)
      }
    },
    textRooms(data) {
      let result = ''
      if(!data.children){
        this.$set(data, 'children', []);
      }
      data.children.forEach((item, index) => {
        if(data.children.length-1 === index){
          result += item.label
        }else{
          result += item.label+'\n'
        }
      });
      return result
    },
    setRooms(data,value) {
      if(value!=='' && value!==undefined && value!==null){
        let roomList = value.split('\n')
        if(!data.children){
          this.$set(data, 'children', []);
        }

        roomList.forEach((roomName, index)=>{
          
          let roomNode = { type:"R", level: 6 }
          roomNode.id = id++
          roomNode.label = roomName
          data.children.push(roomNode)
          
        })
        this.rooms = ''

        this.$emit('update:roomNode', this.tree)

      }
    }
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
