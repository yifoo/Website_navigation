<template>
  <div class="user">
    <el-row class="userContainer">
      <el-col :span="4" class="menu">
        <el-menu
          :collapse="isCollapse"
          default-active="1"
          class="menuContent"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            <i class="el-icon-setting"></i>
            <span slot="title">密码修改</span>
          </el-menu-item>
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>个人设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">密码修改</el-menu-item>
            </el-menu-item-group>
          </el-submenu>-->
        </el-menu>
      </el-col>
      <el-col :span="20" class="userContent">
        <user-pwd></user-pwd>
        <!-- <user-pwd v-if="activeKey=='1-1'"></user-pwd> -->
        <!-- <Info v-if="activeKey=='1'"></Info> -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Info from "@/components/userCenter/Info";
import UserPwd from "@/components/userCenter/UserPwd";
export default {
  layout: "default",
  name: "UserCenter",
  components: { UserPwd, Info },
  data() {
    return {
      isCollapse: false,
      activeKey: "1"
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeKey = key;
    }
  }
};
</script>
<style lang="scss" scoped>
.user {
  width: 100%;
  height: 100%;
}
.userContainer {
  height: 100%;
  .menu {
    height: 100%;
  }
  .menuContent {
    height: 100%;
    border-right: none;
    .el-submenu .el-menu-item {
      min-width: auto;
    }
  }
}
.userContent {
  height: 100%;
  background: #f0f0f0;
}
</style>
