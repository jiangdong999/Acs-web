<template>
  <div>
    <span @click='click' class="screenfull-svg">
    <svg-icon class-name="navbar-svg" icon-class="fullscreen"/>
    </span>
  </div>
</template>

<script>
  import screenfull from 'screenfull'

  export default {
    name: 'screenfull',
    props: {
      width: {
        type: Number,
        default: 22
      },
      height: {
        type: Number,
        default: 22
      },
      fill: {
        type: String,
        default: '#48576a'
      }
    },
    data() {
      return {
        isFullscreen: false
      }
    },
    methods: {
      click() {
        if (!screenfull.enabled) {
          this.$message({
            message: 'you browser can not work',
            type: 'warning'
          })
          return false
        }
        screenfull.toggle()
      }
    }
  }
</script>

<style scoped>

</style>
