<template>
  <div>
    <search />
    <section ref="container" class="container">
      <div v-show="componentSiteList[0].length>0" class="grid">
        <site-box
          v-for="item in componentSiteList[0]"
          :key="item.sortId"
          :sub-list="item.subList"
          :sort-name="item.sortName"
          :sort-id="item.sortId"
          :color="item.color"
          :show-icon="showIcon"
          @showEditBox="showEditBox"
          @showEditSubSortBox="showEditSubSortBox"
        />
      </div>
      <div
        v-loading="true"
        v-if="siteList.length==0"
        element-loading-text="正在加载网址"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0)"
        class="blank"
      />
      <div v-show="componentSiteList[1].length>0" class="grid">
        <site-box
          v-for="item in componentSiteList[1]"
          :key="item.sortId"
          :sub-list="item.subList"
          :sort-name="item.sortName"
          :sort-id="item.sortId"
          :color="item.color"
          :show-icon="showIcon"
          @showEditBox="showEditBox"
          @showEditSubSortBox="showEditSubSortBox"
        />
      </div>
      <div v-show="editState" class="sort-add">
        <input
          ref="addSort"
          :class="['sort-input',{'show-sort-input':showSortEdit}]"
          v-model="newSortName"
          type="text"
          placeholder="四个字以内"
        />
        <el-select
          v-show="showSortEdit"
          v-model="sortColor"
          class="sort-select"
          placeholder="请选择颜色"
          size="small"
        >
          <el-option
            v-for="item in sortColorList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="sort-select-item"
          >
            <span style="margin-right:10px;height: 100%;">
              <div
                :style="{width:'40px',height:'70%',backgroundColor:item.key,margin:'10% 0',boxSizing:'border-box'}"
              />
            </span>
            <span style="color: #8492a6; font-size: 13px">{{ item.label }}</span>
          </el-option>
        </el-select>
        <el-tooltip content="添加分类" placement="top">
          <i v-show="!showSortEdit" class="iconfont icon-add" @click="showSortEditBox" />
        </el-tooltip>
        <el-tooltip content="确认添加" placement="top">
          <i v-show="showSortEdit" class="iconfont icon-yes" @click="addSort" />
        </el-tooltip>
        <el-tooltip content="取消添加" placement="top">
          <i v-show="showSortEdit" class="iconfont icon-del" @click="addSort" />
        </el-tooltip>
      </div>
      <edit-site
        v-if="editState"
        ref="editSite"
        :site-id="siteId"
        :sort-id="sortId"
        :site-index="siteIndex"
        :sub-sort-id="subSortId"
      />
      <edit-sort ref="editSort" :sub-title="subTitle" :sort-id="sortId" :sub-sort-id="subSortId" />
      <sort-order v-if="editState&&type!=='mobile'" class="drag-sort" />
    </section>
    <feed-back />
  </div>
</template>

<script>
import SiteBox from "@/components/siteBox/siteBox";
import SortOrder from "@/components/siteBox/sortOrder";
import EditSite from "@/components/public/dialog/EditSite";
import EditSort from "@/components/public/dialog/EditSort";
import FeedBack from "@/components/public/dialog/FeedBack";
import Search from "@/components/public/search/search.vue";
import { mapState } from "vuex";
export default {
  layout: "default",
  components: { SiteBox, SortOrder, EditSite, EditSort, FeedBack, Search },
  data() {
    return {
      siteSet: [],
      showIcon: true,
      siteId: 0,
      sortId: 0,
      subTitle: "",
      subSortId: 0,
      newSortName: "",
      showSortEdit: false,
      sortColor: "blue",
      siteIndex: 0, //*网址排序索引
      sortColorList: [
        {
          key: "rgb(237, 85, 106)",
          label: "山茶红",
          value: "red"
        },
        {
          key: "rgb(41, 155, 248)",
          label: "天湖蓝",
          value: "blue"
        },
        {
          key: "rgb(14, 176, 201)",
          label: "孔雀蓝",
          value: "kongquelan"
        },
        {
          key: "rgb(120, 41, 248)",
          label: "罗兰紫",
          value: "purple"
        },
        {
          key: "rgb(245, 248, 41)",
          label: "金瓜黄",
          value: "yellow"
        },
        {
          key: "rgb(248, 182, 41)",
          label: "淡橘橙",
          value: "orange"
        },
        {
          key: "rgba(91,174,35,1)",
          label: "鹦鹉绿",
          value: "green"
        },
        {
          key: "rgba(83, 60, 27,1)",
          label: "古铜绿",
          value: "tongGreen"
        }
      ]
    };
  },
  computed: {
    ...mapState(["type"]),
    ...mapState("sites", {
      editState: "editState",
      isUpdateAll: "isUpdateAll",
      siteList: "siteList"
    }),
    // 分为两个数组
    componentSiteList() {
      var componentSiteList = [[], []];
      if (process.browser) {
        if (window.document.body.clientWidth > 768) {
          if (this.siteList && this.siteList.length > 0) {
            this.siteList.forEach((item, index) => {
              if (index % 2 == 0) {
                componentSiteList[0].push(item);
              } else {
                componentSiteList[1].push(item);
              }
            });
          }
        } else {
          componentSiteList = [this.siteList, []];
        }
      }
      return componentSiteList;
    }
  },
  watch: {
    isUpdateAll(val) {
      if (val) {
        this.updateAll();
      }
    }
  },
  /**
   * 打开页面渲染前服务器端获取所有网址信息
   */
  async asyncData(ctx) {
    var siteList = ctx.store.state.sites.siteList || [];
    if (siteList.length === 0) {
      let { status, data } = await ctx.$axios.get("/sites/getAll");
      if (status === 200 && data.code === "01") {
        ctx.store.commit("sites/setSiteList", data.respData.siteList);
      }
    }
  },
  created() {
    this.openLoading();
  },
  beforeMount() {
    setTimeout(() => {
      this.$refs.container.style.opacity = 1;
      this.loading.close();
    }, 0);
    if (window.document.body.clientWidth <= 768) {
      this.showIcon = false;
      this.$store.commit("setType", "mobile");
    }
  },
  methods: {
    /**
     * 更新所有网址信息
     */
    async updateAll() {
      let { status, data } = await this.$axios.get("/sites/getAll");
      if (status === 200 && data.code === "01") {
        this.$store.commit("sites/setSiteList", data.respData.siteList);
        this.$store.commit("sites/setIsUpdateAll", false);
      }
    },
    /**
     * 打开加载动画
     */
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    /**
     * 显示编辑网址弹窗
     */
    showEditBox(id) {
      this.siteId = id.siteId;
      this.subSortId = id.subSortId;
      this.sortId = id.sortId;
      this.siteIndex = id.siteIndex;
      this.$refs.editSite.isAdd = true;
    },
    /**
     * 显示编辑网址弹窗
     */
    showEditSubSortBox(id) {
      this.subTitle = id.subTitle;
      this.subSortId = id.subSortId;
      this.sortId = id.sortId;
      this.$refs.editSort.editSortShow = true;
    },
    showSortEditBox() {
      this.showSortEdit = true;
      this.$refs.addSort.focus();
    },
    hideSortEditBox() {
      this.showSortEdit = false;
      this.newSortName = "";
      this.sortColor = "blue";
    },
    addSort() {
      if (!this.newSortName) {
        this.hideSortEditBox();
      } else {
        this.$confirm(`请确认是否添加分类 ${this.newSortName} `, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async confirm => {
            var sortIndex = this.componentSiteList[1][
              this.componentSiteList[1].length - 1
            ].sortIndex;
            let { status, data } = await this.$axios.post("/sort/insert", {
              sortName: this.newSortName,
              color: this.sortColor,
              sortIndex: ++sortIndex
            });
            if (status === 200 && data.code === "01") {
              this.$message({
                type: "success",
                message: data.msg
              });
              this.$store.commit("sites/setIsUpdateAll", true);
              this.$store.commit("sites/setSubSortList", []);
              this.hideSortEditBox();
            }
          })
          .catch(cancel => {
            this.hideSortEditBox();
          });
      }
    }
  }
};
</script>

<style lang="scss">
.blank {
  color: #fff;
  width: 100%;
  text-align: center;
}
.container {
  width: 85%;
  max-width: 60rem;
  padding: 1rem;
  box-sizing: border-box;
  margin: 0 auto;
  // border: 1px solid gray;
  // background: rgba(255, 255, 255, 0.3);
  opacity: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  .grid {
    width: 49%;
  }
  .sort-add {
    width: 100%;
    height: 3rem;
    line-height: 1.5rem;
    font-size: 2rem;
    color: #fff;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    .sort-input {
      width: 0;
    }
    .sort-input,
    .sort-select input {
      outline: none;
      border: none;
      height: 1.5rem;
      background-color: rgba(255, 255, 255, 1);
      transition: width 0.2s ease;
      &.show-sort-input {
        width: 6rem;
        padding: 0 5px;
      }
    }
    .sort-select {
      line-height: normal;
      margin: 0 0.5rem;
      input {
        width: 5rem;
        padding: 0 5px;
        outline: none;
        border: none;
        border-radius: 0;
      }
      input::-webkit-input-placeholder {
        color: #757575;
      }
      .el-select .el-input .el-select__caret {
        line-height: 0.4rem;
      }
    }
    .iconfont {
      margin: 0 0.2rem;
      cursor: pointer;
      font-size: 0.9rem;
      &.icon-add {
        font-size: 1.5rem;
      }
    }
  }
}
.sort-select-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 0.4rem;
}
.drag-sort {
  position: fixed;
  right: 2rem;
  color: #fff;
  li {
    height: 1.5rem;
    line-height: 1.5rem;
    padding: 0 0.5rem;
    border: 1px dashed;
    cursor: move;
  }
}
.icon-del {
  color: red;
  font-size: 0.7rem;
  &:active {
    color: #bd0707;
  }
}
.icon-add,
.icon-edit,
.icon-yes {
  color: #fff;
  font-size: 0.7rem;
  cursor: pointer;
  &:active {
    color: #d0d0d0;
  }
}
</style>
