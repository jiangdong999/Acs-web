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
                    children.leaf = children.disabled
                }
                resolve(data);
            }else{
                node.data.leaf = true;
                resolve([])
            }
        },
        handleNodeClick:function(data){
            this.$store.dispatch('setNode', data)
        },
        loadData:function(data){
            let self = this;
            data = data || { nodeType:'N', parentId:-1, communityId: self.communityId }
            return new Promise((resolve,reject)=>{
                dropdownAllNode(data).then(function(response) {
                    if (response && response.data) {
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
