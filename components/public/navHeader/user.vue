<template>
  <div
    v-if="userShow"
    class="nav-user"
  >
    <template v-if="$store.state.userInfo.uname">
      <span class="user-name">欢迎您，<strong style="color:yellow">{{ userName }}</strong> </span>
      <el-dropdown @command="handleCommand">
        <span class="nav-text">
          个人中心<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item>
            <nuxt-link
              class="el-dropdown-link"
              to="/user-center"
            >账号设置</nuxt-link>
          </el-dropdown-item> -->
          <el-dropdown-item command="edit">{{ editName }}</el-dropdown-item>
          <el-dropdown-item command="feedback">意见反馈</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <a @click="logout">退出</a>
    </template>
    <template v-else>
      <el-popover
        placement="top-start"
        width="150"
        trigger="hover"
        content="在个人中心选择编辑模式，可以分类、排序和添加网址"
      >
        <a
          slot="reference"
          class="tips"
        >登录后自定义网址→</a>
      </el-popover>
      <nuxt-link
        to="/login"
        class="login"
      >立即登录</nuxt-link>
      <nuxt-link
        class="register"
        to="/register"
      >注册</nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userShow: false,
      editName: "编辑模式"
    };
  },
  computed: {
    uname() {
      return decodeURIComponent(this.$store.state.userInfo.uname);
    },
    userName() {
      return this.$store.state.userInfo.userName;
    }
  },
  async mounted() {
    const { status, data } = await this.$axios.get("/user/getUser");
    if (status === 200) {
      this.$store.commit("setUserInfo", data.respData);
    }
    this.userShow = true;
    console.log("userName: ", this.userName);
  },
  methods: {
    async logout() {
      this.$confirm(`是否退出登录`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async confirm => {
          const { status, data } = await this.$axios.get("/user/logout");
          console.log("user", data);
          if (status === 200 && data.code === "01") {
            this.$store.commit("setUserInfo", {});
            this.$message({
              type: "success",
              message: data.msg
            });
            this.$store.commit("sites/setSiteList", []);
            this.$store.commit("sites/setIsUpdateAll", true);
            this.$store.commit("sites/setEdit", false);
            this.$store.commit("search/setSHistory", []);
            this.$store.commit("sites/setSubSortList", []);
          }
        })
        .catch(cancel => {});
    },
    handleCommand(command) {
      switch (command) {
        case "edit":
          this.changeEdit();
          break;
        case "feedback":
          this.$store.commit("setShowFeedBack", true);
          break;
      }
    },
    changeEdit() {
      if (this.editName == "编辑模式") {
        this.editName = "完成编辑";
        this.$store.commit("sites/setEdit", true);
        this.$message({
          type: "success",
          message: "进入编辑",
          duration: 1000
        });
      } else {
        this.editName = "编辑模式";
        this.$store.commit("sites/setEdit", false);
        this.$message({
          type: "success",
          message: "退出编辑",
          duration: 1000
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-user {
  float: right;
}
.nav-text {
  color: #fff;
  cursor: pointer;
  font-size: .7rem;
}
.user-name{
  display: inline-block;
  margin:0 .5rem;
}
@keyframes myfirst {
  0% {
    left: 0;
  }
  50% {
    left: -1rem;
  }
  100% {
    left: 0;
  }
}
.tips {
  color: #fff;
  position: relative;
  animation: myfirst 2s linear infinite;
}
</style>
