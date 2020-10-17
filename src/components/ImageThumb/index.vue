<style scoped lang="scss">
  .rj-img-thumb {
    width: 50px;
    height: 50px;
    margin: 5px;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    font: 0/0 a;
  }

  .rj-img-thumb:before {
    content: ' ';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }

  .rj-img-thumb .rj-img-thumb-i {
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
    display: inline-block;
  }
</style>
<template>
  <div v-if="src == null">
    <p style="color: red">暂无图片</p>
  </div>
  <div v-else>
      <el-button type="text" @click="handleClick">{{text}}</el-button>
    <el-dialog :visible.sync="showModal" :title="text" :append-to-body="true">
      <img :src="src" v-if="showModal" style="width: 100%">
    </el-dialog>
  </div>
</template>
<script>

  export default {
    name: "image-thumb",
    props: {
      src: String,
      text: String,
      width: [Number, String],
      height: [Number, String]
    },
    data() {
      return {
        showModal: false,
      }
    },
    methods: {
      handleClick: function () {
        let self = this;
        self.showModal = !self.showModal;

      },
    }
  }
</script>
