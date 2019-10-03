<template>
  <section class="userPwd">
    <el-form ref="password" :model="password" :rules="rules" class="pwdForm" label-width="4rem">
      <el-form-item label="旧密码" prop="opwd">
        <el-input v-model="password.opwd" type="password" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="npwd">
        <el-input v-model="password.npwd" type="password" placeholder="请输入6位以上由数字、字母组合新密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="cpwd">
        <el-input v-model="password.cpwd" type="password" placeholder="请确认新密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editPwd">立即修改</el-button>
        <el-button @click="resetForm('password')">重置</el-button>
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
      password: {
        opwd: "", // 旧密码
        npwd: "", // 新密码
        cpwd: "", // 确认密码
      },
      rules: {
        opwd: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur"
          },
          {
            validator: (rule, val, callback) => {
              if (val === "") {
                callback(new Error("请输入旧密码"));
              } else if (!new RegExp(/^[\da-zA-Z]{6,}$/).test(val)) {
                callback(new Error("请输入6位以上由数字、字母组合密码"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        npwd: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          },
          {
            validator: (rule, val, callback) => {
              if (val === "") {
                callback(new Error("请输入新密码"));
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
            message: "请确认新密码",
            trigger: "blur"
          },
          {
            validator: (rule, val, callback) => {
              if (val === "") {
                callback(new Error("请确认新密码"));
              } else if (val !== this.password.npwd) {
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    editPwd: function() {
      let self = this;
      this.$refs["password"].validate(valid => {
        if (valid) {
          self.$axios
            .post("/user/editPwd", {
              opwd: CryptoJS.MD5(self.password.opwd).toString(),
              npwd: CryptoJS.MD5(self.password.npwd).toString(),
            })
            .then(({ status, data }) => {
              if (status === 200) {
                if (data && data.code === "01") {
                  self.$message.success(data.msg);
                  setTimeout(()=>{
                    this.$router.push("/login");
                  },1000)
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
<style lang="scss" scoped>
.userPwd {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pwdForm{
  width:22rem;
}
</style>

