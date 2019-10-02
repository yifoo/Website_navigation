<template>
  <section class="account">
    <div class="login-title">登录</div>
    <el-form
      ref="account"
      :model="account"
      :rules="rules"
      label-width="4rem"
    >
      <el-form-item
        label="昵称"
        prop="uname"
      >
        <el-input
          v-model="account.uname"
          placeholder="请输入昵称"
          @keyup.enter.native="login"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="upwd"
      >
        <el-input
          v-model="account.upwd"
          type="password"
          placeholder="请输入6位以上由数字、字母组合"
          @keyup.enter.native="login"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="login"
        >立即登录</el-button>
      </el-form-item>
      <el-form-item>
        <span class="text">还没有注册?</span>
        <el-button type="text">
          <nuxt-link to="/register">立即注册</nuxt-link>
        </el-button>
        <el-button type="text">
          <nuxt-link to="/">回到首页</nuxt-link>
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
import CryptoJS from "crypto-js";
export default {
  name: "Login",
  layout: "blank",
  data() {
    return {
      account: {
        uname: "",
        upwd: "",
        email: ""
      },
      rules: {
        uname: [
          {
            required: true,
            type: "string",
            message: "请输入昵称",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入邮箱",
            trigger: "blur"
          }
        ],
        upwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            validator: (rule, val, callback) => {
              if (val === "") {
                callback(new Error("请输入密码"));
              // } else if (!new RegExp(/^[\da-zA-Z]{6,}$/).test(val)) {
              //   callback(new Error("请输入正确格式密码"));
              } 
              else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    login() {
      let self = this;
      this.$refs["account"].validate(valid => {
        if (valid) {
          this.loading = this.$loading({
            lock: true,
            text: "登录中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          self.$axios
            .post("/user/login", {
              uname: window.encodeURIComponent(self.account.uname),
              upwd: CryptoJS.MD5(self.account.upwd).toString()
            })
            .then(({ status, data }) => {
              if (status === 200 && data.code === "01") {
                this.$message({
                  type: "success",
                  message: data.msg,
                  duration: 1000
                });
                this.$store.commit("sites/setSiteList", []);
                this.$router.push("/");
              } else {
                this.$message({
                  type: "error",
                  message: data.msg,
                  duration: 1000
                });
              }
              this.loading.close();
            });
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "~assets/css/public/account.scss";
</style>
