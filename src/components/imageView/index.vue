<template>
    <el-dialog
      :append-to-body="appendToBody"
      title="查看图片"
      top="10vh"
      :visible.sync="showDialog"
      width="632px">
      <div class="content">
        <img :src="data.imageUrl"/>
        <slot></slot>
      </div>
    </el-dialog>
</template>

<script>
export default {
  props:['data', 'visible','appendToBody'],
  computed:{
    showDialog:{
      get: function(){
        return this.visible;
      },
      set: function(newValue){
        this.$emit('update:visible', newValue)
      }
    }
  }
}
</script>

<style scoped>
  .content{
    width: 100%;
    margin: 0 auto;
    padding: 0 10px;
  }
  .content img{
    width: 100%;
    /* height: 480px; */
    display: block;
    margin: 0 auto;
    margin-bottom: 10px;
    object-fit: cover;
    object-position: 50% 50%;
    border-radius: 7px;
  }
</style>