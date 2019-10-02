<template>
  <section class="account">
    <div class="login-title">注册</div>
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
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="account.email"
          placeholder="请输入电子邮箱"
        />
        <el-button
          size="mini"
          round
          type="success"
          @click="sendMsg"
        >发送验证码</el-button>
        <span class="status">{{ statusMsg }}</span>
      </el-form-item>
      <el-form-item
        label="验证码"
        prop="code"
      >
        <el-input
          v-model="account.code"
          maxlength="4"
          placeholder="请输入4位验证码"
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
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="cpwd"
      >
        <el-input
          v-model="account.cpwd"
          type="password"
          placeholder="请确认密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="register"
        >立即创建</el-button>
        <el-button @click="resetForm('account')">重置</el-button>
      </el-form-item>
      <el-form-item>
        <span class="text">已有账号?</span>
        <el-button type="text">
          <nuxt-link to="/login">立即登录</nuxt-link>
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
  name: "Register",
  layout: "blank",
  data() {
    return {
      statusMsg: "",
      account: {
        uname: "",
        code: "",
        upwd: "",
        cpwd: "",
        email: ""
      },
      rules: {
        uname: [
          {
            required: true,
            type: "string",
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            validator: async(rule, val, callback) => {
              if (val === "") {
                callback(new Error("请输入用户名"));
              } else{
                var {status,data} = await this.$axios.post("/user/check",{uname:val})
                if(status==200 && data.code=='-1'){
                  callback(new Error(data.msg));
                }else{
                  callback();
                }
              }
            },
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: async(rule, val, callback) => {
              if (val === "") {
                callback(new Error("请输电子邮箱"));
              } else{
                console.log('jin')
                var {status,data} = await this.$axios.post("/user/check",{email:val})
                if(status==200 && data.code=='-1'){
                  callback(new Error(data.msg));
                }else{
                  callback();
                }
              }
            },
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            type: "string",
            message: "请输入有效验证码",
            trigger: "blur"
          },
          {
            validator: (rule, val, callback) => {
              if (val === "") {
                callback(new Error("请输入有效验证码"));
              } else if (!new RegExp(/^[\da-zA-Z]{4}$/).test(val)) {
                callback(new Error("请输入4位有效验证码"));
              } else {
                callback();
              }
            },
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
              } else if (!new RegExp(/^[\da-zA-Z]{6,}$/).test(val)) {
                callback(new Error("请输入6位以上由数字、字母组合密码"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        cpwd: [
          {
            required: true,
            message: "请确认密码",
            trigger: "blur"
          },
          {
            validator: (rule, val, callback) => {
              if (val === "") {
                callback(new Error("请再次输入密码"));
              } else if (val !== this.account.upwd) {
                callback(new Error("两次输入密码不一致"));
              } else {
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
    sendMsg: function() {
      const self = this;
      // if (self.timerid) return;
      let namePass;
      let emailPass;
      this.$refs["account"].validateField("uname", valid => {
        namePass = valid;
      });
      self.statusMsg = "";
      if (namePass) {
        return false;
      }
      this.$refs["account"].validateField("email", valid => {
        emailPass = valid;
      });
      if (!namePass && !emailPass) {
        self.$axios
          .post("/user/verify", {
            uname: encodeURIComponent(self.account.uname),
            email: self.account.email
          })
          .then(({ status, data }) => {
            if (status === 200 && data && data.code === "01") {
              let count = 60;
              self.statusMsg = `验证码已发送,剩余${count--}秒`;
              clearInterval(self.timerid);
              self.timerid = setInterval(function() {
                self.statusMsg = `验证码已发送,剩余${count--}秒`;
                if (count === 0) {
                  self.statusMsg = "";
                  clearInterval(self.timerid);
                }
              }, 1000);
            } else {
              self.statusMsg = data.msg;
              self.$message.error(data.msg);
            }
          });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    register: function() {
      let self = this;
      this.$refs["account"].validate(valid => {
        if (valid) {
          self.$axios
            .post("/user/register", {
              uname: window.encodeURIComponent(self.account.uname),
              upwd: CryptoJS.MD5(self.account.upwd).toString(),
              email: self.account.email,
              code: self.account.code
            })
            .then(({ status, data }) => {
              if (status === 200) {
                if (data && data.code === "01") {
                  self.$message.success(data.msg);
                  self.$router.push("/login");
                } else {
                  self.error = data.msg;
                  self.$message.error(data.msg);
                }
              } else {
                self.error = `服务器出错，错误码:${status}`;
              }
              setTimeout(function() {
                self.error = "";
              }, 1500);
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

