<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <!-- 单级菜单 -->
      <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children||item.alwaysShow" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <i v-if="item.children[0].meta&&item.children[0].meta.icon" class="iconfont" :class="'icon-'+item.children[0].meta.icon"></i>
          <!-- <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon> -->
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>
      <!-- 二级菜单 -->
      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <i v-if="item.meta&&item.meta.icon" class="iconfont" :class="'icon-'+item.meta.icon"></i>
          <!-- <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon> -->
          <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon> -->
              <!-- <i v-if="child.meta&&child.meta.icon" class="iconfont" :class="'icon-'+child.meta.icon"></i> -->
              <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'

export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    generateTitle
  },
}
</script>

<style scoped>
  .iconfont{
    color: #fff !important;
    margin-right: 5px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../../../styles/variables.scss';

  ul .router-link-exact-active {
    li {
      border-left: 5px solid $--color-primary;
      padding-left: 15px !important;
      // background-color: rgba(0,0,0,0.4) !important;
    }
  }

  li .router-link-exact-active {
    li {
      border-left: 5px solid $--color-primary;
      padding-left: 35px !important;
      // background-color: rgba(0,0,0,0.4) !important;
    }
  }
  
</style>

<style>
.el-menu-item{
  height: 44px !important;
  line-height: 44px !important;
  color: #BBBFC3 !important;
}
.el-submenu__title{
  height: 44px !important;
  line-height: 44px !important;
  color: #BBBFC3 !important;
}
.el-submenu .el-menu-item{
  background-color:#1E2937 !important;
}
.is-opened .el-submenu__title{
  font-weight: bold !important;
  color: #fff !important;
}
.is-opened .is-active{
  color:#0074DA !important;
  font-weight: 600 !important;
  
}
</style>

