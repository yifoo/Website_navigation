<template>
  <el-dialog
    :visible.sync="editShow"
    :width="dialogWidth"
    title="意见反馈"
    center
    @close="closeShow"
  >
    <div style="text-align: center">
      <el-form
        ref="feedBox"
        label-width="0px"
      >
        <el-form-item label="">
          <el-input
            v-model="content"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="如果您有好的建议,请在这里告诉我,谢谢..."
            type="textarea"
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeShow">取 消</el-button>
      <el-button
        type="primary"
        @click="submit"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Qs from "qs";
export default {
  name: "FeedBack",
  data() {
    return {
      dialogWidth: "500px",
      content:""
    };
  },
  computed: {
    editShow() {
      return this.$store.state.showFeedBack;
    }
  },
  beforeMount() {
    if (window.document.body.clientWidth <= 768) {
      this.dialogWidth = "100%";
    }
  },
  methods: {
    closeShow() {
      this.content = ""
      this.$store.commit("setShowFeedBack", false);
    },
    async submit() {
      if (this.content) {
        let { status, data } = await this.$axios.post("/feedBack/submit", {
          content: this.content
        });
        if (status === 200 && data.code === "01") {
          this.$message({
            type: "success",
            message: data.msg
          });
          this.closeShow()
        }else{
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      }
    }
  }
};
</script>
