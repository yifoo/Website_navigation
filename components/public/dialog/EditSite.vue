/*
 * @Author: wuhao
 * @Date: 2018-08-30 10:46:35
 * @Desc: 组件 编辑/添加网址
 * @Last Modified by: wuhao
 * @Last Modified time: 2019-10-05 21:21:31
 */
<template>
  <!-- 添加新网址弹窗 -->
  <el-dialog
    :title="addSiteTitle"
    :visible.sync="isAdd"
    :width="dialogWidth"
    :center="true"
    :close-on-click-modal="false"
    class="addSite"
    @close="unShowAdd"
  >
    <el-form
      v-loading="loading"
      ref="newSite"
      :rules="rules"
      :model="newSite"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
      status-icon
    >
      <el-form-item :label-width="formLabelWidth" label="网址分类">
        <el-cascader
          :key="isResouceShow"
          :options="sortCascader"
          v-model="sort"
          :filterable="true"
          expand-trigger="hover"
        />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="网址名称" prop="siteName">
        <el-input v-model="newSite.siteName" auto-complete="off" placeholder="请输入网址名称，推荐5个字符以内" />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="网址链接" prop="siteUrl">
        <el-input v-model="newSite.siteUrl" type="url" auto-complete="off" placeholder="请输入网址链接" />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="图标地址" prop="logoSrc">
        <el-input
          v-model="newSite.logoSrc"
          :disabled="userInfo.role!==1"
          type="url"
          auto-complete="off"
          placeholder="请输入图标地址"
        />
        <img :src="newSite.logoSrc" class="logo" />
        <p class="tips">Tips: 多数情况下输入正确的网址后自动更新图标</p>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="网站描述" prop="siteTips">
        <el-input
          v-model="newSite.siteTips"
          type="textarea"
          auto-complete="off"
          placeholder="请一句话描述网站"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="unShowAdd">取 消</el-button>
      <el-button type="primary" @click="submitSite(type,'newSite')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "EditSite",
  props: {
    siteId: {
      type: Number,
      default: null
    },
    subSortId: {
      type: Number,
      default: null
    },
    sortId: {
      type: Number,
      default: null
    },
    siteIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      loadingText: "加载中...",
      isAdd: false,
      addSiteTitle: "添加网址",
      dialogWidth: "500px",
      formLabelWidth: "4rem",
      sort: [],
      isResouceShow:0,//Cascader的key值,重新渲染Cascader
      type: "add", //添加还是编辑网址类型
      newSite: {
        siteName: "",
        siteUrl: "",
        subSortId: "",
        siteId: "",
        siteTips: "",
        logoSrc: "",
        sortId: "",
        siteIndex: 0
      },
      isSubmit: false,
      rules: {
        siteName: [
          { required: true, message: "请输入网址名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        siteUrl: [
          { required: true, message: "请输入网址链接", trigger: "blur" },
          { type: "url", message: "请输入正确的网址格式" },
          {
            validator: async (rule, val, callback) => {
              if (!this.isSubmit) {
                let { data, status } = await this.$axios.get(
                  "/sites/checkSite",
                  {
                    params: { siteUrl: val }
                  }
                );
                if (status === 200 && data.code === "01") {
                  // 非提交状态 input失去焦点或替换logo
                  this.newSite.logoSrc = data.respData.logoSrc;
                  if (this.type === "add" && data.respData.siteInfo) {
                    callback(
                      `该网址已存在于${data.respData.siteInfo.sortInfo}`
                    );
                  } else {
                    callback();
                  }
                } else if (data.code === "00") {
                  this.newSite.logoSrc = data.respData.logoSrc;
                  callback();
                } else {
                  callback(new Error(data.msg));
                }
              }
            },
            trigger: "blur"
          }
        ],
        logoSrc: [
          { required: false, message: "请输入图标网址链接", trigger: "blur" },
          { type: "url", message: "请输入正确的网址格式" }
        ]
      }
    };
  },
  computed: {
    subSortList() {
      return this.$store.state.sites.subSortList;
    },
    // 网址分类联动下拉框的sortList数据
    sortCascader: function() {
      var newSortList = [],
        key = 0;
      this.subSortList.forEach(item => {
        if (key != 0 && newSortList[key - 1].value === item.sortId) {
          newSortList[key - 1].children.push({
            label: item.subTitle,
            value: item.subSortId
          });
        } else {
          newSortList.push({
            label: item.sortName,
            value: item.sortId,
            children: [
              {
                label: item.subTitle,
                value: item.subSortId
              }
            ]
          });
          key++;
        }
      });
      this.$store.commit("sites/setSortList", newSortList);
      return newSortList;
    },
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  watch: {
    isAdd(val) {
      if (val) {
        // 获取下拉框分类
        this.getSubSort();
        this.subSortList.forEach(item => {
          if (item.subSortId === this.subSortId) {
            this.sort = [item.sortId, this.subSortId];
            return;
          }
        });

        if (this.sort.length === 0) {
          this.sort = [this.sortId, this.subSortId];
        }
        this.getSiteInfo();
      } else {
        this.sort = [];
      }
    },
    // 重新渲染Cascader
    sortCascader(val){
      this.isResouceShow++;
    }
  },
  beforeMount() {
    this.getSubSort();
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
        let { status, data } = await this.$axios.get("/subSort/get");
        if (status === 200 && data.code === "01") {
          this.$store.commit("sites/setSubSortList", data.respData.subSortList);
        }
      }
    },
    unShowAdd: function() {
      this.isAdd = false;
      this.$refs["newSite"].resetFields();
    },
    submitSite: function(type, formName) {
      var self = this;
      this.isSubmit = true; // 如果submit提交,就不替换logo
      this.$refs[formName].validate(valid => {
        this.isSubmit = false; // 如果submit提交,就不替换logo
        if (valid) {
          if (type == "add") {
            self.insertSite();
          } else {
            // 如果是编辑网址
            self.updateSite();
          }
        }
      });
    },
    async getSiteInfo() {
      if (this.siteId) {
        this.loading = true;
        this.loadingText = "加载中...";
        this.addSiteTitle = "编辑网址";
        this.type = "edit";
        let { status, data } = await this.$axios.get("/sites/get", {
          params: { siteId: this.siteId }
        });
        if (status === 200 && data.code === "01") {
          var respData = data.respData.siteInfo;
          this.newSite = respData;
        }
        this.loading = false;
      } else {
        this.addSiteTitle = "添加网址";
        this.type = "add";
      }
    },
    /**
     * @name 网址更新
     * @desc 分为只更新网址 和更新网址分类两种情况
     */
    updateSite: async function() {
      var self = this;
      var reqData = {
        siteId: self.newSite.siteId,
        logoSrc: self.newSite.logoSrc,
        logoId: self.newSite.logoId,
        siteName: self.newSite.siteName,
        siteUrl: self.newSite.siteUrl,
        subSortId: self.sort[1],
        siteTips: self.newSite.siteTips
      };

      this.loading = true;
      this.loadingText = "更新中...";
      let { status, data } = await this.$axios.post("/sites/edit", reqData);
      this.loading = false;
      if (status === 200 && data.code === "01") {
        this.$store.commit("sites/setIsUpdateAll", true);
        this.$message({
          type: "success",
          message: data.msg,
          duration: 1000
        });
        // 关闭弹窗
        this.unShowAdd();
      } else {
        this.$message({
          type: "error",
          message: data.msg,
          duration: 1000
        });
      }
    },
    /**插入新网址 */
    insertSite: async function() {
      this.newSite.subSortId = this.sort[1];
      var siteIndex = this.siteIndex;
      this.loading = true;
      this.loadingText = "更新中...";
      let { data, status } = await this.$axios.post(
        "/sites/insert",
        Object.assign(this.newSite, { siteIndex: ++siteIndex })
      );
      this.loading = false;
      if (status === 200 && data.code === "01") {
        this.$store.commit("sites/setIsUpdateAll", true);
        this.$message({
          message: data.msg,
          type: "success"
        });
        // 关闭弹窗
        this.unShowAdd();
      } else {
        this.$message({
          type: "error",
          message: data.msg,
          duration: 1000
        });
      }
    }
  }
};
</script>
<style lang="scss">
.addSite .el-input {
  width: 80%;
}
.addSite .logo {
  vertical-align: middle;
  width: 1.5rem;
}
.addSite .tips {
  font-size: 0.5rem;
  color: #999;
}
</style>

