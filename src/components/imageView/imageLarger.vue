<template>
  <div class="content">
    <img :src="data.imageUrl" @error="imgError"/>
    <slot></slot>
  </div>
</template>

<script>
import imgEr from "@/assets/image/img-larger-error.png"
export default {
  props:['data'],
  methods:{
    imgError(e){
      e.target.src = imgEr
      e.target.className += ' img-error'
    },
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
    width: 480px;
    /* height: 480px; */
    display: block;
    margin: 0 auto;
    margin-bottom: 10px;
    object-fit: scale-down;
    object-position: 50% 50%;
    border-radius: 7px;
  }
</style>
