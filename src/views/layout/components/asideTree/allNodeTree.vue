<template>
    <scroll-bar class="scrollBar" v-loading="loading">
        <el-input v-model="filterText" placeholder="请输入内容" class="filter-input" clearable></el-input>
        <el-tree :data="data"
                :props="defaultProps"
                accordion
                @node-click="handleNodeClick"
                :load="loadNode"
                empty-text="无此节点"
                ref="tree"
                :filter-node-method="filterNode"
                lazy>
        </el-tree>
    </scroll-bar>
</template>

<script>
import ScrollBar from '@/components/ScrollBar'
import {dropdownAllNode} from '@/api/node'
import {mapGetters} from 'vuex'

export default {
    components: {ScrollBar},
    computed:{
        ...mapGetters([
            'communityId'
        ])
    },
    data(){
        return {
            loading: false,
            filterText:'',
            defaultProps: {
                children: "children",
                label: "label",
                isLeaf: 'leaf'
            },
            data:[]
        }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods:{
        loadNode:function(node, resolve) {
            if(node.data.children && node.data.children.length>0){
                let data = node.data.children

                for(let children of data){
                    children.leaf = !children.disabled
                }
                resolve(data);
            }else if(!node.data.children&&node.data.type=='N'){  //若没有子节点可供加载，则二次访问接口获得下层数据
                // 若不是单位节点,只有单位节点的parentid为-1
                if(node.data.parentId!=-1){
                    this.loadData({ nodeType: 'R', nodeId: node.data.id }).then(data => {
                        if(data[0].children){
                            for(let children of data[0].children){
                                children.leaf = !children.disabled
                            }
                            resolve(data[0].children)
                        }else{
                            resolve([])
                        }
                    })
                }else{
                    resolve([])
                }
            }else{
                node.data.leaf = true;
                resolve([])
            }
        },
        handleNodeClick:function(data){
            // if(data.parentId!='-1'){
                this.$store.dispatch('setNode', data)
            // }
        },
        loadData:function(data){
            let self = this;
            data = data || { nodeType:'N', communityId: self.communityId }
            return new Promise((resolve,reject)=>{
                dropdownAllNode(data).then(function(response) {
                    if (response && response.data) {
                        // 区分是首次单位节点加载 还是子节点加载
                        if(data.nodeType=='N'){ 
                            self.data = response.data.dataList;
                        }else{
                            // data.children = response.data.dataList[0].children
                            resolve(response.data.dataList)
                        }
                    }
                })
                .catch(function(a) {
                    console.error(a);
                }).finally(_=>{
                    self.loading = false;
                });
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    },
    mounted(){
        this.loading = true;
        this.$store.dispatch('setNode', null)
        this.loadData()
    }
}
</script>
<style scoped>
    .scrollBar{
        background-color: #fff;
        height: calc(100vh - 114px);
        overflow-y: scroll;
    }
    .filter-input{
        margin-bottom: 15px;
    }
</style>
