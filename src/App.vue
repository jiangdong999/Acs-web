<template>
  <div id="app">
    <router-view v-if="reloadState"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      reloadState: true
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  methods: {
    reload() {
      let self = this;
      self.reloadState = false;
      self.$nextTick(() => {
        self.reloadState = true;
      });
    }
  }
};
</script>
