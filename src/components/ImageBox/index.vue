<template>
  <div>
    <el-card :body-style="{ padding: '0px' }">
      <img :src="src" class="image">
      <div style="padding: 14px;">
        <span>{{title}}</span>
        <div class="bottom clearfix">
          <el-button type="text" class="button"><i class="el-icon-close"></i></el-button>
        </div>
      </div>
    </el-card>
  </div>

</template>

<script>
  export default {
    name: "image-box",
    props: {
      src: {
        type: String
      },
      title: {
        type: [String, Number]
      }
    }
  }

</script>

<style scoped>
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
