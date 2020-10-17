<template>
  <section class="main-footer-container" role="banner">
    <div class="main-footer">
      <span>{{ version }}</span>
      <span>&copy; 2015-2020 北京睿家科技有限公司 版权所有&emsp;京ICP备15034835号-1</span>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "AppFooter",
    computed: {
      ...mapGetters([
        'version'
      ])
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .main-footer-container {
    // z-index: 200;
    // position: absolute;
    // bottom: 0;
    // left: 90px; //sidebar是 180px宽，这里 左平移90px 是相对全宽度
    height: 30px;
    vertical-align: middle;
    text-align: center;
    line-height: 30px;
    background: #F0F2F5;
    font-size: 14px;
    color: #aaaaaa;
    width: 100%;
  }

  .main-footer {
    letter-spacing: 1px;
    span {
      padding: 0 10px;
    }
  }
</style>
