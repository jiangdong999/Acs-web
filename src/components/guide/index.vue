<template>
  <span class="guide-content" @click="hideGuide">
    <slot></slot>
    <transition name="el-fade-in-linear">
      <div class="guide-overlay" :class="placement?'guide-'+placement:'guide-left'" v-show="showGuide">
        {{text}}
      </div>
    </transition>
  </span>
</template>

<script>
export default {
  props:['text', 'placement'],
  data(){
    return {
      showGuide: true
    }
  },
  methods:{
    hideGuide(){
      this.showGuide = false
    }
  }
}
</script>

<style scoped>
  .guide-content{
    position: relative;
    display: inline-block;
    height: 100%;
    cursor: default
  }
  .guide-overlay{
    position: absolute;
    background-color: rgba(0, 0, 0, .6);
    z-index: 100;
    color: #fff;
    font-size: 14px;
    padding: 5px 10px;
    line-height: 30px;
    border-radius: 8px;
    white-space: nowrap;
  }
  .guide-overlay:before{
    content:'';
    position: absolute;
    display: inline-block;
    border: 10px solid transparent;
  }
  .guide-left{
    right: 100%;
    top: 10px;
    margin-right: 10px;
  }
  .guide-left:before{
    right: -20px;
    border-left: 10px solid rgba(0, 0, 0, .6);
    margin-top: -10px;
    top: 50%;
  }
  .guide-bottom{
    left:0;
    margin-top: 10px;
  }
  .guide-bottom:before{
    top: -20px;
    border-bottom: 10px solid rgba(0, 0, 0, .6);
    margin-left: -10px;
    left: 50%;
  }
  .guide-top{
    bottom: 100%;
    left:0;
    margin-bottom: 10px;
  }
  .guide-top:before{
    bottom: -20px;
    border-top: 10px solid rgba(0, 0, 0, .6);
    margin-left: -10px;
    left: 50%;
  }
</style>
