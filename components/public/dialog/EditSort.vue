<template>
  <el-dialog
    :visible.sync="editSortShow"
    :width="dialogWidth"
    title="修改分类"
    center
  >
    <div style="text-align: center">
      <el-form
        v-loading="loading"
        ref="editSort"
        :element-loading-text="loadingText"
        label-width="80px"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.7)"
      >
        <el-form-item label="上级分类">
          <el-select
            v-model="newSortId"
            placeholder="请选择活动区域"
            style="width:100%;"
          >
            <el-option
              v-for="(item,key) in sortList"
              :key="key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前分类">
          <el-input v-model="newSubTitle" />
        </el-form-item>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="editSortShow = false">取 消</el-button>
      <el-button
        type="primary"
        @click="submitSubSort()"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Qs from "qs";
export default {
  name: "EditSort",
  props: {
    subTitle: {
      type: String,
      default: null
    },
    subSortId: {
      type: Number,
      default: null
    },
    sortId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      loadingText: "加载中...",
      dialogWidth: "500px",
      editSortShow: false,
      newSortId: "",
      newSubTitle: ""
    };
  },
  computed: {
    subSortList() {
      return this.$store.state.sites.subSortList;
    },
    sortList() {
      return this.$store.state.sites.sortList;
    }
  },
  watch: {
    editSortShow(val) {
      if (this.sortList.length == 0) {
        this.getSubSort();
      }
      // 当弹窗打开时,记录sortId和subTitle
      if (val) {
        // console.log("subsortList", this.subSortList);
        this.newSortId = this.sortId;
        this.newSubTitle = this.subTitle;
      } else {
        this.newSortId = "";
        this.newSubTitle = "";
      }
    }
  },
  beforeMount() {
    if (window.document.body.clientWidth <= 768) {
      this.dialogWidth = "100%";
    }
  },
  methods: {
    /**
     * 获取下拉框分类
     */
    async getSubSort() {
      if (this.subSortList && this.subSortList.length > 0) {
        return false;
      } else {
        this.loading = true;
        this.loadingText = "加载中...";
        let { status, data } = await this.$axios.get("/sites/getSubSort");
        this.loading = false;
        if (status === 200 && data.code === "01") {
          this.$store.commit("sites/setSubSortList", data.respData.subSortList);
        }
      }
    },
    async submitSubSort() {
      var _self = this;
      if (
        this.newSortId === this.sortId &&
        this.newSubTitle === this.subTitle
      ) {
        this.editSortShow = false;
        return false;
      }
      var reqData = {
        sortId: this.newSortId,
        subTitle: this.newSubTitle,
        subSortId: this.subSortId
      };
      this.loading = true;
      this.loadingText = "更新中...";
      let { status, data } = await this.$axios.post(
        "/subSort/edit",
        reqData
      );
      this.loading = false;
      if (status === 200 && data.code === "01") {
        this.$message({
          type: "success",
          message: data.msg,
          duration: 1000
        });
        this.$store.commit("sites/setIsUpdateAll", true);
        this.$store.commit("sites/setSubSortList", []);
        this.hideEditBox();
      } else {
        this.$message({
          type: "error",
          message: data.msg,
          duration: 1000
        });
      }
    },
    hideEditBox: function() {
      this.editSortShow = false;
      this.$refs["editSort"].resetFields();
    }
  }
};
</script>
