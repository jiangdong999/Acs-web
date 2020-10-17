<template>
  <div class="nav-module jdDIV" v-if="data.length>5">

    <div class="step" :class="{'disabled': disabled}" @click="move(-4)">
      <i class="el-icon-arrow-up"></i>
    </div>

    <div class="nav-box">
      <ul class="navs" :style="{'bottom':bottom}">

        <li 
          v-for="(floor, i) in data"
          :key="i"
          @click="goAnchor('f_'+floor.id, $event)"
          :class="{'nav-active': active == 'f_'+floor.id}">
          {{floor.label}}
        </li>

      </ul>
    </div>

    <div class="step" :class="{'disabled': disabled}" @click="move(4)">
      <i class="el-icon-arrow-down"></i>
    </div>

  </div>
</template>

<script>

let $el

export default {
  props:['data'],
  data(){
    return {
      active:'',
      bottom: '0px'
    }
  },
  computed:{
    disabled(){
      if(this.data.length<9) return true
    }
  },
  methods: {
    goAnchor(selector, el) {
      var anchor = document.getElementById(selector)
      
      anchor.scrollIntoView()
      this.active = selector
    },
    move(n){
      if(this.disabled) return;

      let position = parseInt(this.bottom.split('px')[0])
      
      let _y = position + n*35 > (this.data.length-9)*35? (this.data.length-9)*35 : ((position + n*35) > 0?position + n*35 : 0)

      this.bottom = (_y) + 'px'
    },
    onScroll(){
      // 减去第一层以上的头部距离
      let scrollY = ($el.scrollTop - 125) < 0? 0: ($el.scrollTop - 125)
      // 除以每一层的高度
      let index = Math.floor(scrollY/160)
      
      this.active = 'f_'+this.data[index].id
    }
  },
  mounted () {
    // $el = document.querySelector(".content-view")
    $el = document.querySelector(".jdDIV")

    this.$nextTick( ()=> {
      $el.addEventListener('scroll', this.onScroll)
    })
  },
  destroyed(){
    $el.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/variables.scss';
  ul{
    padding: 0
  }
  li{
    list-style-type: none;
  }
  .nav-module{
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    right: 50px;
    overflow: hidden;
    transition: all .3s;
    opacity: .4;
  }
  .nav-module:hover{
    box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.2);
    opacity: 1;
  }
  .nav-box{
    width: 35px;
    overflow: hidden;
    margin: 10px 0;
  }
  .navs{
    width: 35px;
    max-height: 315px;
    transition: all .3s ease;
    margin: 0;
    /* 与offsetTop有关 */
    position: relative; 
  }
  .navs>li,.step{
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all .3s;
    background-color: #fff;
  }
  .navs>li:hover,.step:hover{
    background-color: $--color-primary;
    color: #fff;
  }
  li.nav-active{
    background-color: $--color-primary;
    color: #fff;
  }
  .disabled{
    opacity: 0.4;
  }
  .nav-module>.disabled:hover{
    cursor: not-allowed;
    background-color: #fff;
    color: #333333;
  }
</style>
