<template>
  <el-container class="index_cotainer">
    <el-header height="100px" class="index_header">
      <h2 style="text-align:center;padding:20px 0 0 0;color:white">
        咚校园校园服务平台后台管理系统
      </h2>
    </el-header>
    <el-container>
      <el-aside width="200px"
        ><el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/user">平台用户</el-menu-item>
              <!-- <el-menu-item index="/accout">学生认证</el-menu-item> -->
              <el-menu-item index="/feiyong">账户信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>成绩管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/grade">用户成绩</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>推送管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/swip">首页轮播图</el-menu-item>
              <el-menu-item index="/news">首页资讯</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>交易管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/goods">商品管理</el-menu-item>
              <el-menu-item index="/order">订单管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu></el-aside
      >
      <el-main class="index_main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      router: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style>
.index_cotainer {
  height: 100%;
}
.el-menu-vertical-demo {
  height: 100%;
}
.index_header {
  background-color: rgb(65, 64, 61);
}
</style>
